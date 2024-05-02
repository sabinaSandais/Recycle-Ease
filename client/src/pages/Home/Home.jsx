import React from "react";
import MapComponent from "../../components/Map";

import TEST_ID from "./Home.testid";

const Home = () => {
  return (
    <div data-testid={TEST_ID.container}>
      <MapComponent />
    </div>
  );
};

export default Home;
