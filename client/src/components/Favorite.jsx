import { useApplicationContext } from "../context/applicationContext";
import React, { useEffect, useState } from "react";
import { useFavoriteContext } from "./FavoriteContext";
import useFetch from "../hooks/useFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import "./Favorite.css";
import StarRating from "./StarRating";

const Favorite = () => {
  const { favoriteMachines, setFavoriteMachines } = useFavoriteContext();
  const { user } = useApplicationContext();
  const token = user.token;
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { performFetch: getFavoriteMachines, error: favoriteError } = useFetch(
    "/favorite",
    (response) => {
      if (response.success) {
        setFavoriteMachines(response.machines);
        setIsLoading(false);
      }
      if (favoriteError) {
        setError(favoriteError);
        setIsLoading(false);
      }
    },
  );

  const { performFetch: deleteFavoriteFetch } = useFetch(
    "/favorite",
    (response) => {
      if (response.success) {
        getFavoriteMachines({ headers: { Authorization: `Bearer ${token}` } });
      }
      if (response.error) {
        setError(response.error);
        setIsLoading(false);
      }
    },
  );

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
  }, [user.id]);

  return isLoading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>Error: {error}</div>
  ) : (
    <div className="favorite-container">
      <div className="favorite-ul">
        {favoriteMachines.map((machine) => (
          <div key={machine._id} className="favorite-li">
            <div className="machine-address">{machine.address}</div>
            <div className="status">
              {machine.status === 1 ? "Open" : "Closed"}
            </div>
            <StarRating rating={machine.score} />
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
    </div>
  );
};

export default Favorite;
