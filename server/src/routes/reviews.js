import express from "express";
import { getReviews } from "../controllers/reviews.js";

const reviewsRouter = express.Router();

reviewsRouter.get("/:machineId", getReviews);

export default reviewsRouter;
