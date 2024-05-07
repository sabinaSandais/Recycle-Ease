import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { socket } from "./socket";
import Home from "./pages/Home/Home";
import { logInfo } from "../../server/src/util/logging";

const machineData = {
  machineId: "",
  status: "",
  timeStamp: "",
};
const App = () => {
  const [socketId, setSocketId] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [statusChange, setStatusChange] = useState(machineData);

  useEffect(() => {
    function onConnect() {
      setSocketId(socket.id);
      setSocketConnected(true);
    }
    function onDisconnect() {
      setSocketId(null);
      setSocketConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    function onStatusChange(data) {
      const { machineId, status, timeStamp } = data;

      setStatusChange((prevState) => ({
        ...prevState,
        machineId,
        status,
        timeStamp,
      }));
    }

    socket.on("statusChange", onStatusChange);

    return () => {
      socket.off("statusChange", onStatusChange);
    };
  }, [statusChange]);

  useEffect(() => {
    const { machineId, status, timeStamp } = statusChange;
    logInfo(`Socket ID: ${socketId}`);
    logInfo(`Socket connected: ${socketConnected}`);
    logInfo(`Status change: ${machineId} - ${status} - ${timeStamp}`);
  }, [socketId, socketConnected, statusChange]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
};

export default App;
