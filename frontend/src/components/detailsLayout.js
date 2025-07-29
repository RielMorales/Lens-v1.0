// Import React and the Navbar component
import React from 'react';
import Navbar from './navbar.js';

import '../styles/detailsLayout.css';

// Layout component used to wrap details pages
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