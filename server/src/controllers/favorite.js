import User from "../models/User.js";
import Machine from "../models/Machine.js";
import { logError } from "../util/logging.js";

export const getFavorite = async (req, res) => {
  const userId = req.id;

  try {
    const user = await User.findById(userId).populate("favorites");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const favorites = user.favorites;

    const machines = await Machine.find({ _id: { $in: favorites } });

    return res.status(200).json({ success: true, machines });
  } catch (error) {
    logError(error);
    return res.status(500).json({ error: "Unable to get favorite machines" });
  }
};

export const saveFavorite = async (req, res) => {
  const userId = req.id;
  const { machineId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.favorites.push(machineId);
    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "Machine added to favorites" });
  } catch (error) {
    logError(error);
    return res
      .status(500)
      .json({ error: "Unable to add machine to favorites" });
  }
};

export const deleteFavorite = async (req, res) => {
  const userId = req.id;
  const { machineId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.favorites.pull(machineId);
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Machine removed from favorites" });
  } catch (error) {
    logError(error);
    return res
      .status(500)
      .json({ error: "Unable to remove machine from favorites" });
  }
};
