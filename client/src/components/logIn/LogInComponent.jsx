import React, { useEffect, useState } from "react";

import useFetch from "../../hooks/useFetch";
import PropTypes from "prop-types";
import Notification from "../notification/Notification";

import "./login.css";
import { logInfo } from "../../../../server/src/util/logging";
function LogInComponent({ showLoginForm, setShowLoginForm }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, error, performFetch, cancelFetch } =
    useFetch("/user/login");

  useEffect(() => {
    return cancelFetch;
  }, []);

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
      logInfo(`User token: ${error.token}`);
      localStorage.setItem("user_token", error.token);
      localStorage.setItem("user_name", error.name);
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
  setShowLoginForm: PropTypes.func,
};

export default LogInComponent;
