import React from "react";
import { createRoot } from "react-dom/client";
import { StatusChangeProvider } from "./components/StatusChangeContext";
import { ApplicationContextProvider } from "./context/applicationContext";

import AppWrapper from "./AppWrapper";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <AppWrapper>
    <ApplicationContextProvider>
      <StatusChangeProvider>
        <App />
      </StatusChangeProvider>
    </ApplicationContextProvider>
  </AppWrapper>,
);
