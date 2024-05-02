import React, { useState } from "react";
import "./SearchBar.css";
import useFetchAddress from "../hooks/useFetchAddress";

const AddressSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { fetchAddress } = useFetchAddress();

  const handleSearch = async (event) => {
    const inputValue = event.target.value;
    setQuery(inputValue);
    setResults([]);
    setSelectedLocation(null);
    setError(null);

    if (inputValue.length > 2) {
      setIsLoading(true);
      try {
        const data = await fetchAddress(inputValue);
        setResults(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSelect = (result) => {
    setSelectedLocation(result);
    setQuery(result.display_name);
    setResults([]);
  };

  return (
    <div className="address-search">
      <input
        type="text"
        id="addressInput"
        value={query}
        onChange={handleSearch}
        placeholder="Enter address"
      />
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {results.length > 0 && (
        <ul className="results">
          {results.map((result, index) => (
            <li key={index} onClick={() => handleSelect(result)}>
              {result.display_name}
            </li>
          ))}
        </ul>
      )}
      {selectedLocation && (
        <div className="location-info">
          <p>Selected Location:</p>
          <p>{selectedLocation.display_name}</p>
          <p>
            Coordinates: {selectedLocation.lat}, {selectedLocation.lon}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressSearch;
