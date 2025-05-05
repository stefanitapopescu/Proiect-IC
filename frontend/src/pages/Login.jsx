import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.message) {
      setSuccess(location.state.message);
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    console.log('Existing tokens cleared on login page load');
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    console.log('Attempting login with:', credentials.email);

    const payload = {
      password: credentials.password
    };

    if (credentials.email.includes('@')) {
      payload.email = credentials.email;
      console.log('Using email login');
    } else {
      payload.username = credentials.email;
      console.log('Using username login');
    }

    try {
      console.log('Sending login request to server');
      const response = await axios.post('http://localhost:8080/api/auth/login', payload);
      console.log('Login response received:', response.data);
      
      if (response.data && response.data.token) {
        console.log('Token received, userType:', response.data.userType);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', response.data.userType);
        
        try {
          const payload = response.data.token.split('.')[1];
          const decodedPayload = atob(payload);
          const tokenData = JSON.parse(decodedPayload);
          console.log('Token payload:', tokenData);
          console.log('Token subject:', tokenData.sub);
          console.log('Token expiration:', new Date(tokenData.exp * 1000).toLocaleString());
        } catch (e) {
          console.error('Error decoding token:', e);
        }
        
        if (response.data.userType === 'volunteer') {
          console.log('Navigating to volunteer page');
          navigate('/volunteer');
        } else {
          console.log('Navigating to entity page');
          navigate('/entity');
        }
      } else {
        setError('Răspuns nevalid de la server. Te rugăm să încerci din nou.');
        console.error('Invalid server response:', response.data);
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        
        if (error.response.status === 401) {
          setError('Credențiale invalide. Verifică numele utilizator/email și parola.');
        } else if (error.response.data) {
          setError(error.response.data.message || error.response.data);
        } else {
          setError('Eroare la autentificare. Verifică datele și încearcă din nou.');
        }
      } else if (error.request) {
        console.error('No response received. Request:', error.request);
        setError('Serverul nu răspunde. Verifică conexiunea la internet.');
      } else {
        console.error('Error setting up request:', error.message);
        setError('Eroare la autentificare. Te rugăm să încerci din nou.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Autentificare</h1>
            <p>Bine ai revenit! Te rugăm să te autentifici pentru a continua.</p>
          </div>
          
          {success && <div className="auth-success">{success}</div>}
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email sau nume utilizator</label>
              <input
                type="text"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                placeholder="Introdu email sau nume utilizator"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Parolă</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="Introdu parola"
              />
              <div className="forgot-password">
                <Link to="/reset-password">Ai uitat parola?</Link>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Se procesează...' : 'Autentificare'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Nu ai un cont? <Link to="/signup">Înregistrează-te</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;   
