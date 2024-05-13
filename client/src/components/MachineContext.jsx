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
  const [mapRefCurrent, setMapRefCurrent] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isPinClicked, setIsPinClicked] = useState(false);

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

  const addMarker = (markerId) => {
    machines.forEach((machine) => {
      if (machine._id === markerId) {
        const { lat, lon } = machine.location;
        let iconUrl = machine.status === 1 ? greenPin : redPin;
        let icon = L.icon({ iconUrl, iconSize: [25, 41] });
        const marker = L.marker([lat, lon], { icon }).addTo(mapRefCurrent);
        marker.machineId = machine._id;
        marker.on("click", () => {
          setSelectedMachine(machine);
          handleIsPinClicked();
        });
      }
    });
  };
  const handleIsPinClicked = () => {
    setIsPinClicked(true);
  };

  const onStatusChange = (data) => {
    const { machineId, status, timeStamp } = data;
    removeMarker(machineId);
    addMarker; //not working
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
        setMapRefCurrent,
        addMarker,
        selectedMachine,
        setSelectedMachine,
        isPinClicked,
        setIsPinClicked,
        handleIsPinClicked,
      }}
    >
      {children}
    </MachineContext.Provider>
  );
};
MachineProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
