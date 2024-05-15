import React from "react";
import MapComponent from "../../components/Map";
import SearchBar from "../../components/SearchBar";
import { LocationProvider } from "../../components/LocationContext";
import TEST_ID from "./Home.testid";
import Nav from "../../components/navbar/Nav";
import Notification from "../../components/notification/Notification";
import { useApplicationContext } from "../../context/applicationContext";

const Home = () => {
  const { info } = useApplicationContext();

  return (
    <div data-testid={TEST_ID.container}>
      {info.message !== "" ? (
        <Notification message={info.message} type={info.type} />
      ) : (
        <></>
      )}

      <LocationProvider>
        <Nav />
        <MapComponent />
        <SearchBar />
      </LocationProvider>
    </div>
  );
};

export default Home;
