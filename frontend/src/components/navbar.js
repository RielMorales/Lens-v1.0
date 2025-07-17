import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
    return (
        <div>
            <nav className="navbar">
                <ul className="navbar-links">
                    <li className="navbar-home"><Link to="/home">Home</Link></li>
                    <li className="navbar-scan"><Link to="/scan">Scanner</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;