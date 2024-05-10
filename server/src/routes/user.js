import express from "express";
import {
  createUser,
  getUsers,
  login,
  deleteUser,
} from "../controllers/user.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/", createUser);
userRouter.post("/login", login);
userRouter.delete("/:id", deleteUser);

export default userRouter;
