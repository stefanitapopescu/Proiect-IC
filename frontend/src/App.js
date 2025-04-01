import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home'; // 👈 import nou

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* 👈 pagina de start */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
