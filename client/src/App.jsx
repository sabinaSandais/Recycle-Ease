import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { socket } from "./socket";
import Home from "./pages/Home/Home";
import { logInfo } from "../../server/src/util/logging";

const App = () => {
  const [socketId, setSocketId] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

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
    logInfo(`Socket ID: ${socketId}`);
    logInfo(`Socket connected: ${socketConnected}`);
  }, [socketId, socketConnected]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
};

export default App;
