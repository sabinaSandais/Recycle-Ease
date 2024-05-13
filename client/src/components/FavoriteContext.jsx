import React, { createContext, useContext, useState } from "react";
import useFetch from "../hooks/useFetch"; 
import PropTypes from "prop-types";

const FavoriteContext = createContext();

export const useFavoriteContext = () => useContext(FavoriteContext);

export const FavoriteProvider = ({ children }) => {
  const [favoriteMachines, setFavoriteMachines] = useState([]);
  const { isLoading: getLoading, error: getError, performFetch: getFavorites } =
    useFetch("/favorite/:userId");

  const { isLoading: postLoading, error: postError, performFetch: saveFavorite } =
    useFetch("/favorite/:userId", { method: "POST" });

  const { isLoading: deleteLoading, error: deleteError, performFetch: removeFavorite } =
    useFetch("/favorite/:userId/:machineId", { method: "DELETE" });

  const getFavoriteMachines = async (userId) => {
    const response = await getFavorites({ userId });
    if (response && response.success) {
      setFavoriteMachines(response.machines);
    }
  };

  const addFavoriteMachine = async (userId, machineId) => {
    // Trigger saveFavorite function to add machine to favorites
    const response = await saveFavorite({ userId, machineId });
    if (response && response.success) {
      setFavoriteMachines((prevMachines) => [...prevMachines, machineId]);
    }
  };

  const removeFavoriteMachine = async (userId, machineId) => {
    // Trigger removeFavorite function to remove machine from favorites
    const response = await removeFavorite({ userId, machineId });
    if (response && response.success) {
      setFavoriteMachines((prevMachines) =>
        prevMachines.filter((id) => id !== machineId)
      );
    }
  };

  return (
    <FavoriteContext.Provider
      value={{
        favoriteMachines,
        getFavoriteMachines,
        addFavoriteMachine,
        removeFavoriteMachine,
        getLoading,
        postLoading,
        deleteLoading,
        getError,
        postError,
        deleteError,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

FavoriteProvider.propTypes = {
  children: PropTypes.node,
};

export default FavoriteContext;