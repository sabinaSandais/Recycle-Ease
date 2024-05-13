import React from "react";
import { createRoot } from "react-dom/client";
import { StatusChangeProvider } from "./components/StatusChangeContext";
import { FavoriteProvider } from "./components/FavoriteContext";

import AppWrapper from "./AppWrapper";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <AppWrapper>
    <FavoriteProvider>
    <StatusChangeProvider>
      <App />
    </StatusChangeProvider>
    </FavoriteProvider>
  </AppWrapper>,
);
