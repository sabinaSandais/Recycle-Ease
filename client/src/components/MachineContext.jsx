import React, { useState, createContext, useContext } from "react";
import PropTypes from "prop-types";
import { logInfo } from "../../../server/src/util/logging";

const statusChangeData = {
  machineId: "",
  status: "",
  timeStamp: "",
};

const MachineContext = createContext();

export const useMachine = () => useContext(MachineContext);

export const MachineProvider = ({ children }) => {
  const [statusChange, setStatusChange] = useState(statusChangeData);
  const [machines, setMachines] = useState([]);
  const [markers, setMarkers] = useState([]);

  const removeMarker = (machineId) => {
    // Find the marker with the specified machine ID
    const markerToRemove = markers.find(
      (marker) => marker.machineId === machineId,
    );
    if (markerToRemove) {
      // Remove the marker from the map
      markerToRemove.remove();
    } else {
      logInfo("Marker not found");
    }
  };

  const onStatusChange = (data) => {
    const { machineId, status, timeStamp } = data;
    removeMarker(machineId);
    setStatusChange((prevState) => ({
      ...prevState,
      machineId,
      status,
      timeStamp,
    }));
  };

  return (
    // Step 3: Provide the status change state to all children
    <MachineContext.Provider
      value={{
        statusChange,
        onStatusChange,
        setMarkers,
        setMachines,
        machines,
      }}
    >
      {children}
    </MachineContext.Provider>
  );
};
MachineProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
