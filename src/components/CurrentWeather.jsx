import React from 'react';
import { getWeatherInfo } from '../utils/weatherCodes';

export default function CurrentWeather({ weather, location }) {
  if (!weather || !location) return null;

  const current = weather.current;
  const { description, icon } = getWeatherInfo(current.weather_code);

  return (
    <div className="current-weather">
      <div className="location-info">
        <h2>{location.name}</h2>
        <p className="country">{location.country || location.admin1}</p>
      </div>
      
      <div className="weather-main">
        <div className="weather-icon-large">{icon}</div>
        <div className="temperature">
          <span className="value">{Math.round(current.temperature_2m)}</span>
          <span className="unit">°C</span>
        </div>
      </div>
      
      <div className="weather-description">
        <p>{description}</p>
      </div>
    </div>
  );
}
