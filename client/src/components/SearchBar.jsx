import React, { useState, useEffect } from "react";
import "./SearchBar.css";
import useFetchAddress from "../hooks/useFetchAddress";
import { useLocation } from "./LocationContext";

const AddressSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setLocation, selectedLocation } = useLocation();
  const { fetchAddress } = useFetchAddress();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2 && !selectedLocation) {
        setIsLoading(true);
        try {
          const data = await fetchAddress(query);
          setResults(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [query, fetchAddress]);

  const handleSearch = (event) => {
    const inputValue = event.target.value;
    setQuery(inputValue);
    setResults([]);
    setError(null);
  };

  const handleSelect = (result) => {
    setLocation(result);
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
    </div>
  );
};

export default AddressSearch;
