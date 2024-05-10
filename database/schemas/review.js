import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  comment: String,
  stars: Number,
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
