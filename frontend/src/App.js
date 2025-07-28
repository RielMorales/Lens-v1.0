import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// import pages/components
import Home from './pages/home.js';
import Scanner from './pages/scan.js';
import DetailsPage from './pages/detailsOfBuildings.js';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to='/home' replace />} />
          <Route path="/home" element={<Home data={""} />} />
          <Route path="/home/details/:id" element={<DetailsPage />} />
          <Route path="/scan" element={<Scanner data={""} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
