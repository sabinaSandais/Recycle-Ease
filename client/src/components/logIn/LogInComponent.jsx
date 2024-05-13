import React, { useEffect, useState, useContext } from "react";

import useFetch from "../../hooks/useFetch";
import PropTypes from "prop-types";

import "./login.css";

import { logInfo } from "../../../../server/src/util/logging";

import { userContext } from "../../context/userContext";
import { infoContext } from "../../context/infoContext";
function LogInComponent({ showLoginForm }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [apiResponse, setApiResponse] = useState({});

  const { setIsLoggedIn, setUser, isLoggedIn, user } = useContext(userContext);
  const { setInfo } = useContext(infoContext);

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/user/login",
    (response) => {
      setApiResponse(response);
    },
  );

  useEffect(() => {
    return cancelFetch;
  }, []);

  useEffect(() => {
    if (error !== null) {
      if (error.error) {
        setInfo({ message: error.error, type: "error" });
      }
    }
    if (isLoading) {
      setInfo({ message: "Logging in...", type: "success" });
    }
  }, [error]);

  useEffect(() => {
    if (apiResponse.success === true) {
      setIsLoggedIn(true);
      setUser({
        name: apiResponse.result.name,
        token: apiResponse.result.token,
        id: apiResponse.result.userId,
      });
      setInfo({ message: "Login successful", type: "success" });
    }

    if (isLoading) {
      setInfo({ message: "Logging in...", type: "success" });
    }
  }, [apiResponse]);

  useEffect(() => {
    if (isLoggedIn) {
      setName("");
      setPassword("");
    }

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

  const handleSubmit = (e) => {
    e.preventDefault();

    performFetch({
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name, password }),
    });
  };

  return showLoginForm && showLoginForm === true ? (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  ) : null;
}

LogInComponent.propTypes = {
  showLoginForm: PropTypes.bool,
};

export default LogInComponent;
