import express from "express";
import { getMachines } from "../controllers/machine.js";

const machineRouter = express.Router();

machineRouter.get("/", getMachines);

export default machineRouter;
