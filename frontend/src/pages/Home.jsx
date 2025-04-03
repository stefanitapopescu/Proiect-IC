// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    // Apelăm endpoint-ul protejat pentru a verifica tokenul JWT
    axios.get("http://localhost:8080/api/test")
      .then(response => {
        console.log(response.data);
        setTestMessage(response.data);
      })
      .catch(err => {
        console.error(err);
        setTestMessage("Eroare la accesarea endpoint-ului protejat");
      });
  }, []);

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Fii schimbarea pe care vrei să o vezi în lume.</h1>
        <p>Alătură-te comunității noastre de voluntari și fă diferența!</p>
        <button onClick={() => navigate('/login')}>Începe acum</button>
        {/* Poți afișa rezultatul testului aici */}
        {testMessage && <p>{testMessage}</p>}
      </div>
    </div>
  );
}

export default Home;
