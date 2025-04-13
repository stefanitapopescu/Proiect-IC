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

 
  const [rewardItem, setRewardItem] = useState({ name: "", quantity: 0 });

  
  const [useRewardItems, setUseRewardItems] = useState(false);

  const [message, setMessage] = useState("");

 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRewardChange = (e) => {
    setRewardItem({ ...rewardItem, [e.target.name]: e.target.value });
  };

  const addRewardItem = () => {
   
    const itemToAdd = {
      ...rewardItem,
      quantity: Number(rewardItem.quantity)
    };

    if (!itemToAdd.name.trim() || itemToAdd.quantity <= 0) {
      alert("Completati numele obiectului și o cantitate mai mare decât 0!");
      return;
    }

    setFormData({
      ...formData,
      rewardItems: [...formData.rewardItems, itemToAdd]
    });
    setRewardItem({ name: "", quantity: 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dacă opțiunea de adăugare reward items nu este bifată, setăm rewardItems la un array gol
    const finalFormData = {
      ...formData,
      rewardItems: useRewardItems ? formData.rewardItems : [],
      requestedVolunteers: Number(formData.requestedVolunteers)
    };

    if (useRewardItems && finalFormData.rewardItems.length === 0) {
      setMessage("Trebuie să adăugați cel puțin un premiu dacă doriți să adăugați premii!");
      return;
    }

    axios.post("http://localhost:8080/api/entity/post-action", finalFormData)
      .then((response) => {
          setMessage(response.data);  // "Acțiunea de voluntariat a fost postată cu succes!"
      })
      .catch((error) => {
          console.error("Eroare la postare: ", error);
          if (error.response && error.response.data) {
            setMessage(error.response.data);
          } else {
            setMessage("Eroare la postarea acțiunii");
          }
      });
  };

  return (
    <div>
      <h2>Entity Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Titlu"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descriere"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Locație"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="type"
          placeholder="Tipul acțiunii"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="requestedVolunteers"
          placeholder="Voluntari solicitați"
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="actionDate"
          onChange={handleChange}
          required
        />

        <label>
          <input
            type="checkbox"
            checked={useRewardItems}
            onChange={() => setUseRewardItems(!useRewardItems)}
          />
          Doresc să adaug premii voluntarilor
        </label>

        {useRewardItems && (
          <div>
            <h3>Reward Items</h3>
            {}
            <input
              type="text"
              name="name"
              placeholder="Nume obiect"
              value={rewardItem.name}
              onChange={handleRewardChange}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Cantitate"
              value={rewardItem.quantity}
              onChange={handleRewardChange}
            />
            <button type="button" onClick={addRewardItem}>
              Adaugă obiect
            </button>

            <ul>
              {formData.rewardItems.map((ri, index) => (
                <li key={index}>
                  {ri.name} - {ri.quantity}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit">Postează acțiunea</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Entity;
