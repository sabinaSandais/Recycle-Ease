import React, { useState, useEffect } from "react";
import MapComponent from "../../components/Map";
import { LocationProvider } from "../../components/LocationContext";
import TEST_ID from "./Home.testid";
import Nav from "../../components/navbar/Nav";
import Notification from "../../components/notification/Notification";

import { userContext } from "../../context/userContext";
import { infoContext } from "../../context/infoContext";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "", token: "", id: "" });
  const [info, setInfo] = useState({ message: "", type: "" });
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    if (info.message !== "") {
      setShowNotification(true);
    }
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [info]);

  return (
    <div data-testid={TEST_ID.container}>
      <infoContext.Provider
        value={{ info, setInfo, showNotification, setShowNotification }}
      >
        {info.message !== "" ? (
          <Notification message={info.message} type={info.type} />
        ) : (
          <></>
        )}
        <userContext.Provider
          value={{ isLoggedIn, setIsLoggedIn, user, setUser }}
        >
          <Nav />
        </userContext.Provider>
        <LocationProvider>
          <MapComponent />
        </LocationProvider>
      </infoContext.Provider>
    </div>
  );
};

export default Home;
