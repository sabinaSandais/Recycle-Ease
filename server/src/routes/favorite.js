import express from "express";
import {
  getFavorite,
  saveFavorite,
  deleteFavorite,
} from "../controllers/favorite.js";
import auth from "../util/auth.js";

const favoriteRouter = express.Router();

favoriteRouter.get("/", auth, getFavorite);

favoriteRouter.post("/", auth, saveFavorite);

favoriteRouter.delete("/", auth, deleteFavorite);
export default favoriteRouter;
