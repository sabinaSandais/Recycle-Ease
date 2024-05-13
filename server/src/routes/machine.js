import express from "express";
import {
  getMachines,
  updateMachineStatus,
  turnOffAllMachines,
  turnOnAllMachines,
  toggleMachineStatus,
} from "../controllers/machine.js";

const machineRouter = express.Router();

machineRouter.get("/", getMachines);
machineRouter.post("/:id", updateMachineStatus);
machineRouter.get("/turnOffAll", turnOffAllMachines);
machineRouter.get("/turnOnAll", turnOnAllMachines);
machineRouter.get("/toggleHalf", toggleMachineStatus);
export default machineRouter;
