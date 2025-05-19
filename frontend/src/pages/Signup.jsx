import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

// Iconițe FontAwesome pentru ochi
const EyeIcon = ({ open }) => (
  <i className={open ? 'fas fa-eye' : 'fas fa-eye-slash'} style={{ cursor: 'pointer', fontSize: '1.2rem', color: '#888' }}></i>
);

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

  // Validare parolă: minim 6 caractere, o cifră, o literă mare, o literă mică, un semn de punctuație
  const passwordCriteria = [
    { label: 'Cel puțin 6 caractere', test: pwd => pwd.length >= 6 },
    { label: 'O literă mare', test: pwd => /[A-Z]/.test(pwd) },
    { label: 'O literă mică', test: pwd => /[a-z]/.test(pwd) },
    { label: 'O cifră', test: pwd => /\d/.test(pwd) },
    { label: 'Un semn de punctuație', test: pwd => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd) },
  ];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [confirmSuccess, setConfirmSuccess] = useState('');

  const validateEmail = (email) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'email') {
      validateEmail(value);
    }
    if (name === 'password') {
      const allValid = passwordCriteria.every(c => c.test(value));
      setPasswordError(allValid ? '' : 'Parola nu respectă toate cerințele.');
      if (formData.confirmPassword && value === formData.confirmPassword) {
        setConfirmSuccess('Parolele coincid!');
        setConfirmError('');
      } else if (formData.confirmPassword) {
        setConfirmSuccess('');
        setConfirmError('Parolele nu coincid.');
      } else {
        setConfirmSuccess('');
      }
    }
    if (name === 'confirmPassword') {
      if (value === formData.password) {
        setConfirmSuccess('Parolele coincid!');
        setConfirmError('');
      } else {
        setConfirmSuccess('');
        setConfirmError('Parolele nu coincid.');
      }
    }
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
      setConfirmError('Parolele nu coincid.');
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
              {emailError && <div className="field-error">{emailError}</div>}
              {emailSuccess && <div className="field-success" style={{ color: '#2ecc71', marginTop: 4 }}>{emailSuccess}</div>}
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
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Creează o parolă"
                  minLength="6"
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
                  const valid = c.test(formData.password);
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
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmă parola</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirmă parola"
                  minLength="6"
                  style={{ paddingRight: '38px' }}
                />
                <span
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                  onClick={() => setShowConfirmPassword(s => !s)}
                  aria-label={showConfirmPassword ? 'Ascunde parola' : 'Arată parola'}
                  tabIndex={0}
                  role="button"
                >
                  <EyeIcon open={showConfirmPassword} />
                </span>
              </div>
              {confirmError && <div className="field-error">{confirmError}</div>}
              {confirmSuccess && <div className="field-success" style={{ color: '#2ecc71', marginTop: 4 }}>{confirmSuccess}</div>}
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
