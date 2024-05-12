import Review from "../models/reviews.js";
import { logError } from "../util/logging.js";

export const getReviews = async (req, res) => {
  try {
    const machineId = req.params.machineId;

    // Find all reviews that have the specified machine ID
    const reviews = await Review.find({ machine: machineId });

    res.status(200).json({ success: true, result: reviews });
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ success: false, msg: "Unable to get reviews, try again later" });
  }
};
