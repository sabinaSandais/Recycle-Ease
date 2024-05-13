import React from "react";
import PropTypes from "prop-types";
import { useApplicationContext } from "../../context/applicationContext";
import "./notification.css";

function Notification({ message = "Notification", type = "success" }) {
  const { showNotification } = useApplicationContext();
  return showNotification ? (
    <div className={`notification ${type}`}>
      <div className="notification-body">
        <span>{message}</span>
      </div>
    </div>
  ) : (
    <></>
  );
}

Notification.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
};

export default Notification;
