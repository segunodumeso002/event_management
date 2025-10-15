import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = !isOpen ? 'hidden' : 'auto';
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          🎉 Event Manager
        </Link>
        
        <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div className="nav-menu">
          <Link to="/events" className="nav-link" onClick={closeMenu}>Events</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</Link>
              {user.role === 'organizer' && (
                <Link to="/attendees" className="nav-link" onClick={closeMenu}>Attendees</Link>
              )}
              <span className="nav-user">Hello, {user.firstname}! 👋</span>
              <button onClick={() => { logout(); closeMenu(); }} className="nav-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
              <Link to="/register" className="nav-link" onClick={closeMenu}>Register</Link>
            </>
          )}
        </div>
        
        <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/events" className="nav-link-mobile" onClick={closeMenu}>Events</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link-mobile" onClick={closeMenu}>Dashboard</Link>
              {user.role === 'organizer' && (
                <Link to="/attendees" className="nav-link-mobile" onClick={closeMenu}>Attendees</Link>
              )}
              <div className="nav-user">Hello, {user.firstname}! 👋</div>
              <button onClick={() => { logout(); closeMenu(); }} className="btn btn-danger">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link-mobile" onClick={closeMenu}>Login</Link>
              <Link to="/register" className="nav-link-mobile" onClick={closeMenu}>Register</Link>
            </>
          )}
        </div>
        
        {isOpen && <div className="mobile-overlay" onClick={closeMenu}></div>}
      </div>
    </nav>
  );
};

export default Navbar;