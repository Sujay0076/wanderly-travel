import { useState } from "react";
import { getCurrentWeather } from "../services/weatherServices";
import { searchLocation } from "../services/locationService";
import "./Navbar.css";

function Navbar() {
  const [locationStatus, setLocationStatus] = useState("");
  const [locationWeather, setLocationWeather] = useState(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  function handleGetLocation() {
    if (!navigator.geolocation) {
      setLocationStatus(
        "Location is not supported by this browser."
      );
      return;
    }

    setLocationStatus("Getting your location...");
    setLocationWeather(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          setLocationStatus("Fetching local weather...");

          const weather = await getCurrentWeather(
            latitude,
            longitude
          );

          setLocationWeather(weather);
          setLocationStatus("Your location weather is ready.");
        } catch (error) {
          console.error(error);

          setLocationStatus(
            "Location detected, but weather could not be loaded."
          );
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus("Location permission was denied.");
        } else if (
          error.code === error.POSITION_UNAVAILABLE
        ) {
          setLocationStatus(
            "Unable to determine your location."
          );
        } else if (error.code === error.TIMEOUT) {
          setLocationStatus(
            "Location request timed out."
          );
        } else {
          setLocationStatus(
            "Unable to get your location."
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }

  async function handleLocationSearch(event) {
    event.preventDefault();

    if (!search.trim()) {
      setSearchError("Please enter a location.");
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError("");
      setSearchResults([]);

      const results = await searchLocation(search);

      setSearchResults(results);
    } catch (error) {
      setSearchError(error.message);
    } finally {
      setSearchLoading(false);
    }
  }

  async function handleSelectLocation(location) {
    try {
      setSearchLoading(true);
      setSearchError("");
      setLocationWeather(null);

      const weather = await getCurrentWeather(
        location.lat,
        location.lon
      );

      setLocationWeather(weather);
      setLocationStatus(
        `${location.name} weather is ready.`
      );

      setSearchOpen(false);
      setSearch("");
      setSearchResults([]);
    } catch (error) {
      setSearchError(
        "Location found, but weather could not be loaded."
      );
    } finally {
      setSearchLoading(false);
    }
  }

  return (
    <header className="navbar">
      <a href="/" className="navbar-logo">
        WANDERLY
      </a>

      <nav className="navbar-links">
        <a href="#explore">Explore</a>
        <a href="#destinations">Destinations</a>
        <a href="#assistant">AI Assistant</a>
      </nav>

      <div className="navbar-actions">
        <div className="location-search-wrapper">
          <button
            className="search-location-button"
            type="button"
            onClick={() => {
              setSearchOpen((previous) => !previous);
              setSearchError("");
            }}
            aria-expanded={searchOpen}
          >
            🔎 Search location
          </button>

          {searchOpen && (
            <div className="location-search-panel">
              <form onSubmit={handleLocationSearch}>
                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search a city..."
                  aria-label="Search for a location"
                  autoFocus
                />

                <button type="submit">
                  Search
                </button>
              </form>

              {searchLoading && (
                <p className="search-message">
                  Searching...
                </p>
              )}

              {searchError && (
                <p className="search-message search-error">
                  {searchError}
                </p>
              )}

              {!searchLoading &&
                !searchError &&
                searchResults.length > 0 && (
                  <div className="location-results">
                    {searchResults.map(
                      (location, index) => (
                        <button
                          type="button"
                          className="location-result"
                          key={`${location.lat}-${location.lon}-${index}`}
                          onClick={() =>
                            handleSelectLocation(location)
                          }
                        >
                          <strong>
                            {location.name}
                          </strong>

                          <span>
                            {location.state
                              ? `${location.state}, `
                              : ""}
                            {location.country}
                          </span>
                        </button>
                      )
                    )}
                  </div>
                )}
            </div>
          )}
        </div>

        <div className="navbar-location">
          <button
            className="location-button"
            onClick={handleGetLocation}
            type="button"
          >
            <span>⌖</span>
            My location
          </button>

          {locationStatus && (
            <p
              className="location-status"
              role="status"
            >
              {locationStatus}
            </p>
          )}

          {locationWeather && (
            <div className="location-weather">
              <strong>
                {Math.round(
                  locationWeather.main.temp
                )}
                °C
              </strong>

              <span>
                {
                  locationWeather.weather?.[0]
                    ?.description
                }
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;