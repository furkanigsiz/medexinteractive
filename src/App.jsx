import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MedexAI from './components/MedexAI';
import './styles/global.css';
import './styles/MedexAI.css';

function App() {
  return (
    <>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/departments/:id" element={<div>Departman Sayfası</div>} />
          </Routes>
        </div>
        <MedexAI />
      </Router>
    </>
  );
}

export default App;
