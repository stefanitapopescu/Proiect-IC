// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import Cookies from 'js-cookie';

// Iconițe FontAwesome pentru ochi
const EyeIcon = ({ open }) => (
  <i className={open ? 'fas fa-eye' : 'fas fa-eye-slash'} style={{ cursor: 'pointer', fontSize: '1.2rem', color: '#888' }}></i>
);

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // dacă venim de pe /reset-password cu mesaj de succes
    if (location.state && location.state.message) {
      setSuccess(location.state.message);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
  }, [location]);

  const validateEmail = (email) => {
    // Acceptă username fără @ sau email de gmail/yahoo
    if (!email.includes('@')) {
      setEmailError('');
      setEmailSuccess('');
      return true;
    }
    const re = /^[^\s@]+@(gmail\.com|yahoo\.com)$/i;
    if (!re.test(email)) {
      setEmailError('Email-ul trebuie să se termine cu @gmail.com sau @yahoo.com');
      setEmailSuccess('');
      return false;
    }
    setEmailError('');
    setEmailSuccess('Email valid!');
    return true;
  };

  // Validare parolă: minim 6 caractere, o cifră, o literă mare, o literă mică, un semn de punctuație
  const passwordCriteria = [
    { label: 'Cel puțin 6 caractere', test: pwd => pwd.length >= 6 },
    { label: 'O literă mare', test: pwd => /[A-Z]/.test(pwd) },
    { label: 'O literă mică', test: pwd => /[a-z]/.test(pwd) },
    { label: 'O cifră', test: pwd => /\d/.test(pwd) },
    { label: 'Un semn de punctuație', test: pwd => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd) },
  ];
  const validatePassword = (pwd) => {
    const allValid = passwordCriteria.every(c => c.test(pwd));
    if (!allValid) {
      setPasswordError('Parola nu respectă toate cerințele.');
      setPasswordSuccess('');
      return false;
    }
    setPasswordError('');
    setPasswordSuccess('Parola este validă!');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));

    if (name === 'email') {
      validateEmail(value);
    }
    if (name === 'password') {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailValid = validateEmail(credentials.email);
    const pwdValid = validatePassword(credentials.password);

    if (!emailValid || !pwdValid) {
      return;
    }

    setLoading(true);
    const payload = { password: credentials.password };
    if (credentials.email.includes('@')) {
      payload.email = credentials.email;
    } else {
      payload.username = credentials.email;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        payload
      );
      if (response.data?.token) {
        if (rememberMe) {
          Cookies.set('token', response.data.token, { expires: 7 });
          Cookies.set('userType', response.data.userType, { expires: 7 });
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userType', response.data.userType);
        } else {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userType', response.data.userType);
        }
        navigate(response.data.userType === 'volunteer' ? '/volunteer' : '/entity');
      } else {
        setError('Răspuns nevalid de la server. Încearcă din nou.');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Credențiale invalide.');
      } else {
        setError(err.response?.data?.message || 'Eroare la autentificare.');
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
              {emailError && <div className="field-error">{emailError}</div>}
              {emailSuccess && <div className="field-success" style={{ color: '#2ecc71', marginTop: 4 }}>{emailSuccess}</div>}
            </div>

            <div className="form-group remember-me-group">
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
              </label>
              <label htmlFor="rememberMe" style={{ fontWeight: 400, fontSize: 15, cursor: 'pointer', margin: 0 }}>
                Ține-mă minte
              </label>
            </div>

            <div className="form-group password-wrapper" style={{ position: 'relative' }}>
              <label htmlFor="password">Parolă</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  placeholder="Introdu parola"
                  style={{ paddingRight: '38px' }}
                />
                <span
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                  onClick={() => setShowPassword(s => !s)}
                  aria-label={showPassword ? 'Ascunde parola' : 'Arată parola'}
                  tabIndex={0}
                  role="button"
                >
                  <EyeIcon open={showPassword} />
                </span>
              </div>
              {/* Bulinuțe colorate pentru validare parolă */}
              <ul className="password-criteria-list">
                {passwordCriteria.map((c, idx) => {
                  const valid = c.test(credentials.password);
                  return (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', color: valid ? '#2ecc71' : '#e74c3c', fontWeight: valid ? 600 : 400 }}>
                      <span style={{
                        display: 'inline-block',
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: valid ? '#2ecc71' : '#e74c3c',
                        marginRight: 8,
                        border: '1px solid #ccc',
                      }}></span>
                      {c.label}
                    </li>
                  );
                })}
              </ul>
              {passwordError && <div className="field-error">{passwordError}</div>}
              {passwordSuccess && <div className="field-success" style={{ color: '#2ecc71', marginTop: 4 }}>{passwordSuccess}</div>}
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
            <p>
              Nu ai un cont? <Link to="/signup">Înregistrează-te</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
