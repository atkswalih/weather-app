import React from 'react';

export default function WeatherDetails({ weather }) {
  if (!weather || !weather.current || !weather.daily) return null;

  const current = weather.current;
  // Get today's data (first item in daily arrays)
  const todayMax = weather.daily.temperature_2m_max[0];
  const todayMin = weather.daily.temperature_2m_min[0];

  return (
    <div className="weather-details-grid">
      <div className="detail-card">
        <span className="detail-icon" aria-hidden="true">🌡️</span>
        <div className="detail-info">
          <p className="detail-label">Feels Like</p>
          <p className="detail-value">{Math.round(current.apparent_temperature)}°</p>
        </div>
      </div>

      <div className="detail-card">
        <span className="detail-icon" aria-hidden="true">💧</span>
        <div className="detail-info">
          <p className="detail-label">Humidity</p>
          <p className="detail-value">{current.relative_humidity_2m}%</p>
        </div>
      </div>

      <div className="detail-card">
        <span className="detail-icon" aria-hidden="true">💨</span>
        <div className="detail-info">
          <p className="detail-label">Wind</p>
          <p className="detail-value">{current.wind_speed_10m} km/h</p>
        </div>
      </div>

      <div className="detail-card">
        <span className="detail-icon" aria-hidden="true">↕️</span>
        <div className="detail-info">
          <p className="detail-label">High / Low</p>
          <p className="detail-value">{Math.round(todayMax)}° / {Math.round(todayMin)}°</p>
        </div>
      </div>
    </div>
  );
}
