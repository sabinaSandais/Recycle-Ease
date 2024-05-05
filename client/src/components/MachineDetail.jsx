import React from "react";
import PropTypes from "prop-types"; 
import './MachineDetail.css';

const MachineDetail = ({ content, onClose , className}) => {
  const statusClassName = content.status === 1 ? 'open' : 'closed';
  return (
    <div className={`custom-popup ${className}`}>
      <button className="close-btn" onClick={onClose}>X</button>
      <div className="content">
        <ul className="machine-detail">
        <li>{content.address}</li>
        <li className={statusClassName}>{
         content.status === 1 ? "open" : "closed"
        }
        </li>
        </ul>
        </div>
    </div>
  );
};

MachineDetail.propTypes = {
  content: PropTypes.object.isRequired, 
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default MachineDetail;
