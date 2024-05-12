import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch.js";

//styles
import "./demo.css";

//components
import Nav from "../../components/navbar/Nav";
import MachineCard from "../../components/machineCard/MachineCard.jsx";

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
