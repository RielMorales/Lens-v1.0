import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css'; // Adjust path if needed

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/scan">AR Scanner</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
