import React, { useState, createContext, useContext } from "react";
import PropTypes from "prop-types";
import { logInfo } from "../../../server/src/util/logging";
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
    const updatedMarkers = markers.map((marker) => {
      if (marker.machineId === machineId) {
        const machine = machines.find((machine) => machine._id === machineId);
        if (machine) {
          const iconUrl = machine.status === 1 ? greenPin : redPin;
          const updatedIcon = L.icon({ iconUrl, iconSize: [25, 41] });
          logInfo("updatedIcon", updatedIcon);
          return {
            ...marker,
            options: { ...marker.options, icon: updatedIcon },
          };
        } else {
          logInfo("Machine not found");
          return marker;
        }
      } else {
        return marker;
      }
    });
    setMarkers(updatedMarkers);
  };

  const onStatusChange = (data) => {
    const { machineId, status, timeStamp } = data;
    logInfo("onStatusChange", machineId);
    replaceMarker(machineId);
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
