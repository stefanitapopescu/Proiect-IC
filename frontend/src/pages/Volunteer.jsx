import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';
import './Volunteer.css';

function Volunteer() {
  const [actions, setActions] = useState([]);
  const [signupMessages, setSignupMessages] = useState({});
  const [joinedActions, setJoinedActions] = useState({});
  const [points, setPoints] = useState(0);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const authAxios = axios.create();
  
  authAxios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  
  authAxios.interceptors.response.use(
    response => response,
    error => {
      console.log('Error response:', error.response ? error.response.status : 'No response');
      
      if (error.response) {
        if (error.response.status === 403) {
          console.log('Authentication error (403) - redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          navigate('/login');
        } else if (error.response.status === 404) {
          console.log('Endpoint not found (404) - API likely not implemented yet');
          return Promise.resolve({ data: {} }); 
        }
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token) {
      console.log('No token found - redirecting to login');
      navigate('/login');
      return;
    }
    
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const tokenData = JSON.parse(decodedPayload);
      console.log('Token payload:', tokenData);
      console.log('Token subject:', tokenData.sub);
      console.log('Token expiration:', new Date(tokenData.exp * 1000).toLocaleString());
      console.log('Current time:', new Date().toLocaleString());
      console.log('Is token expired:', new Date(tokenData.exp * 1000) < new Date());
    } catch (e) {
      console.error('Error decoding token:', e);
    }
    
    if (userType !== 'volunteer') {
      console.log('User is not a volunteer - redirecting to login');
      navigate('/login');
      return;
    }
    
    console.log('Token and userType are valid, proceeding to fetch data');
    
    axios.get('http://localhost:8080/api/auth-debug')
      .then(response => {
        console.log('Auth debug response:', response.data);
      })
      .catch(error => {
        console.error('Error accessing auth-debug endpoint:', error);
      });
    
    authAxios.get('http://localhost:8080/api/volunteer/debug')
      .then(response => {
        console.log('Volunteer debug response:', response.data);
        fetchVolunteerActions();
        fetchUserPoints();
      })
      .catch(error => {
        console.error('Error accessing volunteer debug endpoint:', error);
        fetchVolunteerActions();
        fetchUserPoints();
      });
  }, [navigate]);

  const fetchVolunteerActions = () => {
    console.log('Fetching volunteer actions...');
    authAxios.get("http://localhost:8080/api/volunteer/actions")
      .then(response => {
        console.log('Actions fetched successfully:', response.data);
        if (Array.isArray(response.data)) {
          console.log('Action categories:', response.data.map(action => ({ 
            id: action.id,
            title: action.title,
            category: action.category 
          })));
        }
        setActions(response.data);
      })
      .catch(error => {
        console.error("Eroare la încărcarea acțiunilor: ", error);
      });
  };

  const fetchUserPoints = () => {
    console.log('Fetching user points...');
    authAxios.get('http://localhost:8080/api/volunteer/points')
      .then(response => {
        console.log('Points fetched successfully:', response.data);
        setPoints(response.data);
      })
      .catch(error => {
        console.error("Eroare la încărcarea punctelor:", error);
      });
  };

  const handleSignup = (actionId) => {
    if (joinedActions[actionId]) {
      return;
    }
    
    authAxios.post("http://localhost:8080/api/volunteer/signup", { volunteerActionId: actionId })
      .then(response => {
        setSignupMessages(prev => ({
          ...prev,
          [actionId]: { message: response.data, type: 'success' }
        }));
        setJoinedActions(prev => ({
          ...prev,
          [actionId]: true
        }));
        fetchUserPoints();
      })
      .catch(error => {
        const errorMessage = error.response?.data?.message || "Eroare la înscriere";
        setSignupMessages(prev => ({
          ...prev,
          [actionId]: { message: errorMessage, type: 'error' }
        }));
      });
  };

  const filterActions = () => {
    let filteredActions = [...actions];
    
    if (search.trim() !== '') {
      const searchLower = search.toLowerCase();
      filteredActions = filteredActions.filter(action => 
        action.title.toLowerCase().includes(searchLower) || 
        (action.description && action.description.toLowerCase().includes(searchLower))
      );
    }
    
    if (filter !== 'all') {
      filteredActions = filteredActions.filter(action => {
        const actionCategory = action.category ? action.category.toLowerCase() : '';
        const filterCategory = filter.toLowerCase();
        
        console.log(`Comparing action category [${actionCategory}] with filter [${filterCategory}]`);
        return actionCategory === filterCategory;
      });
    }
    
    return filteredActions;
  };

  return (
    <div className="volunteer-page">
      <div className="content-container">
        <header className="volunteer-header">
          <h1>Oportunități de voluntariat</h1>
          <div className="user-points">
            <span className="points-label">Punctele tale:</span>
            <span className="points-value">{points}</span>
          </div>
        </header>
        
        <div className="filters-section">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Caută acțiuni..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="category-filters">
            <button 
              className={filter === 'all' ? 'active' : ''} 
              onClick={() => setFilter('all')}
            >
              Toate
            </button>
            <button 
              className={filter === 'environment' ? 'active' : ''} 
              onClick={() => setFilter('environment')}
            >
              Mediu
            </button>
            <button 
              className={filter === 'social' ? 'active' : ''} 
              onClick={() => setFilter('social')}
            >
              Social
            </button>
            <button 
              className={filter === 'education' ? 'active' : ''} 
              onClick={() => setFilter('education')}
            >
              Educație
            </button>
          </div>
        </div>
        
        <div className="grid-layout volunteer-grid">
          {filterActions().length > 0 ? (
            filterActions().map(action => (
              <Card
                key={action.id}
                title={action.title}
                description={action.description || "O oportunitate de voluntariat pentru a face diferența."}
                category={action.category}
                stats={[
                  { label: "Voluntari solicitați", value: action.requestedVolunteers },
                  { label: "Voluntari înscriși", value: action.allocatedVolunteers },
                  { label: "Data", value: action.date || "Va fi anunțată" },
                  { label: "Locație", value: action.location || "TBD" }
                ]}
                buttonText={joinedActions[action.id] ? "Înscris" : "Înscrie-te"}
                buttonAction={() => handleSignup(action.id)}
                buttonDisabled={joinedActions[action.id]}
                message={signupMessages[action.id]?.message}
                messageType={signupMessages[action.id]?.type}
                imageUrl={action.imageUrl || null}
              />
            ))
          ) : (
            <div className="no-actions-message">
              <p>Nu există acțiuni de voluntariat disponibile pentru criteriile selectate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Volunteer;
