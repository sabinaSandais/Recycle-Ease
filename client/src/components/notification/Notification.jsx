import React, { useContext } from "react";
import PropTypes from "prop-types";
import { infoContext } from "../../context/infoContext";
import "./notification.css";

function Notification({ message = "Notification", type = "success" }) {
  const { showNotification } = useContext(infoContext);

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
