import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PostedActionsModal.css';
import LocationAutocompleteMap from './LocationAutocompleteMap';

function PostedActionsModal({ isOpen, onClose }) {
    const [postedActions, setPostedActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('date');
    const [expandedAction, setExpandedAction] = useState(null);
    const [attendance, setAttendance] = useState({});
    const [saveStatus, setSaveStatus] = useState({});
    const [editingAction, setEditingAction] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

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
            const initialAttendance = {};
            response.data.forEach(action => {
                initialAttendance[action.id] = {};
                if (action.volunteers) {
                    action.volunteers.forEach(volunteer => {
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
                    const dateA = a.actionDate ? new Date(a.actionDate) : null;
                    const dateB = b.actionDate ? new Date(b.actionDate) : null;
                    if (!dateA || !dateB) return 0;
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

        const attendanceData = Object.keys(attendance[actionId] || {}).map(username => ({
            username: username,
            present: attendance[actionId][username]
        }));

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:8080/api/entity/actions/${actionId}/attendance`, attendanceData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSaveStatus(prev => ({ ...prev, [actionId]: 'saved' }));
        } catch (err) {
            console.error('Error saving attendance:', err);
            setSaveStatus(prev => ({ ...prev, [actionId]: 'error' }));
        }
    };

    const handleDeleteAction = async (actionId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/api/entity/actions/${actionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPostedActions(prev => prev.filter(action => action.id !== actionId));
            setDeleteConfirm(null);
        } catch (err) {
            console.error('Error deleting action:', err);
            alert('Eroare la ștergerea acțiunii');
        }
    };

    const startEditAction = (action) => {
        setEditingAction({
            id: action.id,
            title: action.title,
            description: action.description,
            location: action.location,
            locationLat: action.locationLat,
            locationLng: action.locationLng,
            category: action.category,
            requestedVolunteers: action.requestedVolunteers,
            actionDate: action.actionDate ? new Date(action.actionDate).toISOString().slice(0, 16) : '',
        });
    };

    const handleUpdateAction = async () => {
        if (!editingAction) return;

        try {
            const token = localStorage.getItem('token');
            const updateData = {
                title: editingAction.title,
                description: editingAction.description,
                location: editingAction.location,
                locationLat: editingAction.locationLat,
                locationLng: editingAction.locationLng,
                category: editingAction.category,
                requestedVolunteers: editingAction.requestedVolunteers,
                actionDate: editingAction.actionDate ? new Date(editingAction.actionDate).toISOString() : null,
                type: 'voluntariat',
                rewardItems: []
            };

            await axios.put(`http://localhost:8080/api/entity/actions/${editingAction.id}`, updateData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            await fetchPostedActions();
            setEditingAction(null);
        } catch (err) {
            console.error('Error updating action:', err);
            alert('Eroare la actualizarea acțiunii: ' + (err.response?.data || err.message));
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
                                        <div className="action-header">
                                            <h3>{action.title}</h3>
                                            <div className="action-buttons">
                                                <button 
                                                    className="edit-btn"
                                                    onClick={() => startEditAction(action)}
                                                    title="Editează acțiunea"
                                                >
                                                    ✏️ Editează
                                                </button>
                                                <button 
                                                    className="delete-btn"
                                                    onClick={() => setDeleteConfirm(action.id)}
                                                    title="Șterge acțiunea"
                                                >
                                                    🗑️ Șterge
                                                </button>
                                            </div>
                                        </div>
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

                {deleteConfirm && (
                    <div className="confirm-overlay">
                        <div className="confirm-dialog">
                            <h3>Confirmare ștergere</h3>
                            <p>Ești sigur că vrei să ștergi această acțiune? Acțiunea nu poate fi recuperată.</p>
                            <div className="confirm-buttons">
                                <button 
                                    className="confirm-yes"
                                    onClick={() => handleDeleteAction(deleteConfirm)}
                                >
                                    Da, șterge
                                </button>
                                <button 
                                    className="confirm-no"
                                    onClick={() => setDeleteConfirm(null)}
                                >
                                    Anulează
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {editingAction && (
                    <div className="edit-overlay">
                        <div className="edit-dialog">
                            <h3>Editează acțiunea</h3>
                            <div className="edit-form">
                                <label>
                                    Titlu:
                                    <input 
                                        type="text"
                                        value={editingAction.title}
                                        onChange={(e) => setEditingAction({...editingAction, title: e.target.value})}
                                    />
                                </label>
                                <label>
                                    Descriere:
                                    <textarea 
                                        value={editingAction.description}
                                        onChange={(e) => setEditingAction({...editingAction, description: e.target.value})}
                                    />
                                </label>
                                <label>
                                    Locație:
                                    <div style={{ marginTop: '8px' }}>
                                        <LocationAutocompleteMap
                                            value={editingAction.location}
                                            coords={editingAction.locationLat && editingAction.locationLng 
                                                ? [editingAction.locationLat, editingAction.locationLng] 
                                                : null}
                                            onLocationSelect={({ address, lat, lng }) => 
                                                setEditingAction({
                                                    ...editingAction, 
                                                    location: address, 
                                                    locationLat: lat, 
                                                    locationLng: lng
                                                })
                                            }
                                        />
                                    </div>
                                </label>
                                <label>
                                    Categorie:
                                    <select 
                                        value={editingAction.category}
                                        onChange={(e) => setEditingAction({...editingAction, category: e.target.value})}
                                    >
                                        <option value="mediu">Mediu</option>
                                        <option value="educatie">Educație</option>
                                        <option value="social">Social</option>
                                        <option value="sanatate">Sănătate</option>
                                        <option value="animale">Animale</option>
                                        <option value="altele">Altele</option>
                                    </select>
                                </label>
                                <label>
                                    Număr voluntari:
                                    <input 
                                        type="number"
                                        min="0"
                                        value={editingAction.requestedVolunteers}
                                        onChange={(e) => setEditingAction({...editingAction, requestedVolunteers: parseInt(e.target.value) || 0})}
                                    />
                                </label>
                                <label>
                                    Data și ora:
                                    <input 
                                        type="datetime-local"
                                        value={editingAction.actionDate}
                                        onChange={(e) => setEditingAction({...editingAction, actionDate: e.target.value})}
                                    />
                                </label>
                                <div className="edit-buttons">
                                    <button 
                                        className="save-btn"
                                        onClick={handleUpdateAction}
                                    >
                                        Salvează
                                    </button>
                                    <button 
                                        className="cancel-btn"
                                        onClick={() => setEditingAction(null)}
                                    >
                                        Anulează
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PostedActionsModal; 