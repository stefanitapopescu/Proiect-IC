// src/pages/Entity.jsx
import React, { useState } from 'react';
import axios from 'axios';

function Entity() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    type: "",
    requestedVolunteers: 0,
    actionDate: "",
    rewardItems: []
  });
  
  // Pentru a adăuga un obiect de tip reward item temporar
  const [rewardItem, setRewardItem] = useState({ name: "", quantity: 0 });
  const [message, setMessage] = useState("");

  // Actualizează datele principale din formular
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Actualizează rewardItem
  const handleRewardChange = (e) => {
    setRewardItem({ ...rewardItem, [e.target.name]: e.target.value });
  };

  // Adaugă reward item la lista rewardItems din formular
  const addRewardItem = () => {
    setFormData({ ...formData, rewardItems: [...formData.rewardItems, rewardItem] });
    // Resetează rewardItem pentru a adăuga noi obiecte ulterior
    setRewardItem({ name: "", quantity: 0 });
  };

  // Trimite formularul pentru postarea unei noi acțiuni
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8080/api/entity/post-action", formData)
      .then(response => {
          setMessage(response.data);
      })
      .catch(error => {
          console.error("Eroare la postare: ", error);
          setMessage("Eroare la postarea acțiunii");
      });
  };

  return (
    <div>
      <h2>Entity Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Titlu" onChange={handleChange} required />
        <textarea name="description" placeholder="Descriere" onChange={handleChange} required />
        <input type="text" name="location" placeholder="Locație" onChange={handleChange} required />
        <input type="text" name="type" placeholder="Tipul acțiunii" onChange={handleChange} required />
        <input type="number" name="requestedVolunteers" placeholder="Voluntari solicitați" onChange={handleChange} required />
        <input type="datetime-local" name="actionDate" onChange={handleChange} required />

        <h3>Reward Items</h3>
        <input type="text" name="name" placeholder="Nume obiect" value={rewardItem.name} onChange={handleRewardChange} required />
        <input type="number" name="quantity" placeholder="Cantitate" value={rewardItem.quantity} onChange={handleRewardChange} required />
        <button type="button" onClick={addRewardItem}>Adaugă obiect</button>

        <button type="submit">Postează acțiunea</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Entity;
