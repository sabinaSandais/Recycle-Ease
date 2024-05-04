import React from "react";
import MapComponent from "../../components/Map";
import { LocationProvider } from "../../components/LocationContext";
import TEST_ID from "./Home.testid";

const Home = () => {
  return (
    <div data-testid={TEST_ID.container}>
      <LocationProvider>
        <MapComponent />
      </LocationProvider>
    </div>
  );
};

export default Home;
