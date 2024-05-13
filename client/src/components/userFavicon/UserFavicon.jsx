import React from "react";
import "./userFavicon.css";

import { useApplicationContext } from "../../context/applicationContext";

function UserFavicon() {
  const { user, isLoggedIn } = useApplicationContext();
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
