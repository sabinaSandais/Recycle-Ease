import React from "react";
import PropTypes from "prop-types";
import "./ReviewAlert.css";

const ReviewAlert = ({ message, onClose }) => {
  return (
    <div className="custom-alert">
      <p>{message}</p>
      <button onClick={onClose}>OK</button>
    </div>
  );
};

ReviewAlert.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ReviewAlert;
