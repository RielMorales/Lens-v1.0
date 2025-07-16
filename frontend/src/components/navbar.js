import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <ul className="navbar-links">
                <li className="home-nav"><Link to="/home">Home</Link></li>
                <li className="scan-nav"><Link to="/scan">Scanner</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;