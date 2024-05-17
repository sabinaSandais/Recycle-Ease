import React from "react";
import { createRoot } from "react-dom/client";
import { ApplicationContextProvider } from "./context/applicationContext";
import { MachineProvider } from "./components/MachineContext";
import { FavoriteProvider } from "./components/FavoriteContext";
import AppWrapper from "./AppWrapper";
import { LocationProvider } from "./components/LocationContext";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <AppWrapper>
    <ApplicationContextProvider>
      <FavoriteProvider>
        <MachineProvider>
          <LocationProvider>
            <App />
          </LocationProvider>
        </MachineProvider>
      </FavoriteProvider>
    </ApplicationContextProvider>
  </AppWrapper>,
);
