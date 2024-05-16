import React from "react";
import { createRoot } from "react-dom/client";
import { ApplicationContextProvider } from "./context/applicationContext";
import { MachineProvider } from "./components/MachineContext";
import { FavoriteProvider } from "./components/FavoriteContext";
import AppWrapper from "./AppWrapper";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <AppWrapper>
    <ApplicationContextProvider>
      <FavoriteProvider>
      <MachineProvider>
        <App />
      </MachineProvider>
      </FavoriteProvider>
    </ApplicationContextProvider>
  </AppWrapper>,
);
