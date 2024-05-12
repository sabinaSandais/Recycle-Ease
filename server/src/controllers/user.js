import User, { validateUser } from "../models/User.js";
import { logError } from "../util/logging.js";
import validationErrorMessage from "../util/validationErrorMessage.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secret = "test";

/******************* GET USERS ******************
 *  Get all users from the database
 * */

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, result: users });
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ success: false, msg: "Unable to get users, try again later" });
  }
};

/******************* CREATE USER ******************
 *
 * Creating a new user by providing the name, email and password
 *
 * */

export const createUser = async (req, res) => {
  try {
    const { user } = req.body;

    logError(user);

    if (typeof user !== "object") {
      res.status(400).json({
        success: false,
        msg: `You need to provide a 'user' object. Received: ${JSON.stringify(
          user,
        )}`,
      });

      return;
    }

    const errorList = validateUser(user);

    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;

    if (errorList.length > 0) {
      res
        .status(400)
        .json({ success: false, msg: validationErrorMessage(errorList) });
    } else {
      const newUser = await User.create(user);

      res.status(201).json({ success: true, user: newUser });
    }
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ success: false, msg: "Unable to create user, try again later" });
  }
};

/******************* DELETE USER ******************
 * Delete a user from the database
 * */

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (user == null) {
      res.status(404).json({ success: false, msg: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ success: false, msg: "Unable to delete user, try again later" });
  }
};

// user login function to authenticate user and generate token for user

/******************* LOGIN ******************
 *
 * Logging in a user by providing the name and password
 *
 * */
export const login = async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    res
      .status(400)
      .json({ error: "You must Provide both UserName and Password" });
    return;
  }

  // check if the user exists in the database

  const isUserExist = await User.findOne({ name: name });

  if (!isUserExist) {
    res.status(400).json({ error: "User does not exist" });
    return;
  }

  const user = isUserExist;
  const passwordCorrect = await bcrypt.compare(password, user.password);

  if (!passwordCorrect) {
    res.status(400).json({ error: "Password is incorrect" });
    return;
  }

  const token = jwt.sign({ name: user.name, id: user.id }, secret, {
    expiresIn: "1h",
  });

  res.status(200).json({ token: token, userId: user._id, name: user.name });
};
