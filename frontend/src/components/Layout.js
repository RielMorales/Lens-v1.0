import React from 'react';
import Navbar from './navbar.js';

import '../styles/layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      
      <main style={{ padding: '1rem' }}>
        {children}
      </main>
      <Navbar />
    </div>
  );
};

export default Layout;
