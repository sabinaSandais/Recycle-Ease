import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch.js";

//styles
import "./demo.css";

//components
import Nav from "../../components/navbar/Nav";

//utils
import { logInfo, logError } from "../../../../server/src/util/logging";

function Demo() {
  const [isLoading, setIsLoading] = useState(true);
  const [machines, setMachines] = useState([]);
  const [machineId, setMachineId] = useState(null);

  const { error: machinesError, performFetch: fetchMachines } = useFetch(
    "/machines",
    (response) => {
      setMachines(response.result);
      setIsLoading(false);
      if (machinesError) {
        logError(machinesError);
        return;
      }
    },
  );

  const { error: machineError, performFetch: updateMachineStatus } = useFetch(
    `/machines/${machineId}`,
    () => {
      if (machineError) {
        logError(machineError);
        return;
      }
    },
  );

  useEffect(() => {
    fetchMachines();
  }, []);

  useEffect(() => {
    if (machineId !== null) {
      logInfo(`Machine ${machineId} status changed`);
      updateMachineStatus({
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({}),
      });
      setMachineId(null);
    }
  }, [machineId]);

  return (
    <>
      <Nav />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="machines_container">
          {machines.map((machine, index) => (
            <div key={machine._id} className="machine_card">
              <div className="machine_card__header">
                <h3 className="machine_card_number">{index + 1} </h3>
                <h3 className="machine_card__id">
                  ID: {machine._id.slice(-5)}
                </h3>
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
          ))}
        </div>
      )}
    </>
  );
}

export default Demo;
