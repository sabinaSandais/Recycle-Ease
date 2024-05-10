import React from "react";
import MapComponent from "../../components/Map";
import { LocationProvider } from "../../components/LocationContext";
import TEST_ID from "./Home.testid";
import Nav from "../../components/navbar/Nav";

const Home = () => {
  return (
    <div data-testid={TEST_ID.container}>
      <Nav />
      <LocationProvider>
        <MapComponent />
      </LocationProvider>
    </div>
  );
};

export default Home;
