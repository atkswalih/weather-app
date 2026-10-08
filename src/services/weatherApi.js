const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCity(name, signal) {
  if (!name || name.trim() === '') {
    throw new Error('City name cannot be empty');
  }
  
  const url = new URL(GEOCODING_API_URL);
  url.searchParams.append('name', name.trim());
  url.searchParams.append('count', '5'); // Request multiple results
  url.searchParams.append('language', 'en');
  url.searchParams.append('format', 'json');

  const response = await fetch(url.toString(), { signal });
  if (!response.ok) {
    throw new Error('Failed to fetch location data');
  }

  const data = await response.json();
  
  if (!data.results || data.results.length === 0) {
    return []; // Return empty array if no results
  }

  return data.results; // Return the full array
}

export async function fetchWeather(lat, lon, signal) {
  const url = new URL(FORECAST_API_URL);
  url.searchParams.append('latitude', lat);
  url.searchParams.append('longitude', lon);
  url.searchParams.append('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m');
  url.searchParams.append('daily', 'weather_code,temperature_2m_max,temperature_2m_min');
  url.searchParams.append('timezone', 'auto');
  url.searchParams.append('forecast_days', '7');

  const response = await fetch(url.toString(), { signal });
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();
  
  // Validate that we received expected data structure
  if (!data.current || !data.daily) {
    throw new Error('Invalid weather data received from API');
  }

  return data;
}
