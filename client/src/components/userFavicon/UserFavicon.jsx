import React, { useContext } from "react";
import "./userFavicon.css";

import { userContext } from "../../context/userContext";

function UserFavicon() {
  const { user, isLoggedIn } = useContext(userContext);
  return isLoggedIn ? (
    <li className="userFavicon">
      <a href="#" className="userFavicon-link">
        {user.name !== "" ? user.name[0].toUpperCase() : "?"}
      </a>
    </li>
  ) : (
    <></>
  );
}

export default UserFavicon;
