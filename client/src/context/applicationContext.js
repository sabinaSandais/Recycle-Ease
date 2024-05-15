import React, { useState, createContext, useContext, useEffect } from "react";
import PropTypes from "prop-types";

// create context
const applicationContext = createContext();

// create a custom hook to use the context
export const useApplicationContext = () => useContext(applicationContext);

// create a provider
export const ApplicationContextProvider = ({ children }) => {
  // define the states
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

  // return the provider with the value
  return (
    <applicationContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        info,
        setInfo,
        showNotification,
        setShowNotification,
      }}
    >
      {children}
    </applicationContext.Provider>
  );
};

// define the prop types
ApplicationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default applicationContext;
