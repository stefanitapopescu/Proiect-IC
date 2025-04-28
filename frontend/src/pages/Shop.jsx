import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Shop.css';

function Shop() {
  const [rewards, setRewards] = useState([]);
  const [boughtRewards, setBoughtRewards] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = () => {
    axios.get('http://localhost:8080/api/shop/rewards')
      .then(response => {
        setRewards(response.data);
      })
      .catch(error => {
        console.error("Eroare la încărcarea reward-urilor:", error);
      });
  };

  const handleBuy = (rewardId) => {
    axios.post(`http://localhost:8080/api/shop/buy/${rewardId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      setMessage(response.data.message || "Achiziție reușită!");
      setBoughtRewards([...boughtRewards, rewardId]);
      fetchRewards(); 
    })
    .catch(error => {
      console.error("Eroare la cumpărare:", error);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || "Eroare necunoscută la cumpărare");
      } else {
        setMessage("Eroare necunoscută la cumpărare");
      }
    });
  };
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="shop-page">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      <h2>Shop - Bonusuri disponibile</h2>
      {message && <p className="shop-message">{message}</p>}
      <div className="rewards-list">
        {rewards.map((reward) => (
          <div key={reward.id} className="reward-card">
            <h3>{reward.name}</h3>
            <p>Cantitate disponibilă: {reward.quantity}</p>
            <button 
              onClick={() => handleBuy(reward.id)}
              disabled={boughtRewards.includes(reward.id) || reward.quantity <= 0}
            >
              {boughtRewards.includes(reward.id) ? "Deja cumpărat" : "Cumpără"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;
