import React from 'react';
import Navbar from './navbar.js';

import '../styles/detailsLayout.css';

const DetailsLayout = ({ children }) => {
    return (
        <div className="layout-details">

            <main>
                {children}
            </main>
            <Navbar />
        </div>
    );
};

export default DetailsLayout;