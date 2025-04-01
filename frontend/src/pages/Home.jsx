// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Vom crea și un fișier de CSS

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Fii schimbarea pe care vrei să o vezi în lume.</h1>
        <p>Alătură-te comunității noastre de voluntari și fă diferența!</p>
        <button onClick={() => navigate('/login')}>Începe acum</button>
      </div>
    </div>
  );
}

export default Home;
