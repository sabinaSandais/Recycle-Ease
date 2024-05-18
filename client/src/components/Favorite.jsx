import React, { useEffect, useState } from "react";
import { useApplicationContext } from "../context/applicationContext";
import { useFavoriteContext } from "./FavoriteContext";
import useFetch from "../hooks/useFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import "./Favorite.css";
import StarRating from "./StarRating";
import { useMachine } from "./MachineContext";
import LoadingSpinner from "./Loading";

const Favorite = () => {
  const { favoriteMachines, setFavoriteMachines, userLocation } = useFavoriteContext();
  const { user } = useApplicationContext();
  const token = user.token;
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortedFavorites, setSortedFavorites] = useState([]);
  const { statusChange } = useMachine();

  const { performFetch: getFavoriteMachines, error: favoriteError } = useFetch("/favorite", (response) => {
    if (response.success) {
      setFavoriteMachines(response.machines);
      setIsLoading(false);
    } else if (favoriteError) {
      setError(favoriteError);
      setIsLoading(false);
    }
  });

  const { performFetch: deleteFavoriteFetch } = useFetch("/favorite", (response) => {
    if (response.success) {
      getFavoriteMachines({ headers: { Authorization: `Bearer ${token}` } });
    } else if (response.error) {
      setError(response.error);
      setIsLoading(false);
    }
  });

  const deleteFavorite = async (machineId) => {
    try {
      await deleteFavoriteFetch({
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ machineId }),
      });
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    getFavoriteMachines({ headers: { Authorization: `Bearer ${token}` } });
  }, [statusChange, token]);

  useEffect(() => {
    if (userLocation && favoriteMachines.length) {
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371; // Radius of the Earth in km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon1 - lon2);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
      };

      const favoritesWithDistances = favoriteMachines.map((machine) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          machine.location.lat,
          machine.location.lon,
        );
        return { ...machine, distance };
      });

      const sorted = favoritesWithDistances.sort((a, b) => a.distance - b.distance);
      setSortedFavorites(sorted);
    } else {
      setSortedFavorites(favoriteMachines);
    }
  }, [userLocation, favoriteMachines]);

  return isLoading ? (
    <LoadingSpinner />
  ) : error ? (
    <div className="error">Error: {error}</div>
  ) : (
    <div className="favorite-container">
      <h1>Favorite Machines</h1>
      {sortedFavorites.length === 0 ? (
        <div className="no-favorites">You have no favorite machines</div>
      ) : (
        <div className="favorite-ul">
          <div className="favorite-li-title title-row">
            <div className="address-title">Address</div>
            <div className="title">Status</div>
            <div className="title">Rating</div>
            <div className="title">Distance</div>
          </div>
          {sortedFavorites.map((machine) => (
            <div key={machine._id} className="favorite-li">
              <div className="machine-address">{machine.address}</div>
              <div className="status">
                <div className={machine.status === 1 ? "Open" : "Closed"}></div>
                <div>{machine.status === 1 ? "Open" : "Closed"}</div>
              </div>
              <StarRating rating={machine.score} />
              <div className="distance">
                {machine.distance ? `${machine.distance.toFixed(2)} km` : "Location disabled"}
              </div>
              <div className="button">
                <button
                  onClick={() => {
                    deleteFavorite(machine._id);
                  }}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorite;