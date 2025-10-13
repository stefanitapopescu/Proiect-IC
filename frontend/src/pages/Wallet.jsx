import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Wallet.css";

function Wallet() {
  const [boughtRewards, setBoughtRewards] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/shop/wallet", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setBoughtRewards(response.data);
      })
      .catch((error) => {
        console.error("Eroare la încărcarea reward-urilor cumpărate:", error);
      });
  }, []);

  return (
    <div className="wallet-page">
      <h2>Portofel - Rewarduri Cumpărate</h2>
      <div className="wallet-list">
        {boughtRewards.length === 0 ? (
          <p>Nu ai cumpărat niciun reward încă.</p>
        ) : (
          boughtRewards.map((reward) => (
            <div key={reward.id} className="wallet-card">
              <h3>{reward.name}</h3>
              <div className="quantity-badge">
                <span className="quantity-label">Cantitate:</span>
                <span className="quantity-value">{reward.quantity}</span>
              </div>
              {reward.tag && (
                <div className="reward-tag">
                  <span>{reward.tag}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Wallet;
