import express from "express";
import {
  getFavorite,
  saveFavorite,
  deleteFavorite,
} from "../controllers/favorite.js";

const favoriteRouter = express.Router();

favoriteRouter.get("/:userId", getFavorite);

favoriteRouter.post("/:userId", saveFavorite);

favoriteRouter.delete("/:userId/:machineId", deleteFavorite);
export default favoriteRouter;
