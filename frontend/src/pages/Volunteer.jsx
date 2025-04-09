// src/pages/Volunteer.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Volunteer() {
  const [actions, setActions] = useState([]);
  const [signupMessage, setSignupMessage] = useState("");

  // La montarea componentei, încarcă lista de acțiuni de voluntariat
  useEffect(() => {
    axios.get("http://localhost:8080/api/volunteer/actions")
      .then(response => {
         setActions(response.data);
      })
      .catch(error => {
         console.error("Eroare la încărcarea acțiunilor: ", error);
      });
  }, []);

  // Funcție pentru înscrierea la o acțiune
  const handleSignup = (actionId) => {
    axios.post("http://localhost:8080/api/volunteer/signup", { volunteerActionId: actionId })
      .then(response => {
         setSignupMessage(response.data);
         // Poți reîncărca lista de acțiuni dacă este nevoie
      })
      .catch(error => {
         console.error("Eroare la înscriere: ", error);
         setSignupMessage("Eroare la înscriere");
      });
  };

  return (
    <div>
      <h2>Volunteer Dashboard</h2>
      <ul>
        {actions.map(action => (
          <li key={action.id}>
            <h3>{action.title}</h3>
            <p>{action.description}</p>
            <p>Voluntari solicitați: {action.requestedVolunteers}</p>
            <p>Voluntari înscriși: {action.allocatedVolunteers}</p>
            <button onClick={() => handleSignup(action.id)}>Înscrie-te</button>
          </li>
        ))}
      </ul>
      {signupMessage && <p>{signupMessage}</p>}
    </div>
  );
}

export default Volunteer;
