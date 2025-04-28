import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VolunteerHome.css';

function VolunteerHome() {
  const navigate = useNavigate();

  return (
    <div className="volunteer-home">
      <h2>Bine ai venit, Voluntar!</h2>
      <div className="volunteer-buttons">
        <button onClick={() => navigate('/volunteer')}>Volunteer Dashboard</button>
        <button onClick={() => navigate('/shop')}>Shop</button>
      </div>
    </div>
  );
}

export default VolunteerHome;
