import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Shop.css';

function Shop() {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/shop/rewards')
      .then(response => {
        setRewards(response.data);
      })
      .catch(error => {
        console.error("Eroare la încărcarea reward-urilor:", error);
      });
  }, []);

  return (
    <div className="shop-page">
      <h2>Shop - Bonusuri disponibile</h2>
      <div className="rewards-list">
        {rewards.map((reward, index) => (
          <div key={index} className="reward-card">
            <h3>{reward.name}</h3>
            <p>Cantitate disponibilă: {reward.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;
