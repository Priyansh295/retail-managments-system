import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import '../styles/Navbar.scss';

const Navbar = () => {
  const navigate = useNavigate();

  function handleClick(e) {
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="header-content">
        <h1 onClick={handleClick}>INVENTORY MANAGEMENT SYSTEM</h1>
        <div className="header-actions">
          <Link to="/login" className="sign-in-button">Sign In</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;