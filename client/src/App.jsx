import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { socket } from "./socket";
import Home from "./pages/Home/Home";
import Demo from "./pages/Demo/Demo";
import Favorites from "./pages/Favorites/Favorites";
import AboutUs from "../../client/src/components/AboutUs";
import { logInfo } from "../../server/src/util/logging";
import { useMachine } from "./components/MachineContext";

import "./app.css";

const App = () => {
  const [socketId, setSocketId] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const { statusChange, onStatusChange } = useMachine();

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
        <Route path="/demo" element={<Demo />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </>
  );
};

export default App;
