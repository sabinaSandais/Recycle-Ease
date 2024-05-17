import React from "react";
import { createRoot } from "react-dom/client";
import { ApplicationContextProvider } from "./context/applicationContext";
import { MachineProvider } from "./components/MachineContext";

import AppWrapper from "./AppWrapper";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <AppWrapper>
    <ApplicationContextProvider>
      <MachineProvider>
        <App />
      </MachineProvider>
    </ApplicationContextProvider>
  </AppWrapper>,
);
