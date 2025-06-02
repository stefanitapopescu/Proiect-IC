import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JoinedActionsModal.css';

function JoinedActionsModal({ isOpen, onClose }) {
    const [joinedActions, setJoinedActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('date'); // 'date', 'title', 'timeLeft'

    useEffect(() => {
        if (isOpen) {
            fetchJoinedActions();
        }
    }, [isOpen]);

    const fetchJoinedActions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/volunteer/joined-actions', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setJoinedActions(response.data);
            setError(null);
        } catch (err) {
            setError('Eroare la încărcarea acțiunilor înscrise');
            console.error('Error fetching joined actions:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateTimeUntil = (actionDate) => {
        if (!actionDate) return 'Data nespecificată';

        const now = new Date();
        const actionDateTime = new Date(actionDate);
        const diffTime = actionDateTime - now;

        if (diffTime < 0) return 'Acțiunea a început deja';

        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return `${days} zile și ${hours} ore`;
        } else if (hours > 0) {
            return `${hours} ore și ${minutes} minute`;
        } else {
            return `${minutes} minute`;
        }
    };

    const getTimeUntilInMinutes = (actionDate) => {
        if (!actionDate) return Infinity;
        const now = new Date();
        const actionDateTime = new Date(actionDate);
        return (actionDateTime - now) / (1000 * 60);
    };

    const sortActions = (actions) => {
        return [...actions].sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    const dateA = a.actionDate ? new Date(a.actionDate) : null;
                    const dateB = b.actionDate ? new Date(b.actionDate) : null;
                    if (!dateA || !dateB) return 0;
                    return dateA - dateB;
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'timeLeft':
                    return getTimeUntilInMinutes(a.actionDate) - getTimeUntilInMinutes(b.actionDate);
                default:
                    return 0;
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Acțiunile tale înscrise</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div className="loading">Se încarcă...</div>
                    ) : error ? (
                        <div className="error">{error}</div>
                    ) : joinedActions.length === 0 ? (
                        <div className="no-actions">Nu te-ai înscris la nicio acțiune încă.</div>
                    ) : (
                        <>
                            <div className="sort-options">
                                <button
                                    className={sortBy === 'date' ? 'active' : ''}
                                    onClick={() => setSortBy('date')}
                                >
                                    După dată
                                </button>
                                <button
                                    className={sortBy === 'title' ? 'active' : ''}
                                    onClick={() => setSortBy('title')}
                                >
                                    După titlu
                                </button>
                                <button
                                    className={sortBy === 'timeLeft' ? 'active' : ''}
                                    onClick={() => setSortBy('timeLeft')}
                                >
                                    După timp rămas
                                </button>
                            </div>
                            <div className="actions-list">
                                {sortActions(joinedActions).map(action => (
                                    <div key={action.id} className="action-item">
                                        <h3>{action.title}</h3>
                                        <p className="description">{action.description}</p>
                                        <div className="action-details">
                                            <p><strong>Data:</strong> {action.date || 'Nespecificată'}</p>
                                            <p><strong>Locație:</strong> {action.location}</p>
                                            <p><strong>Timp rămas:</strong> {calculateTimeUntil(action.actionDate)}</p>
                                            {'attended' in action && (
                                                <p>
                                                    <strong>Prezență:</strong> {' '}
                                                    {action.attended ? (
                                                        <span style={{ color: 'green', fontWeight: 'bold' }}>Confirmată</span>
                                                    ) : (
                                                        <span style={{ color: 'orange', fontWeight: 'bold' }}>În așteptare / Neconformată</span>
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default JoinedActionsModal; 