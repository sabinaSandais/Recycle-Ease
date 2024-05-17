import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch.js";
import { useNavigate } from "react-router-dom";

//styles
import "./demo.css";

//components

import MachineCard from "../../components/machineCard/MachineCard.jsx";
import Switch from "../../components/switch/Switch.jsx";

//utils
import { logInfo, logError } from "../../../../server/src/util/logging";

function Demo() {
  const [isLoading, setIsLoading] = useState(true);
  const [machines, setMachines] = useState([]);
  const [machineId, setMachineId] = useState(null);
  const navigate = useNavigate();

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

  const { error: allMachinesOffError, performFetch: turnOffAllMachines } =
    useFetch("/machines/turnOffAll", () => {
      if (allMachinesOffError) {
        logError(allMachinesOffError);
        return;
      }
    });

  const { error: allMachinesOnError, performFetch: turnOnAllMachines } =
    useFetch("/machines/turnOnAll", () => {
      if (allMachinesOnError) {
        logError(allMachinesOnError);
        return;
      }
    });

  const { error: toggleHalfError, performFetch: toggleHalfMachines } = useFetch(
    "/machines/toggleHalf",
    () => {
      if (toggleHalfError) {
        logError(toggleHalfError);
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

  const handleBackToHome = () => {
    // Implement the functionality to navigate back to the home page
    navigate("/");
  };

  return (
    <>
      <div className="demo-nav">
        <h1 className="heading">Machines</h1>
        <button className="btn" onClick={handleBackToHome}>
          Home
        </button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="machines_container">
          <div className="machines_header">
            <div className="machine_automation">
              <p>Close All Machine</p>
              <Switch
                defaultStatus={0}
                clickAction={() => {
                  turnOffAllMachines();
                }}
              />
            </div>

            <div className="machine_automation">
              <p>Open All Machine</p>
              <Switch
                defaultStatus={1}
                clickAction={() => {
                  turnOnAllMachines();
                }}
              />
            </div>

            <div className="machine_automation">
              <p>Toggle Half Machine</p>
              <Switch
                defaultStatus={0}
                clickAction={() => {
                  toggleHalfMachines();
                }}
              />
            </div>
          </div>
          {machines.map((machine, index) => (
            <MachineCard
              key={machine._id}
              machine={machine}
              index={index}
              setMachineId={setMachineId}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default Demo;
