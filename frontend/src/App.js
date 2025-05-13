import "./axiosConfig";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Volunteer from "./pages/Volunteer";
import Entity from "./pages/Entity";
import Shop from "./pages/Shop";
import VolunteerHome from "./pages/VolunteerHome";
import Wallet from './pages/Wallet';
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* RUTE PROTEJATE */}
            <Route
              path="/volunteer-home"
              element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <VolunteerHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shop"
              element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <Shop />
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer"
              element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <Volunteer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entity"
              element={
                <ProtectedRoute allowedRoles={['entity']}>
                  <Entity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <Wallet />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;