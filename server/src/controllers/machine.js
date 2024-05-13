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

// Update the status of specific the machine

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

// Update the status of all machines to 0 (off)

export const turnOffAllMachines = async (req, res) => {
  try {
    await Machine.updateMany({}, { status: 0 });
    res.status(200).json({ success: true, msg: "All machines turned off" });
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: "Unable to turn off all machines, try again later",
    });
  }
};

// Update the status of all machines to 1 (on)

export const turnOnAllMachines = async (req, res) => {
  try {
    await Machine.updateMany({}, { status: 1 });
    res.status(200).json({ success: true, msg: "All machines turned on" });
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: "Unable to turn on all machines, try again later",
    });
  }
};

// toggle the state 50% of the machine status

export const toggleMachineStatus = async (req, res) => {
  try {
    const machines = await Machine.find();
    machines.forEach(async (machine, index) => {
      if (index < machines.length / 2) {
        machine.status = machine.status === 1 ? 0 : 1;
      }
      await machine.save();
    });
    res
      .status(200)
      .json({ success: true, msg: "Toggle machine status successfully" });
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: "Unable to toggle machine status, try again later",
    });
  }
};
