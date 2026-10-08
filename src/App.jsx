import React, { useState, useRef } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherDetails from './components/WeatherDetails';
import Forecast from './components/Forecast';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import LocationSelector from './components/LocationSelector';
import { searchCity, fetchWeather } from './services/weatherApi';

function App() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const abortControllerRef = useRef(null);

  const fetchWeatherForLocation = async (cityData) => {
    setLoading(true);
    setError(null);
    setSearchResults([]); // Clear search results since we picked one
    setLocation(cityData);
    
    try {
      const weatherData = await fetchWeather(
        cityData.latitude, 
        cityData.longitude, 
        abortControllerRef.current?.signal
      );
      setWeather(weatherData);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'An error occurred while fetching weather data.');
        setWeather(null);
        setLocation(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (cityName) => {
    // Cancel previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    setWeather(null);
    setLocation(null);
    setSearchResults([]);

    try {
      const results = await searchCity(cityName, abortControllerRef.current.signal);
      
      if (!results || results.length === 0) {
        setError(`City "${cityName}" not found. Please try a different name.`);
        setLoading(false);
        return;
      }

      if (results.length === 1) {
        // If exactly one result, fetch weather directly
        await fetchWeatherForLocation(results[0]);
      } else {
        // Multiple results, let the user choose
        setSearchResults(results);
        setLoading(false);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'An error occurred while searching for city.');
        setLoading(false);
      }
    }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setError(null);
    setWeather(null);
    setLocation(null);
    setSearchResults([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const weatherData = await fetchWeather(latitude, longitude);
          
          setLocation({
            name: 'Current Location',
            country: 'Your Area',
            latitude,
            longitude
          });
          setWeather(weatherData);
        } catch (err) {
          setError('Failed to fetch weather for your location.');
          setWeather(null);
        } finally {
          setGeoLoading(false);
        }
      },
      (geoErr) => {
        let msg = 'Failed to get your location.';
        if (geoErr.code === 1) msg = 'Location access denied by user.';
        if (geoErr.code === 2) msg = 'Location is currently unavailable.';
        if (geoErr.code === 3) msg = 'Location request timed out.';
        
        setError(msg);
        setGeoLoading(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>VibeWeather</h1>
          <SearchBar 
            onSearch={handleSearch} 
            onGeolocate={handleGeolocate} 
            geoLoading={geoLoading} 
          />
        </header>

        <main className="main-content">
          <ErrorMessage message={error} />
          
          {loading && <LoadingSpinner message="Fetching data..." />}
          
          {!loading && !error && searchResults.length > 0 && (
            <LocationSelector 
              locations={searchResults} 
              onSelect={fetchWeatherForLocation} 
            />
          )}

          {!loading && !error && weather && location && searchResults.length === 0 && (
            <div className="weather-dashboard fade-in">
              <CurrentWeather weather={weather} location={location} />
              <WeatherDetails weather={weather} />
              <Forecast daily={weather.daily} />
            </div>
          )}

          {!loading && !error && !weather && searchResults.length === 0 && (
            <div className="initial-state fade-in">
              <div className="initial-icon">🌤️</div>
              <p>Search for a city or use your location to get the weather forecast.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
