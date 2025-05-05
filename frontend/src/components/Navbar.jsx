import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const storedUserType = localStorage.getItem('userType');
      setUserType(storedUserType);
    } else {
      setIsLoggedIn(false);
      setUserType(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setIsLoggedIn(false);
    setUserType(null);
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">VolunteerHub</span>
        </Link>
        
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={menuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        
        <ul className={menuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          
          {isLoggedIn ? (
            <>
              {userType === 'volunteer' && (
                <>
                  <li className="nav-item">
                    <Link to="/volunteer" className="nav-link" onClick={() => setMenuOpen(false)}>
                      Actions
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/wallet" className="nav-link" onClick={() => setMenuOpen(false)}>
                      Wallet
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/shop" className="nav-link" onClick={() => setMenuOpen(false)}>
                      Shop
                    </Link>
                  </li>
                </>
              )}
              
              {userType === 'entity' && (
                <li className="nav-item">
                  <Link to="/entity" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                </li>
              )}
              
              <li className="nav-item">
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="nav-link signup-link" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 