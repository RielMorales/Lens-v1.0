import React from 'react';
import Navbar from './navbar.js';

import '../styles/detailsLayout.css';

const DetailsLayout = ({ children }) => {
    return (
        <div className="layout">

            <main style={{ padding: '1rem' }}>
                {children}
            </main>
            <Navbar />
        </div>
    );
};

export default DetailsLayout;