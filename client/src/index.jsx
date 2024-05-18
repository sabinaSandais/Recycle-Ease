import React from "react";
import { createRoot } from "react-dom/client";
import { ApplicationContextProvider } from "./context/applicationContext";
import { MachineProvider } from "./components/MachineContext";
import { FavoriteProvider } from "./components/FavoriteContext";
import { LocationProvider } from "./components/LocationContext";

import AppWrapper from "./AppWrapper";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <AppWrapper>
    <ApplicationContextProvider>
      <MachineProvider>
        <FavoriteProvider>
          <LocationProvider>
            <App />
          </LocationProvider>
        </FavoriteProvider>
      </MachineProvider>
    </ApplicationContextProvider>
  </AppWrapper>,
);
