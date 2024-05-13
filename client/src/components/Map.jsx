import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AddressSearch from "./SearchBar.jsx";
import { useLocation } from "./LocationContext.jsx";
import "./Map.css";
import useFetch from "../hooks/useFetch.js";
import MachineDetail from "./MachineDetail.jsx";
import greenPin from "./assets/Map_pin_icon_green.svg";
import redPin from "./assets/map-marker.svg";

const MapComponent = () => {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedLocation, setLocation } = useLocation();
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isPinClicked, setIsPinClicked] = useState(false);

  const { error: machinesError, performFetch: fetchMachines } = useFetch(
    "/machines",
    (response) => {
      // logInfo(`Machines response: ${response.} Map.jsx`);
      if (machinesError) {
        setError(machinesError);
        setIsLoading(false);
        return;
      }
      response.result.forEach((machine) => {
        const { lat, lon } = machine.location;
        let iconUrl = machine.status === 1 ? greenPin : redPin;
        let icon = L.icon({ iconUrl, iconSize: [25, 41] });
        const marker = L.marker([lat, lon], { icon }).addTo(mapRef.current);
        marker.on("click", () => {
          setSelectedMachine(machine);
          handleIsPinClicked();
        });
      });
    },
  );
  useEffect(() => {
    fetchMachines();
    if (!mapRef.current) {
      const mapInstance = L.map("map").setView([52.3737, 4.8963], 13);
      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {},
      ).addTo(mapInstance);
      mapRef.current = mapInstance;
      setIsLoading(false);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const handleIsPinClicked = () => {
    setIsPinClicked(true);
  };

  const handleCloseMachineDetail = () => {
    setSelectedMachine(null);
    setIsPinClicked(false);
  };

  const handleLocationError = (error) => {
    setError(error.message);
    setIsLoading(false);
  };

  const showUserLocation = (position) => {
    if (!mapRef.current) return;

    const { latitude, longitude } = position.coords;

    mapRef.current.setView([latitude, longitude], 14);
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedLocation) {
      const { lat, lon } = selectedLocation;
      mapRef.current.setView([lat, lon], 14);
      setLocation(null);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        showUserLocation,
        handleLocationError,
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  }, []);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div id="map" className="map-container">
        <AddressSearch />
        {selectedMachine && (
          <MachineDetail
            content={selectedMachine}
            onClose={handleCloseMachineDetail}
            className={isPinClicked ? "pin-clicked" : ""}
          />
        )}
      </div>
    </div>
  );
};

export default MapComponent;
