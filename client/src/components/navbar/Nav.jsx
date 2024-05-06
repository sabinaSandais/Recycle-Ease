import React from "react";
import { Link } from "react-router-dom";
import "./nav.css";

import TEST_ID from "../Nav.testid";

const Nav = () => {
  return (
    <div className="navbar">
      <ul className="navbar-items">
        <li className="navbar-item">
          <Link to="/" data-testid={TEST_ID.linkToHome} className="navbar-link">
            Home
          </Link>
        </li>
        <li className="navbar-item">
          <Link
            to="/user"
            data-testid={TEST_ID.linkToUsers}
            className="navbar-link"
          >
            Users
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Nav;
