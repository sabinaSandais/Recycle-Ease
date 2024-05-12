import Machine from "../models/Machine.js";
import { logError } from "../util/logging.js";

export const getMachines = async (req, res) => {
  try {
    const machines = await Machine.find();
    res.status(200).json({ success: true, result: machines });
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ success: false, msg: "Unable to get machines, try again later" });
  }
};

// Update the status of the machine

export const updateMachineStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const machine = await Machine.findById(id);

    if (!machine) {
      res.status(404).json({ success: false, msg: "Machine not found" });
      return;
    }

    machine.status = machine.status === 1 ? 0 : 1;
    await machine.save();

    res.status(200).json({ success: true, result: machine });
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: "Unable to update machine status, try again later",
    });
  }
};
