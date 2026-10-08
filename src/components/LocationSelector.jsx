import React from 'react';

export default function LocationSelector({ locations, onSelect }) {
  if (!locations || locations.length === 0) return null;

  return (
    <div className="location-selector fade-in">
      <h3>Multiple locations found. Please select one:</h3>
      <ul className="location-list">
        {locations.map((loc) => {
          // Construct a nice display string, e.g. Kochi - Kerala, India (IN)
          const parts = [];
          if (loc.admin1) parts.push(loc.admin1);
          if (loc.country) parts.push(loc.country);
          
          const detailString = parts.length > 0 ? ` - ${parts.join(', ')}` : '';
          const codeString = loc.country_code ? ` (${loc.country_code})` : '';

          return (
            <li key={loc.id} className="location-item-container">
              <button 
                type="button" 
                className="location-item" 
                onClick={() => onSelect(loc)}
              >
                <span className="location-name">{loc.name}</span>
                <span className="location-details">{detailString}{codeString}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
