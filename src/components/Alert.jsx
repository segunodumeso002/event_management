import { useState, useEffect } from 'react';

const Alert = ({ message, type, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`alert alert-${type} ${isVisible ? 'alert-show' : 'alert-hide'}`}>
      <span className="alert-icon">{getIcon()}</span>
      <span className="alert-message">{message}</span>
      <button className="alert-close" onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}>×</button>
    </div>
  );
};

export default Alert;