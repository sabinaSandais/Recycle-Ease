import Review from "../models/reviews.js";
import Machine from "../models/Machine.js";
import { logError } from "../util/logging.js";

export const createReview = async (req, res) => {
  try {
    const { comment, stars, machineId, userId } = req.body;
    const review = new Review({
      comment,
      stars,
      machine: machineId,
      user: userId,
      created_at: new Date(),
    });
    const savedReview = await review.save();
    await Machine.findByIdAndUpdate(machineId, {
      $push: { reviews: { $each: [savedReview._id], $position: 0 } },
    });

    res
      .status(201)
      .json({ success: true, message: "Review created successfully" });
    review;
  } catch (error) {
    logError(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getReviews = async (req, res) => {
  try {
    const machineId = req.params.machineId;
    const machine = await Machine.findById(machineId).populate("reviews");
    if (!machine) {
      return res
        .status(404)
        .json({ success: false, message: "Machine not found" });
    }
    res.status(200).json({ success: true, result: machine.reviews });
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      message: "Unable to get reviews, try again later",
    });
  }
};
