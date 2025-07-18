import React from 'react';
import Navbar from './navbar.js';

import LensLogo from '../assets/images/upou-lens-home.png';
import '../styles/layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <img alt="Lens Logo" src={LensLogo} className="lens-logo" />
      <main className="main">
        {children}
      </main>
      <Navbar />
    </div>
  );
};

export default Layout;
