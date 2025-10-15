import { useState, useEffect } from 'react';

const categories = [
  { id: 'all', name: 'All Events', icon: '🎯' },
  { id: 'conference', name: 'Conference', icon: '🎤' },
  { id: 'workshop', name: 'Workshop', icon: '🛠️' },
  { id: 'networking', name: 'Networking', icon: '🤝' },
  { id: 'social', name: 'Social', icon: '🎉' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'religion', name: 'Religion', icon: '🙏' }
];

const EventCategories = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="categories-container">
      <h3>Event Categories</h3>
      <div className="categories-grid">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventCategories;