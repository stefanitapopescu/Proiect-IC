import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Volunteer.css';

function Volunteer() {
  const [actions, setActions] = useState([]);
  const [signupMessages, setSignupMessages] = useState({});
  const [joinedActions, setJoinedActions] = useState({});

  useEffect(() => {
    axios.get("http://localhost:8080/api/volunteer/actions")
      .then(response => {
        setActions(response.data);
      })
      .catch(error => {
        console.error("Eroare la încărcarea acțiunilor: ", error);
      });
  }, []);

  const handleSignup = (actionId) => {
    if (joinedActions[actionId]) {
      return;
    }
    axios.post("http://localhost:8080/api/volunteer/signup", { volunteerActionId: actionId })
      .then(response => {
        setSignupMessages(prev => ({
          ...prev,
          [actionId]: { message: response.data, type: 'success' }
        }));
        setJoinedActions(prev => ({
          ...prev,
          [actionId]: true
        }));
      })
      .catch(error => {
        const errorMessage = error.response?.data?.message || "Eroare la înscriere";
        setSignupMessages(prev => ({
          ...prev,
          [actionId]: { message: errorMessage, type: 'error' }
        }));
      });      
  };

  return (
    <div className="volunteer-page">
      <h2>Volunteer Dashboard</h2>
      <div className="volunteer-list">
        {actions.map(action => (
          <div className="volunteer-card" key={action.id}>
            <h3>{action.title}</h3>
            <p>{action.description}</p>
            <p>Voluntari solicitați: {action.requestedVolunteers}</p>
            <p>Voluntari înscriși: {action.allocatedVolunteers}</p>
            {!joinedActions[action.id] && (
              <button onClick={() => handleSignup(action.id)}>Înscrie-te</button>
            )}
            {signupMessages[action.id] && (
              <p className={signupMessages[action.id].type === 'success' ? 'signup-message success' : 'signup-message error'}>
                {signupMessages[action.id].message}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Volunteer;
