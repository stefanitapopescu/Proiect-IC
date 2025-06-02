import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';
import ActionLocationMap from '../components/ActionLocationMap';
import JoinedActionsModal from '../components/JoinedActionsModal';
import './Volunteer.css';

function Volunteer() {
  const [actions, setActions] = useState([]);
  const [signupMessages, setSignupMessages] = useState({});
  const [joinedActions, setJoinedActions] = useState({});
  const [points, setPoints] = useState(0);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [expandedAction, setExpandedAction] = useState(null);
  const [showMapFor, setShowMapFor] = useState(null);
  const [showJoinedActionsModal, setShowJoinedActionsModal] = useState(false);
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

    if (locationFilter.trim() !== '') {
      const locationFilterLower = locationFilter.toLowerCase();
      filteredActions = filteredActions.filter(action => {
        if (!action.location) return false;
        const locationLower = action.location.toLowerCase();
        return locationLower.includes(locationFilterLower);
      });
    }

    return filteredActions;
  };

  return (
    <div className="volunteer-page">
      <div className="content-container">
        <header className="volunteer-header">
          <h1>Oportunități de voluntariat</h1>
          <div className="header-actions">
            <div className="user-points">
              <span className="points-label">Punctele tale:</span>
              <span className="points-value">{points}</span>
            </div>
            <button
              className="joined-actions-button"
              onClick={() => setShowJoinedActionsModal(true)}
            >
              Acțiunile mele
            </button>
          </div>
        </header>

        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Caută acțiuni (titlu/descriere)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="location-filter-box">
            <input
              type="text"
              placeholder="Filtrează după oraș/județ..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="actions-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
          {filterActions().map(action => (
            <div key={action.id} className="action-card" style={{ border: '1px solid #eee', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 16, textAlign: 'center', minWidth: 0 }}>
              <h2 style={{ margin: 0, color: '#3498db', fontWeight: 700, fontSize: 22 }}>{action.title}</h2>

              <button
                style={{ margin: '16px 0 0 0', background: '#3498db', color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}
                onClick={() => setExpandedAction(expandedAction === action.id ? null : action.id)}
              >
                {expandedAction === action.id ? 'Ascunde detalii' : 'Apasă pentru mai multe detalii'}
              </button>
              {expandedAction === action.id && (
                <div style={{ marginTop: 18, textAlign: 'left' }}>
                  <p style={{ margin: '8px 0' }}>{action.description}</p>
                  <p style={{ margin: '8px 0' }}><b>Data:</b> {action.date || 'Nespecificată'}</p>
                  <p style={{ margin: '8px 0' }}><b>Locație:</b> {action.location}</p>
                  <button
                    style={{ margin: '8px 0 8px 0', background: '#3498db', color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}
                    onClick={() => setShowMapFor(showMapFor === action.id ? null : action.id)}
                  >
                    {showMapFor === action.id ? 'Ascunde harta' : 'Vezi pe hartă'}
                  </button>
                  <button
                    style={{ margin: '8px 0 8px 12px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}
                    onClick={() => handleSignup(action.id)}
                    disabled={joinedActions[action.id]}
                  >
                    {joinedActions[action.id] ? 'Înscris' : 'Înscrie-te'}
                  </button>
                  {signupMessages[action.id]?.message && (
                    <div style={{ color: signupMessages[action.id]?.type === 'success' ? '#2ecc71' : '#e74c3c', marginTop: 8 }}>
                      {signupMessages[action.id]?.message}
                    </div>
                  )}
                  {showMapFor === action.id && (
                    <ActionLocationMap lat={action.locationLat} lng={action.locationLng} zoom={10} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <JoinedActionsModal
        isOpen={showJoinedActionsModal}
        onClose={() => setShowJoinedActionsModal(false)}
      />
    </div>
  );
}

export default Volunteer;
