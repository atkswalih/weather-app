import React from 'react';
import { getWeatherInfo } from '../utils/weatherCodes';

export default function Forecast({ daily }) {
  if (!daily || !daily.time) return null;

  // We have 7 days of forecast. The first one is today.
  // We can show all 7, but often the first one is just "Today".
  const days = daily.time.map((dateString, index) => {
    const date = new Date(dateString);
    const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const maxTemp = Math.round(daily.temperature_2m_max[index]);
    const minTemp = Math.round(daily.temperature_2m_min[index]);
    const { icon, description } = getWeatherInfo(daily.weather_code[index]);

    return {
      dayName,
      formattedDate,
      maxTemp,
      minTemp,
      icon,
      description
    };
  });

  return (
    <div className="forecast-container">
      <h3>7-Day Forecast</h3>
      <div 
        className="forecast-scroll" 
        tabIndex="0" 
        role="region" 
        aria-label="7-Day Forecast"
      >
        {days.map((day, i) => (
          <div key={i} className="forecast-card">
            <p className="forecast-day">{day.dayName}</p>
            <p className="forecast-date">{day.formattedDate}</p>
            <div className="forecast-icon" title={day.description}>{day.icon}</div>
            <div className="forecast-temps">
              <span className="temp-max">{day.maxTemp}°</span>
              <span className="temp-min">{day.minTemp}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
