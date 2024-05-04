import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AddressSearch from "./SearchBar";
import { useLocation } from "./LocationContext";
import "./Map.css";

const MapComponent = () => {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedLocation, setLocation } = useLocation();

  useEffect(() => {
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
      </div>
    </div>
  );
};

export default MapComponent;
