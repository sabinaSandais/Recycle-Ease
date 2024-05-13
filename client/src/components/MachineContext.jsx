import React, { useState, createContext, useContext } from "react";
import PropTypes from "prop-types";

const statusChangeData = {
  machineId: "",
  status: "",
  timeStamp: "",
};

const MachineContext = createContext();

export const useMachine = () => useContext(MachineContext);

export const MachineProvider = ({ children }) => {
  const [statusChange, setStatusChange] = useState(statusChangeData);

  const onStatusChange = (data) => {
    const { machineId, status, timeStamp } = data;

    setStatusChange((prevState) => ({
      ...prevState,
      machineId,
      status,
      timeStamp,
    }));
  };

  return (
    // Step 3: Provide the status change state to all children
    <MachineContext.Provider value={{ statusChange, onStatusChange }}>
      {children}
    </MachineContext.Provider>
  );
};
MachineProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
