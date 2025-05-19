import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

// Iconițe FontAwesome pentru ochi
const EyeIcon = ({ open }) => (
    <i className={open ? 'fas fa-eye' : 'fas fa-eye-slash'} style={{ cursor: 'pointer', fontSize: '1.2rem', color: '#888' }}></i>
);

const passwordCriteria = [
    { label: 'Cel puțin 6 caractere', test: pwd => pwd.length >= 6 },
    { label: 'O literă mare', test: pwd => /[A-Z]/.test(pwd) },
    { label: 'O literă mică', test: pwd => /[a-z]/.test(pwd) },
    { label: 'O cifră', test: pwd => /\d/.test(pwd) },
    { label: 'Un semn de punctuație', test: pwd => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd) },
];

function ResetPasswordConfirm() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChangePassword = (e) => {
        const value = e.target.value;
        setPassword(value);
        const allValid = passwordCriteria.every(c => c.test(value));
        setPasswordError(allValid ? '' : 'Parola nu respectă toate cerințele.');
        setConfirmError(confirmPassword && value !== confirmPassword ? 'Parolele nu coincid.' : '');
    };
    const handleChangeConfirm = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setConfirmError(value !== password ? 'Parolele nu coincid.' : '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        if (!token) {
            setError('Token invalid sau lipsă. Folosește linkul primit pe email.');
            return;
        }
        if (password !== confirmPassword) {
            setConfirmError('Parolele nu coincid.');
            return;
        }
        if (!passwordCriteria.every(c => c.test(password))) {
            setPasswordError('Parola nu respectă toate cerințele.');
            return;
        }
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/auth/reset-password', { token, newPassword: password });
            setMessage('Parola a fost resetată cu succes! Te poți autentifica cu noua parolă.');
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setError('Resetarea parolei a eșuat. Linkul poate fi expirat sau invalid.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Setează o parolă nouă</h1>
                        <p>Introdu noua parolă pentru contul tău.</p>
                    </div>
                    {message && <div className="auth-success">{message}</div>}
                    {error && <div className="auth-error">{error}</div>}
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group password-wrapper" style={{ position: 'relative' }}>
                            <label htmlFor="password">Parolă nouă</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={handleChangePassword}
                                    required
                                    placeholder="Introdu parola nouă"
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
                            <ul className="password-criteria-list">
                                {passwordCriteria.map((c, idx) => {
                                    const valid = c.test(password);
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
                        <div className="form-group password-wrapper" style={{ position: 'relative' }}>
                            <label htmlFor="confirmPassword">Confirmă parola nouă</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handleChangeConfirm}
                                    required
                                    placeholder="Confirmă parola nouă"
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
                        </div>
                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? 'Se procesează...' : 'Resetează parola'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordConfirm; 