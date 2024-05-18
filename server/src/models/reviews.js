import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema({
  comment: String,
  stars: Number,
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "machines",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const reviews = mongoose.model("reviews", reviewsSchema);

export default reviews;
