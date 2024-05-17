import React from "react";
import Favorite from "../../components/Favorite";
import { LocationProvider } from "../../components/LocationContext";
import Nav from "../../components/navbar/Nav";
import Notification from "../../components/notification/Notification";
import { useApplicationContext } from "../../context/applicationContext";

const Favorites = () => {
  const { info } = useApplicationContext();

  return (
    <div>
      {info.message !== "" ? (
        <Notification message={info.message} type={info.type} />
      ) : (
        <></>
      )}
      <Nav />
      <LocationProvider>
        <Favorite />
      </LocationProvider>
    </div>
  );
};

export default Favorites;
