import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
const FavoriteContext = createContext();
export const useFavoriteContext = () => useContext(FavoriteContext);
export const FavoriteProvider = ({ children }) => {
  const [favoriteMachines, setFavoriteMachines] = useState([]);
  
 



  return (
    <FavoriteContext.Provider
      value={{
        favoriteMachines,
        setFavoriteMachines,
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