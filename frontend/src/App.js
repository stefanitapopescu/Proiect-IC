import './axiosConfig';  
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Volunteer from './pages/Volunteer';
import Entity from './pages/Entity';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/entity" element={<Entity />} />
      </Routes>
    </Router>
  );
}

export default App;
