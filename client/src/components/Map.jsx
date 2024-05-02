import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AddressSearch from "./SearchBar";
import "./Map.css";

const MapComponent = () => {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mapRef.current) {
      const mapInstance = L.map("map").setView([52.3737, 4.8963], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(mapInstance);
      mapRef.current = mapInstance;
      setIsLoading(false);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const handleLocationError = (error) => {
    setError(error.message);
    setIsLoading(false);
    console.error("Error getting user location:", error);
  };

  const showUserLocation = (position) => {
    if (!mapRef.current) return;

    const { latitude, longitude } = position.coords;
    
    mapRef.current.setView([latitude, longitude], 14);
    setIsLoading(false);
  };

  // Ask user for their location when the component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        showUserLocation,
        handleLocationError
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div id="map" className="map-container">
        <AddressSearch />
      </div>
    </div>
  );
};

export default MapComponent;