import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/auth/reset-password-request', { email });
            setMessage('Dacă adresa există, vei primi un email cu un link de resetare a parolei.');
        } catch (err) {
            setError('A apărut o eroare. Încearcă din nou.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Resetare parolă</h1>
                        <p>Introdu adresa de email asociată contului tău. Vei primi un link de resetare dacă există un cont cu acest email.</p>
                    </div>
                    {message && <div className="auth-success">{message}</div>}
                    {error && <div className="auth-error">{error}</div>}
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                placeholder="Introdu adresa de email"
                            />
                        </div>
                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? 'Se procesează...' : 'Trimite link de resetare'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword; 