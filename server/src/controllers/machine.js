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
