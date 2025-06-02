import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Entity.css';
import LocationAutocompleteMap from '../components/LocationAutocompleteMap';
import Cookies from 'js-cookie';
import PostedActionsModal from '../components/PostedActionsModal';

function Entity() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    locationLat: null,
    locationLng: null,
    category: "",
    requestedVolunteers: 0,
    actionDate: "",
    rewardItems: [],
  });

  const [rewardItem, setRewardItem] = useState({ name: "", quantity: 1, tag: "" });
  const [useRewardItems, setUseRewardItems] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPostedActionsModal, setShowPostedActionsModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRewardChange = (e) => {
    setRewardItem({ ...rewardItem, [e.target.name]: e.target.value });
  };

  const addRewardItem = () => {
    const itemToAdd = {
      ...rewardItem,
      quantity: Number(rewardItem.quantity),
    };

    if (!itemToAdd.name.trim() || itemToAdd.quantity <= 0 || !itemToAdd.tag) {
      setMessage("Completați numele, tag-ul și o cantitate mai mare decât 0!");
      setMessageType("error");
      return;
    }

    setFormData({
      ...formData,
      rewardItems: [...formData.rewardItems, itemToAdd],
    });
    setRewardItem({ name: "", quantity: 1, tag: "" });
    setMessage("Obiect adăugat cu succes!");
    setMessageType("success");

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const removeRewardItem = (index) => {
    const updatedItems = [...formData.rewardItems];
    updatedItems.splice(index, 1);
    setFormData({
      ...formData,
      rewardItems: updatedItems
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalFormData = {
      ...formData,
      rewardItems: useRewardItems ? formData.rewardItems : [],
      requestedVolunteers: Number(formData.requestedVolunteers),
    };

    if (useRewardItems && finalFormData.rewardItems.length === 0) {
      setMessage("Trebuie să adăugați cel puțin un premiu dacă doriți să oferiți recompense!");
      setMessageType("error");
      return;
    }

    const token = localStorage.getItem('token');

    axios.post("http://localhost:8080/api/entity/post-action", finalFormData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        setMessage(response.data || "Acțiune de voluntariat creată cu succes!");
        setMessageType("success");
        setFormData({
          title: "",
          description: "",
          location: "",
          locationLat: null,
          locationLng: null,
          category: "",
          requestedVolunteers: 0,
          actionDate: "",
          rewardItems: [],
        });
        setUseRewardItems(false);
      })
      .catch((error) => {
        console.error("Eroare la postare: ", error);
        if (error.response && error.response.data) {
          setMessage(error.response.data);
        } else {
          setMessage("Eroare la postarea acțiunii de voluntariat");
        }
        setMessageType("error");
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    Cookies.remove('token');
    Cookies.remove('userType');
    navigate('/login');
  };

  const categories = [
    { value: "environment", label: "Mediu" },
    { value: "social", label: "Social" },
    { value: "education", label: "Educație" },
    { value: "health", label: "Sănătate" },
    { value: "community", label: "Comunitate" }
  ];

  return (
    <div className="entity-page">
      <div className="content-container">
        <header className="entity-header">
          <h1>Panou Organizație</h1>
          <button className="logout-button" onClick={handleLogout}>Deconectare</button>
          <button
            className="posted-actions-button"
            onClick={() => setShowPostedActionsModal(true)}
          >
            Acțiunile mele postate
          </button>
        </header>

        <div className="entity-form-container">
          <div className="form-header">
            <h2>Creează o nouă acțiune de voluntariat</h2>
            <p>Completați detaliile pentru a publica o nouă oportunitate</p>
          </div>

          {message && (
            <div className={`message-box ${messageType}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="entity-form">
            <div className="form-group">
              <label htmlFor="title">Titlu acțiune</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                placeholder="Titlul acțiunii de voluntariat"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descriere</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                placeholder="Descrieți acțiunea în detaliu"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Locație</label>
              <LocationAutocompleteMap
                value={formData.location}
                coords={formData.locationLat && formData.locationLng ? [formData.locationLat, formData.locationLng] : null}
                onLocationSelect={({ address, lat, lng }) => setFormData(f => ({ ...f, location: address, locationLat: lat, locationLng: lng }))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Categorie</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Selectați categoria</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="requestedVolunteers">Voluntari necesari</label>
                <input
                  type="number"
                  id="requestedVolunteers"
                  name="requestedVolunteers"
                  min="1"
                  value={formData.requestedVolunteers}
                  placeholder="Număr de voluntari"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="actionDate">Data acțiunii</label>
                <input
                  type="datetime-local"
                  id="actionDate"
                  name="actionDate"
                  value={formData.actionDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={useRewardItems}
                  onChange={() => setUseRewardItems(!useRewardItems)}
                />
                <span>Doresc să adaug recompense pentru voluntari</span>
              </label>
            </div>

            {useRewardItems && (
              <div className="reward-items-section">
                <h3>Recompense pentru voluntari</h3>

                <div className="reward-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="rewardName">Denumire</label>
                      <input
                        type="text"
                        id="rewardName"
                        name="name"
                        value={rewardItem.name}
                        placeholder="Denumirea recompensei"
                        onChange={handleRewardChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="rewardQuantity">Cantitate</label>
                      <input
                        type="number"
                        id="rewardQuantity"
                        name="quantity"
                        min="1"
                        value={rewardItem.quantity}
                        placeholder="Cantitate"
                        onChange={handleRewardChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="rewardTag">Tag</label>
                      <select
                        id="rewardTag"
                        name="tag"
                        value={rewardItem.tag}
                        onChange={handleRewardChange}
                      >
                        <option value="">Selectează tag</option>
                        <option value="alimente">alimente</option>
                        <option value="electrocasnice">electrocasnice</option>
                        <option value="jocuri">jocuri</option>
                        <option value="vouchere">vouchere</option>
                        <option value="accesorii">accesorii</option>
                        <option value="haine">haine</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      className="add-reward-btn"
                      onClick={addRewardItem}
                    >
                      Adaugă
                    </button>
                  </div>
                </div>

                {formData.rewardItems.length > 0 && (
                  <div className="reward-items-list">
                    <h4>Recompense adăugate</h4>
                    <ul>
                      {formData.rewardItems.map((item, index) => (
                        <li key={index}>
                          <span>{item.name} - {item.quantity} buc.</span>
                          <button
                            type="button"
                            className="remove-reward-btn"
                            onClick={() => removeRewardItem(index)}
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <button type="submit" className="submit-button">Publică acțiunea</button>
          </form>
        </div>
      </div>

      <PostedActionsModal
        isOpen={showPostedActionsModal}
        onClose={() => setShowPostedActionsModal(false)}
      />
    </div>
  );
}

export default Entity;
