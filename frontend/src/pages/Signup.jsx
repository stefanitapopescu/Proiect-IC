import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; 
function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    userType: 'volunteer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'email' && !formData.username) {
      setFormData(prev => ({
        ...prev,
        username: value.split('@')[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Parolele nu se potrivesc');
      setLoading(false);
      return;
    }
    
    if (!formData.username) {
      setError('Este necesar un nume de utilizator');
      setLoading(false);
      return;
    }

    const apiData = {
      name: formData.name,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      userType: formData.userType
    };

    try {
      await axios.post('http://localhost:8080/api/auth/register', apiData);
      navigate('/login', { state: { message: 'Cont creat cu succes! Te poți autentifica acum.' } });
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.status === 409) {
        if (error.response.data && error.response.data.includes('Email')) {
          setError('Această adresă de email este deja înregistrată. Te rugăm să folosești o altă adresă.');
        } else if (error.response.data && error.response.data.includes('Username')) {
          setError('Acest nume de utilizator este deja folosit. Te rugăm să alegi altul.');
        } else {
          setError('Acest cont există deja. Te rugăm să te autentifici sau să alegi alte date.');
        }
      } else {
        setError(error.response?.data?.message || 'Eroare la înregistrare. Încearcă din nou.');
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
            <h1>Creează un cont</h1>
            <p>Completează formularul pentru a te alătura comunității noastre</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Nume complet</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Introdu numele tău complet"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Introdu adresa de email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="username">Nume de utilizator</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Alege un nume de utilizator"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Parolă</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Creează o parolă"
                minLength="6"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmă parola</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirmă parola"
                minLength="6"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="userType">Tip utilizator</label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                required
              >
                <option value="volunteer">Voluntar</option>
                <option value="entity">Entitate beneficiară</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Se procesează...' : 'Creează cont'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Ai deja un cont? <Link to="/login">Autentifică-te</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
