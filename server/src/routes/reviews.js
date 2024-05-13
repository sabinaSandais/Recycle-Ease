import express from "express";
import { createReview, getReviews } from "../controllers/reviews.js";

const reviewsRouter = express.Router();

reviewsRouter.get("/:machineId", getReviews);

export default reviewsRouter;

reviewsRouter.post("/:machineId", createReview);
