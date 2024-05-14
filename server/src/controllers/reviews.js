import Review from "../models/reviews.js";
import { logError } from "../util/logging.js";
import Machine from "../models/Machine.js";
export const createReview = async (req, res) => {
  try {
    const { comment, stars, machineId, userId } = req.body;
    const review = new Review({
      comment,
      stars,
      machine: machineId,
      user: userId,
    });
    await review.save();
    res
      .status(201)
      .json({ success: true, message: "Review created successfully" });
  } catch (error) {
    logError(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getReviews = async (req, res) => {
  try {
    const machineId = req.params.machineId;
    const reviews = await Review.find({ machine: machineId });
    const machine = await Machine.findById(machineId);
    machine.score = averageScore(reviews);
    await machine.save();
    res.status(200).json({ success: true, result: reviews });
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ success: false, msg: "Unable to get reviews, try again later" });
  }
};

const averageScore = (reviews) => {
  const total = reviews.reduce((acc, review) => acc + review.stars, 0);
  return (total / reviews.length).toFixed(1);
};
