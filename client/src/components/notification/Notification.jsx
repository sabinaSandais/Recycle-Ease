import React from "react";
import PropTypes from "prop-types";
import "./notification.css";

function Notification({ message = "Notification", type = "success" }) {
  return (
    <div className={`notification ${type}`}>
      <div className="notification-body">
        <span>{message}</span>
      </div>
    </div>
  );
}

Notification.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
};

export default Notification;
