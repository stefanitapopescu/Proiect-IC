import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: 'Salut! 👋 Sunt asistentul virtual al VolunteerHub!\n\nTe pot ajuta cu găsirea acțiunilor de voluntariat, informații despre puncte și recompense, organizațiile noastre partenere și multe altele.\n\nCu ce te pot ajuta astăzi? 😊',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [quickQuestions, setQuickQuestions] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (messageText = inputMessage) => {
        if (!messageText.trim()) return;

        const userMessage = {
            type: 'user',
            text: messageText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:8080/api/chatbot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageText })
            });

            if (response.ok) {
                const data = await response.json();
                const botMessage = {
                    type: 'bot',
                    text: data.response,
                    timestamp: new Date()
                };

                setTimeout(() => {
                    setMessages(prev => [...prev, botMessage]);
                    setIsTyping(false);
                }, 1000);
            } else {
                throw new Error('Eroare la comunicarea cu serverul');
            }
        } catch (error) {
            console.error('Eroare chatbot:', error);
            const errorMessage = {
                type: 'bot',
                text: 'Îmi pare rău, am întâmpinat o problemă tehnică. Te rog să încerci din nou.',
                timestamp: new Date()
            };

            setTimeout(() => {
                setMessages(prev => [...prev, errorMessage]);
                setIsTyping(false);
            }, 1000);
        }
    };

    /* DEZACTIVAT - Nu mai folosim întrebări rapide
    const handleQuickQuestion = (question) => {
        sendMessage(question.text);
    };
    */

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString('ro-RO', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="chatbot-container">
            {/* Buton pentru deschiderea chatbot-ului */}
            <button
                className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Deschide chatbot"
            >
                Ajutor Virtual
            </button>

            {/* Fereastra chatbot-ului */}
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar">🤖</div>
                            <div>
                                <h3>Asistent Virtual</h3>
                                <span className="status">Online</span>
                            </div>
                        </div>
                        <button
                            className="chatbot-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Închide chatbot"
                        >
                            ×
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.type}`}>
                                <div className="message-content">
                                    <p>{message.text}</p>
                                    <span className="message-time">
                                        {formatTime(message.timestamp)}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="message bot">
                                <div className="message-content">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Întrebări rapide - DEZACTIVATE
                    {quickQuestions.length > 0 && messages.length <= 1 && (
                        <div className="quick-questions">
                            <p>Întrebări frecvente:</p>
                            <div className="quick-questions-grid">
                                {quickQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        className="quick-question-btn"
                                        onClick={() => handleQuickQuestion(question)}
                                    >
                                        {question.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    */}

                    <div className="chatbot-input">
                        <div className="input-container">
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Scrie mesajul tău aici..."
                                rows="1"
                                disabled={isTyping}
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={!inputMessage.trim() || isTyping}
                                className="send-button"
                                aria-label="Trimite mesaj"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot; 