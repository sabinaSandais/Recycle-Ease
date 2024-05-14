import React, { useState, createContext, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import greenPin from "./assets/Map_pin_icon_green.svg";
import redPin from "./assets/map-marker.svg";
import L from "leaflet";

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

  const replaceMarker = (machineId) => {
    markers.forEach((marker) => {
      if (marker.machineId === machineId) {
        marker.setIcon(
          L.icon({
            iconUrl: statusChange.status === 1 ? greenPin : redPin,
            iconSize: [25, 41],
          }),
        );
      }
    });
  };

  useEffect(() => {
    replaceMarker(statusChange.machineId);
  }, [machines]);

  const onStatusChange = (data) => {
    const { machineId, status, timeStamp } = data;
    const newMachines = [...machines];
    newMachines.forEach((machine) => {
      if (machine._id === machineId) {
        machine.status = status;
        machine.status_update_time = timeStamp;
      }
    });
    setMachines(newMachines);
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
