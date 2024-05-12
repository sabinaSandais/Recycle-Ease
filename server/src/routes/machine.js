import express from "express";
import { getMachines, updateMachineStatus } from "../controllers/machine.js";

const machineRouter = express.Router();

machineRouter.get("/", getMachines);
machineRouter.post("/:id", updateMachineStatus);
export default machineRouter;
