import React from "react";
import PropTypes from "prop-types";
import "./signUp.css";

function SignUp({ showSignUpForm }) {
  return showSignUpForm && showSignUpForm === true ? (
    <div className="signUp-container">
      <form className="signUp-form">
        <label htmlFor="username">User Name:</label>
        <input type="text" id="username" name="username" />
        <label htmlFor="email">E-mail:</label>
        <input type="email" id="email" name="email" />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  ) : null;
}

SignUp.propTypes = {
  showSignUpForm: PropTypes.bool,
};

export default SignUp;
