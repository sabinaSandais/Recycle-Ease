import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import PropTypes from "prop-types";
import "./signUp.css";

import { useApplicationContext } from "../../context/applicationContext";
function SignUpComponent({ showSignUpForm, setShowSignUpForm }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setInfo } = useApplicationContext();
  const onSuccess = () => {
    setName("");
    setEmail("");
    setPassword("");
    setInfo({ message: "User created successfully", type: "success" });
    setShowSignUpForm(false);
  };

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/user/",
    onSuccess,
  );

  useEffect(() => {
    return cancelFetch;
  }, []);

  useEffect(() => {
    if (error != null) {
      setInfo({ message: error.toString(), type: "error" });
    } else if (isLoading) {
      setInfo({ message: "Creating User...", type: "success" });
    }
  }, [error]);

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

  return showSignUpForm && showSignUpForm === true ? (
    <div className="signUp-container">
      <div className="close-btn">
        <button
          onClick={() => {
            setShowSignUpForm(false);
          }}
        >
          X
        </button>
      </div>
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
    </div>
  ) : null;
}

SignUpComponent.propTypes = {
  showSignUpForm: PropTypes.bool,
  setShowSignUpForm: PropTypes.func,
};

export default SignUpComponent;
