import React, { useEffect, useState, useContext } from "react";

import useFetch from "../../hooks/useFetch";
import PropTypes from "prop-types";

import "./login.css";

import { userContext } from "../../context/userContext";
import { infoContext } from "../../context/infoContext";
function LogInComponent({ showLoginForm }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const { setIsLoggedIn, setUser, isLoggedIn } = useContext(userContext);
  const { setInfo } = useContext(infoContext);

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
    if (error != null) {
      if (error.error) {
        setInfo({ message: error.error, type: "error" });
      }
      if (error.token && error.token !== undefined) {
        setInfo({ message: "Login successful", type: "success" });
      }
    } else if (isLoading) {
      setInfo({ message: "Logging in...", type: "success" });
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
