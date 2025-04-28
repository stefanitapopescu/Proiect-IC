import "./axiosConfig";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Volunteer from "./pages/Volunteer";
import Entity from "./pages/Entity";
import Shop from "./pages/Shop"
import VolunteerHome from "./pages/VolunteerHome";
import Wallet from './pages/Wallet';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/volunteer-home" element={<VolunteerHome />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/entity" element={<Entity />} />
        <Route path="/wallet" element={<Wallet />} />
      </Routes>
    </Router>
  );
}

export default App;
