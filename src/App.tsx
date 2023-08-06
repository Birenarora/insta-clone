import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AllRoutes from './AllRoutes';

function App() {
  return (
    <Router>
      <div className="App">
        <AllRoutes />
      </div>
    </Router>
  );
}

export default App;
