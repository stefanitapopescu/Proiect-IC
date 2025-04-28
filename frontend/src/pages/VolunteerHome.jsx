import React from "react";
import { useNavigate } from "react-router-dom";
import "./VolunteerHome.css";

function VolunteerHome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="volunteer-home">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <h2>Bine ai venit, Voluntar!</h2>
      <div className="volunteer-buttons">
        <button onClick={() => navigate("/volunteer")}>Voluntariat</button>
        <button onClick={() => navigate("/shop")}>Magazin</button>
        <button onClick={() => navigate("/wallet")}>Portofel</button>
      </div>
    </div>
  );
}

export default VolunteerHome;
