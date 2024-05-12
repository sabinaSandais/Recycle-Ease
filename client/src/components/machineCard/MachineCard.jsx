import React from "react";
import PropTypes from "prop-types";
import "./machineCard.css";

function MachineCard({ machine, index, setMachineId }) {
  return (
    <div className="machine_card">
      <div className="machine_card__header">
        <h3 className="machine_card_number">{index + 1} </h3>
        <h3 className="machine_card__id">ID: {machine._id.slice(-5)}</h3>
      </div>
      <div className="machine_card__body">
        <p className="machine_card__address">{machine.address}</p>
      </div>
      <div className="machine_card__footer">
        <label className="switch">
          <input
            type="checkbox"
            defaultChecked={machine.status == 1}
            onClick={() => {
              setMachineId(machine._id);
            }}
          />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
}

MachineCard.propTypes = {
  machine: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  setMachineId: PropTypes.func.isRequired,
};

export default MachineCard;
