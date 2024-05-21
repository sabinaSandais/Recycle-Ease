import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation } from "./LocationContext.jsx";
import { useMachine } from "./MachineContext.jsx";
import "./Map.css";
import useFetch from "../hooks/useFetch.js";
import MachineDetail from "./MachineDetail.jsx";
import { useFavoriteContext } from "./FavoriteContext.jsx";
import greenPin from "./assets/Map_pin_icon_green.svg";
import redPin from "./assets/map-marker.svg";
import { useApplicationContext } from "../context/applicationContext.js";

const MapComponent = () => {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedLocation, setLocation } = useLocation();
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isPinClicked, setIsPinClicked] = useState(false);
  const { setMarkers, setMachines, statusChange } = useMachine();
  const { setUserLocation, setFavoriteMachines, favoriteMachines } =
    useFavoriteContext();
  const { isLoggedIn, user, setInfo, setShowNotification } =
    useApplicationContext();
  const token = user.token;

  const { error: machinesError, performFetch: fetchMachines } = useFetch(
    "/machines",
    (response) => {
      if (machinesError) {
        setError(machinesError);
        setIsLoading(false);
        return;
      }
      let markers = [];
      const machines = response.result;
      setMachines(machines);
      response.result.forEach((machine) => {
        const { lat, lon } = machine.location;
        let iconUrl = machine.status === 1 ? greenPin : redPin;
        let icon = L.icon({ iconUrl, iconSize: [25, 41] });
        const marker = L.marker([lat, lon], { icon }).addTo(mapRef.current);
        marker.machineId = machine._id;
        marker.on("click", () => {
          setSelectedMachine(machine);
          handleIsPinClicked();
        });
        markers.push(marker);
      });
      setMarkers(markers);
    },
  );
  const { performFetch: getFavoriteMachines, error: favoriteError } = useFetch(
    "/favorite",
    (response) => {
      if (response.success) {
        setFavoriteMachines(response.machines);
        setIsLoading(false);
      }
      if (favoriteError) setError(favoriteError);
      setIsLoading(false);
    },
  );

  // Notification when there is changes in the favorite machines
  useEffect(() => {
    favoriteMachines.forEach((machine) => {
      if (machine._id === statusChange.machineId) {
        setInfo({
          message: `${machine.address} is ${statusChange.status === 1 ? "live" : "down"}`,
          type: `${statusChange.status === 1 ? "notification--success" : "notification--error"}`,
        });
        setShowNotification(true);

        const timer = setTimeout(() => {
          setShowNotification(false);
        }, 5000);

        return () => {
          clearTimeout(timer);
        };
      }
    });
  }, [statusChange]);

  useEffect(() => {
    if (!isLoggedIn) return;
    getFavoriteMachines({ headers: { Authorization: `Bearer ${token}` } });
  }, [isLoggedIn]);

  useEffect(() => {
    fetchMachines();
    if (!mapRef.current) {
      const mapInstance = L.map("map", {
        center: [52.3737, 4.8963],
        zoom: 13,
        zoomControl: false,
      });
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
    if (mapRef.current) {
      mapRef.current.scrollWheelZoom.disable();
    }
  };

  const handleCloseMachineDetail = () => {
    setSelectedMachine(null);
    setIsPinClicked(false);
    if (mapRef.current) {
      mapRef.current.scrollWheelZoom.enable();
    }
  };

  const handleLocationError = (error) => {
    setError(error.message);
    setIsLoading(false);
  };

  const showUserLocation = (position) => {
    if (!mapRef.current) return;

    const { latitude, longitude } = position.coords;
    setUserLocation({ lat: latitude, lon: longitude });

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
