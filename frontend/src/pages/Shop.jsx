import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Card from '../components/Card';
import './Shop.css';

function Shop() {
  const [rewards, setRewards] = useState([]);
  const [boughtRewards, setBoughtRewards] = useState([]);
  const [message, setMessage] = useState("");
  const [points, setPoints] = useState(0);
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
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setRewards(response.data);
      })
      .catch(error => {
        console.error("Eroare la încărcarea reward-urilor:", error);
        if (error.response && error.response.status === 403) {
          navigate('/login');
        }
      });
  };

  const fetchUserPoints = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8080/api/volunteer/points', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setPoints(response.data);
      })
      .catch(error => {
        console.error("Eroare la încărcarea punctelor:", error);
        if (error.response && error.response.status === 403) {
          navigate('/login');
        }
      });
    }
  };

  const handleBuy = (rewardId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    axios.post(`http://localhost:8080/api/shop/buy/${rewardId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setMessage(response.data.message || "Achiziție reușită!");
      setBoughtRewards([...boughtRewards, rewardId]);
      fetchRewards(); 
      fetchUserPoints();
    })
    .catch(error => {
      console.error("Eroare la cumpărare:", error);
      if (error.response) {
        if (error.response.status === 403) {
          navigate('/login');
        } else if (error.response.data) {
          setMessage(error.response.data.message || "Eroare necunoscută la cumpărare");
        }
      } else {
        setMessage("Eroare necunoscută la cumpărare");
      }
    });
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
        
        <div className="grid-layout rewards-grid">
          {rewards.length > 0 ? (
            rewards.map((reward) => (
              <Card
                key={reward.id}
                title={reward.name}
                description={reward.description || "Recompensă specială pentru voluntari dedicați."}
                stats={[
                  { label: "Cantitate disponibilă", value: reward.quantity },
                  { label: "Puncte necesare", value: reward.pointCost || "N/A" }
                ]}
                buttonText={boughtRewards.includes(reward.id) ? "Deja cumpărat" : "Cumpără"}
                buttonAction={() => handleBuy(reward.id)}
                buttonDisabled={boughtRewards.includes(reward.id) || reward.quantity <= 0 || (reward.pointCost && points < reward.pointCost)}
                imageUrl={reward.imageUrl || null}
              />
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
