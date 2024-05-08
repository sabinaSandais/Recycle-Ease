import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import PropTypes from "prop-types";
import { logInfo } from "../../../../server/src/util/logging";
import Notification from "../notification/Notification";
import "./signUp.css";

function SignUpComponent({ showSignUpForm, setShowSignUpForm }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSuccess = () => {
    setName("");
    setEmail("");
    setPassword("");
    logInfo("User created successfully");
    setShowSignUpForm(false);
  };

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/user/",
    onSuccess,
  );

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
      body: JSON.stringify({ user: { name, email, password } }),
    });
  };

  let statusComponent = null;
  if (error != null) {
    statusComponent = <Notification message={error.toString()} type="error" />;
  } else if (isLoading) {
    statusComponent = (
      <Notification message="Creating User..." type="success" />
    );
  }

  return showSignUpForm && showSignUpForm === true ? (
    <div className="signUp-container">
      <form className="signUp-form" onSubmit={handleSubmit}>
        <label htmlFor="username">User Name:</label>
        <input
          type="text"
          id="username"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="email">E-mail:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
      {statusComponent}
    </div>
  ) : null;
}

SignUpComponent.propTypes = {
  showSignUpForm: PropTypes.bool,
  setShowSignUpForm: PropTypes.func,
};

export default SignUpComponent;
