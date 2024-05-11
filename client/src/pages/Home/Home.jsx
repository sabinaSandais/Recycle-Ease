import React, { useState, useEffect } from "react";
import MapComponent from "../../components/Map";
import { LocationProvider } from "../../components/LocationContext";
import TEST_ID from "./Home.testid";
import Nav from "../../components/navbar/Nav";

import { userContext } from "../../context/userContext";
import { logInfo } from "../../../../server/src/util/logging";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "", token: "", id: "" });

  useEffect(() => {
    logInfo(`User loggedIn state: ${isLoggedIn}`);
    if (user.token !== "" && user.name !== "") {
      localStorage.setItem("user_token", user.token);
      localStorage.setItem("user_name", user.name);
    }

    if (!isLoggedIn) {
      setUser({ name: "", token: "", id: "" });
      localStorage.removeItem("user_token");
      localStorage.removeItem("user_name");
    }

    logInfo(`User logged in: ${isLoggedIn}`);
    logInfo(`User: ${user.name} `);
  }, [isLoggedIn]);

  return (
    <div data-testid={TEST_ID.container}>
      <userContext.Provider
        value={{ isLoggedIn, setIsLoggedIn, user, setUser }}
      >
        <Nav />
      </userContext.Provider>
      <LocationProvider>
        <MapComponent />
      </LocationProvider>
    </div>
  );
};

export default Home;
