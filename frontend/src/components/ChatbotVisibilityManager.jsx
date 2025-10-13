import React from 'react';
import { useLocation } from 'react-router-dom';
import Chatbot from './Chatbot';

const ChatbotVisibilityManager = () => {
    const location = useLocation();
    const userType = localStorage.getItem('userType');

    const volunteerPaths = ['/volunteer-home', '/shop', '/volunteer', '/wallet'];

    const shouldShowChatbot = userType === 'volunteer' && volunteerPaths.includes(location.pathname);

    return (
        <>
            {shouldShowChatbot && <Chatbot />}
        </>
    );
};

export default ChatbotVisibilityManager; 