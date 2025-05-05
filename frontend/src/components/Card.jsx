import React, { useEffect } from 'react';
import './Card.css';

const Card = ({ 
  title, 
  description, 
  stats = [], 
  buttonText, 
  buttonAction, 
  buttonDisabled = false,
  message = null,
  messageType = 'info',
  imageUrl = null,
  category = null
}) => {
  useEffect(() => {
    console.log(`Card "${title}" - Category: ${category || 'none'}`);
  }, [title, category]);

  const getCategoryLabel = (categoryValue) => {
    const categories = {
      'environment': 'Mediu',
      'social': 'Social',
      'education': 'Educație',
      'health': 'Sănătate',
      'community': 'Comunitate'
    };
    return categories[categoryValue] || categoryValue;
  };

  return (
    <div className="card">
      {imageUrl && (
        <div className="card-image" style={{ backgroundImage: `url(${imageUrl})` }}></div>
      )}
      <div className="card-content">
        {category && (
          <div className="card-category">{getCategoryLabel(category)}</div>
        )}
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        
        {stats.length > 0 && (
          <div className="card-stats">
            {stats.map((stat, index) => (
              <div key={index} className="card-stat">
                <span className="stat-label">{stat.label}:</span>
                <span className="stat-value">{stat.value}</span>
              </div>
            ))}
          </div>
        )}
        
        {message && (
          <p className={`card-message ${messageType}`}>{message}</p>
        )}
        
        {buttonText && buttonAction && (
          <button 
            className="card-button"
            onClick={buttonAction}
            disabled={buttonDisabled}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Card; 