import { useState } from "react";

const useFetchAddress = () => {
  const [error, setError] = useState(null);
  const apiUrl =` https://nominatim.openstreetmap.org/search?format=json&q=`;

  const fetchAddress = async (inputValue) => {
    try {
      const response = await fetch(`${apiUrl}${inputValue}`);
      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return { fetchAddress, error };
};

export default useFetchAddress;
