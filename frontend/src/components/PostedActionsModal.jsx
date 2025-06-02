import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PostedActionsModal.css';

function PostedActionsModal({ isOpen, onClose }) {
    const [postedActions, setPostedActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('date'); // 'date', 'title', 'volunteers'
    const [expandedAction, setExpandedAction] = useState(null);
    // Use actionId and then username for nested state
    const [attendance, setAttendance] = useState({}); // { actionId: { volunteerUsername: true/false, ... }, ... }
    const [saveStatus, setSaveStatus] = useState({}); // { actionId: 'saving'/'saved'/'error' }

    useEffect(() => {
        if (isOpen) {
            fetchPostedActions();
        }
    }, [isOpen]);

    const fetchPostedActions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/entity/posted-actions', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Initialize attendance state when fetching actions
            const initialAttendance = {};
            response.data.forEach(action => {
                initialAttendance[action.id] = {};
                if (action.volunteers) {
                    action.volunteers.forEach(volunteer => {
                        // Assuming attendance status is returned from backend
                        initialAttendance[action.id][volunteer.username] = volunteer.present || false;
                    });
                }
            });
            setAttendance(initialAttendance);
            setPostedActions(response.data);
            setError(null);
        } catch (err) {
            setError('Eroare la încărcarea acțiunilor postate');
            console.error('Error fetching posted actions:', err);
        } finally {
            setLoading(false);
        }
    };

    const sortActions = (actions) => {
        return [...actions].sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    // Parse dates carefully, handle potential null/undefined
                    const dateA = a.actionDate ? new Date(a.actionDate) : null;
                    const dateB = b.actionDate ? new Date(b.actionDate) : null;
                    if (!dateA || !dateB) return 0; // Handle cases with missing dates
                    return dateA - dateB;
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'volunteers':
                    return b.allocatedVolunteers - a.allocatedVolunteers;
                default:
                    return 0;
            }
        });
    };

    const toggleVolunteers = (actionId) => {
        setExpandedAction(expandedAction === actionId ? null : actionId);
    };

    const handleAttendanceChange = (actionId, volunteerUsername, isPresent) => {
        setAttendance(prev => ({
            ...prev,
            [actionId]: {
                ...prev[actionId],
                [volunteerUsername]: isPresent
            }
        }));
    };

    const handleSaveAttendance = async (actionId) => {
        setSaveStatus(prev => ({ ...prev, [actionId]: 'saving' }));

        // Construct the attendance data in the correct format (List<VolunteerAttendanceDTO>)
        const attendanceData = Object.keys(attendance[actionId] || {}).map(username => ({
            username: username,
            present: attendance[actionId][username]
        }));

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:8080/api/entity/actions/${actionId}/attendance`, attendanceData, { // Send attendanceData directly
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSaveStatus(prev => ({ ...prev, [actionId]: 'saved' }));
            // Optionally refetch actions to update displayed status if needed
            // fetchPostedActions();
        } catch (err) {
            console.error('Error saving attendance:', err);
            setSaveStatus(prev => ({ ...prev, [actionId]: 'error' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Acțiunile tale postate</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div className="loading">Se încarcă...</div>
                    ) : error ? (
                        <div className="error">{error}</div>
                    ) : postedActions.length === 0 ? (
                        <div className="no-actions">Nu ai postat nicio acțiune încă.</div>
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
                                    className={sortBy === 'volunteers' ? 'active' : ''}
                                    onClick={() => setSortBy('volunteers')}
                                >
                                    După număr voluntari
                                </button>
                            </div>
                            <div className="actions-list">
                                {sortActions(postedActions).map(action => (
                                    <div key={action.id} className="action-item">
                                        <h3>{action.title}</h3>
                                        <p className="description">{action.description}</p>
                                        <div className="action-details">
                                            <p><strong>Data:</strong> {new Date(action.actionDate).toLocaleString()}</p>
                                            <p><strong>Locație:</strong> {action.location}</p>
                                            <p><strong>Voluntari înscriși:</strong> {action.allocatedVolunteers} / {action.requestedVolunteers}</p>
                                            <p><strong>Categorie:</strong> {action.category}</p>

                                            {action.allocatedVolunteers > 0 && (
                                                <div className="volunteers-section">
                                                    <button
                                                        className="toggle-volunteers-btn"
                                                        onClick={() => toggleVolunteers(action.id)}
                                                    >
                                                        {expandedAction === action.id ? 'Ascunde voluntarii' : 'Arată voluntarii'}
                                                    </button>

                                                    {expandedAction === action.id && (
                                                        <div className="volunteers-list">
                                                            <h4>Voluntari înscriși:</h4>
                                                            {action.volunteers && action.volunteers.length > 0 ? (
                                                                <ul>
                                                                    {action.volunteers.map((volunteer, index) => (
                                                                        <li key={index} className="volunteer-item">
                                                                            <div>
                                                                                <p><strong>Nume:</strong> {volunteer.name}</p>
                                                                                <p><strong>Email:</strong> {volunteer.email}</p>
                                                                                <p><strong>Telefon:</strong> {volunteer.phone || 'Nespecificat'}</p>
                                                                            </div>
                                                                            <div className="attendance-checkbox">
                                                                                <label>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={!!(attendance[action.id]?.[volunteer.username])}
                                                                                        onChange={(e) => handleAttendanceChange(action.id, volunteer.username, e.target.checked)}
                                                                                    />
                                                                                    Prezent
                                                                                </label>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <p>Nu există voluntari înscriși încă.</p>
                                                            )}

                                                            <button
                                                                className="save-attendance-btn"
                                                                onClick={() => handleSaveAttendance(action.id)}
                                                                disabled={saveStatus[action.id] === 'saving'}
                                                            >
                                                                {saveStatus[action.id] === 'saving' ? 'Se salvează...' : 'Salvează prezența'}
                                                            </button>
                                                            {saveStatus[action.id] === 'saved' && <span className="save-success">Prezență salvată!</span>}
                                                            {saveStatus[action.id] === 'error' && <span className="save-error">Eroare la salvare!</span>}
                                                        </div>
                                                    )}
                                                </div>
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

export default PostedActionsModal; 