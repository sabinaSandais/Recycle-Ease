import React from "react";
import PropTypes from "prop-types";
import "./login.css";

function LogInComponent({ showLoginForm }) {
  return showLoginForm && showLoginForm === true ? (
    <div className="login-container">
      <form className="login-form">
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  ) : null;
}

LogInComponent.propTypes = {
  showLoginForm: PropTypes.bool,
};

export default LogInComponent;
