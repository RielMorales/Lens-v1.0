import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Scanner from './pages/scan.js';

export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/scan" replace />} />
          <Route path="/scan" element={<Scanner />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
