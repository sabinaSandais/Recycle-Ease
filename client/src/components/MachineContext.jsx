import React, { useState, createContext, useContext } from "react";
import PropTypes from "prop-types";

const statusChangeData = {
  machineId: "",
  status: "",
  timeStamp: "",
};

const StatusChangeContext = createContext();

export const useStatusChange = () => useContext(StatusChangeContext);

export const StatusChangeProvider = ({ children }) => {
  const [statusChange, setStatusChange] = useState(statusChangeData);

 
    const onStatusChange = (data) =>{
      const { machineId, status, timeStamp } = data;

      setStatusChange((prevState) => ({
        ...prevState,
        machineId,
        status,
        timeStamp,
      }));
    }


  return (
    // Step 3: Provide the status change state to all children
    <StatusChangeContext.Provider value={ {statusChange, onStatusChange} }>
      {children}
    </StatusChangeContext.Provider>
  );
};
StatusChangeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
