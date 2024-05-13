import React from "react";
import "./switch.css";

import PropTypes from "prop-types";

function Switch({ defaultStatus, clickAction }) {
  return (
    <label className="switch">
      <input
        type="checkbox"
        defaultChecked={defaultStatus == 1 ? true : false}
        onClick={clickAction}
      />
      <span className="slider round"></span>
    </label>
  );
}

Switch.propTypes = {
  defaultStatus: PropTypes.number,
  clickAction: PropTypes.func,
};

export default Switch;
