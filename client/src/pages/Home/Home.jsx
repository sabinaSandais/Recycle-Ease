import React from "react";
import AddressSearch from "../../components/SearchBar";

import TEST_ID from "./Home.testid";

const Home = () => {
  return (
    <div data-testid={TEST_ID.container}>
      <h1>This is the homepage</h1>
      <p>Good luck with the project!</p>
      <AddressSearch />
    </div>
  );
};

export default Home;
