import React from 'react';
import './RecommendationCard.css';

function RecommendationCard({ recommendations, insights, onActionClick }) {
    if (!recommendations || recommendations.length === 0) {
        return (
            <div className="recommendation-card">
                <div className="recommendation-header">
                    <h3>🎯 Recomandări pentru tine</h3>
                    <span className="ai-badge">AI</span>
                </div>
                <div className="no-recommendations">
                    <p>Nu avem încă suficiente date pentru recomandări personalizate.</p>
                    <p>Participă la câteva acțiuni pentru a primi sugestii mai bune!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="recommendation-card">
            <div className="recommendation-header">
                <h3>🎯 Recomandări pentru tine</h3>
                <span className="ai-badge">AI</span>
            </div>
            
            {insights && (
                <div className="user-insights">
                    <div className="insight-item">
                        <span className="insight-label">Nivel:</span>
                        <span className="insight-value">{insights.experienceLevel}</span>
                    </div>
                    <div className="insight-item">
                        <span className="insight-label">Categorie preferată:</span>
                        <span className="insight-value">{insights.preferredCategory}</span>
                    </div>
                    <div className="insight-item">
                        <span className="insight-label">Acțiuni completate:</span>
                        <span className="insight-value">{insights.totalActions}</span>
                    </div>
                </div>
            )}

            <div className="recommendations-list">
                {recommendations.map((action, index) => (
                    <div 
                        key={action.id} 
                        className="recommendation-item"
                        onClick={() => onActionClick && onActionClick(action)}
                    >
                        <div className="recommendation-rank">#{index + 1}</div>
                        <div className="recommendation-content">
                            <h4>{action.title}</h4>
                            <p className="recommendation-description">
                                {action.description?.substring(0, 100)}
                                {action.description?.length > 100 ? '...' : ''}
                            </p>
                            <div className="recommendation-meta">
                                <span className="category-tag">{action.category}</span>
                                <span className="volunteers-count">
                                    {action.joinedUserIds?.length || 0}/{action.requestedVolunteers} voluntari
                                </span>
                                {action.actionDate && (
                                    <span className="action-date">
                                        {new Date(action.actionDate).toLocaleDateString('ro-RO')}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="recommendation-score">
                            <div className="score-circle">
                                <span>{Math.round((action.joinedUserIds?.length || 0) / action.requestedVolunteers * 100)}%</span>
                            </div>
                            <small>Popularitate</small>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="recommendation-footer">
                <p>💡 Recomandările se actualizează pe baza activității tale</p>
            </div>
        </div>
    );
}

export default RecommendationCard;