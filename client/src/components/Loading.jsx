import React from "react";
import "./Loading.css";
import recycle from "./assets/recycle.png";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <img src={recycle} alt="recycle" className="static-image" />
    </div>
  );
};

export default LoadingSpinner;
