import React from 'react';
import { useLocation } from 'react-router-dom';
import Chatbot from './Chatbot';

const ChatbotVisibilityManager = () => {
    const location = useLocation();
    const userType = localStorage.getItem('userType');

    // Define volunteer-specific paths
    const volunteerPaths = ['/volunteer-home', '/shop', '/volunteer', '/wallet'];

    // Check if user is a volunteer AND is on a volunteer-specific page
    const shouldShowChatbot = userType === 'volunteer' && volunteerPaths.includes(location.pathname);

    return (
        <>
            {shouldShowChatbot && <Chatbot />}
        </>
    );
};

export default ChatbotVisibilityManager; 