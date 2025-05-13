// src/components/Shop.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Shop.css';

function Shop() {
  const [rewards, setRewards] = useState([]);
  const [points, setPoints] = useState(0);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchRewards();
    fetchUserPoints();
  }, [navigate]);

  const fetchRewards = () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8080/api/shop/rewards', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setRewards(response.data))
    .catch(error => {
      console.error("Eroare la încărcarea reward-urilor:", error);
      if (error.response && error.response.status === 403) {
        navigate('/login');
      }
    });
  };

  const fetchUserPoints = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get('http://localhost:8080/api/volunteer/points', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setPoints(response.data))
    .catch(error => {
      console.error("Eroare la încărcarea punctelor:", error);
      if (error.response && error.response.status === 403) {
        navigate('/login');
      }
    });
  };

  const handleBuy = (rewardId, pointCost) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (points < pointCost) {
      setMessage("Nu ai suficiente puncte pentru acest reward!");
      return;
    }

    axios.post(`http://localhost:8080/api/shop/buy/${rewardId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      // extragem textul din obiectul { message: "..."}
      const msg = response.data?.message || response.data;
      setMessage(msg);
      fetchRewards();
      fetchUserPoints();
    })
    .catch(error => {
      console.error("Eroare la cumpărare:", error);
      if (error.response) {
        // dacă serverul trimite { message: "..." }
        if (error.response.data?.message) {
          setMessage(error.response.data.message);
        } else if (error.response.status === 403) {
          navigate('/login');
        } else {
          setMessage("Eroare necunoscută la cumpărare");
        }
      } else {
        setMessage("Eroare necunoscută la cumpărare");
      }
    });
  };

  const getButtonText = (reward) => {
    if (reward.quantity <= 0) return "Sold Out";
    if (points < reward.pointCost) return "Puncte insuficiente";
    return "Cumpără";
  };

  return (
    <div className="shop-page">
      <div className="content-container">
        <header className="shop-header">
          <h1>Shop - Bonusuri disponibile</h1>
          <div className="user-points">
            <span className="points-label">Punctele tale:</span>
            <span className="points-value">{points}</span>
          </div>
        </header>

        {message && (
          <div className="global-message info">
            {message}
          </div>
        )}

        <div className="rewards-grid">
          {rewards.length > 0 ? (
            rewards.map((reward) => (
              <div key={reward.id} className="reward-card">
                <h3>{reward.name}</h3>
                <p>{reward.description}</p>
                <div className="reward-tags">
                  <span className={`reward-tag tag-${reward.tag}`}>
                    {reward.tag}
                  </span>
                </div>
                <div className="reward-details">
                  <div className="reward-cost">
                    Cost: {reward.pointCost} puncte
                  </div>
                  <div className="reward-stock">
                    {reward.quantity > 0
                      ? `În stoc: ${reward.quantity}`
                      : "Stoc epuizat"}
                  </div>
                </div>
                <button
                  className={`buy-button ${
                    reward.quantity <= 0 || points < reward.pointCost
                      ? 'disabled'
                      : ''
                  }`}
                  disabled={reward.quantity <= 0 || points < reward.pointCost}
                  onClick={() => handleBuy(reward.id, reward.pointCost)}
                >
                  {getButtonText(reward)}
                </button>
              </div>
            ))
          ) : (
            <div className="no-rewards-message">
              <p>Nu există recompense disponibile momentan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;
