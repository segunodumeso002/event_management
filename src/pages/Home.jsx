import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Home = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    { icon: '🎉', text: 'Discover Amazing Events' },
    { icon: '📅', text: 'Easy Event Management' },
    { icon: '🎯', text: 'Seamless Registration' },
    { icon: '🌟', text: 'Connect with Community' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Event Manager ✨</h1>
        <p>Discover and manage amazing events in your area</p>
        
        <div className="features-showcase">
          <div className="feature-item">
            <span className="feature-icon">{features[currentFeature].icon}</span>
            <span className="feature-text">{features[currentFeature].text}</span>
          </div>
        </div>
        
        <div className="hero-buttons">
          <Link to="/events" className="btn btn-primary">
            🎪 Browse Events
          </Link>
          <Link to="/register" className="btn btn-secondary">
            🚀 Get Started
          </Link>
        </div>
        
        <div className="stats">
          <div className="stat-item">
            <h3>500+</h3>
            <p>Events Created</p>
          </div>
          <div className="stat-item">
            <h3>1000+</h3>
            <p>Happy Users</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Cities Covered</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;