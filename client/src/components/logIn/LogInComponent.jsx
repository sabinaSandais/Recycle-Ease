import React, { useEffect, useState, useContext } from "react";

import useFetch from "../../hooks/useFetch";
import PropTypes from "prop-types";
import Notification from "../notification/Notification";

import "./login.css";

import { userContext } from "../../context/userContext";
function LogInComponent({ showLoginForm }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const { setIsLoggedIn, setUser, isLoggedIn } = useContext(userContext);

  const { isLoading, error, performFetch, cancelFetch } =
    useFetch("/user/login");

  useEffect(() => {
    return cancelFetch;
  }, []);

  useEffect(() => {
    if (error && error.token) {
      setIsLoggedIn(true);
      setUser({ name: error.name, token: error.token, id: error.id });
    }
  }, [error]);

  useEffect(() => {
    if (isLoggedIn) {
      setName("");
      setPassword("");
    }
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

  let statusComponent = null;
  if (error != null) {
    if (error.error) {
      statusComponent = <Notification message={error.error} type="error" />;
    }
    if (error.token && error.token !== undefined) {
      statusComponent = (
        <Notification message="Login successful" type="success" />
      );
    }
  } else if (isLoading) {
    statusComponent = <Notification message="Logging in..." type="success" />;
  }

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
      {statusComponent}
    </div>
  ) : null;
}

LogInComponent.propTypes = {
  showLoginForm: PropTypes.bool,
};

export default LogInComponent;
