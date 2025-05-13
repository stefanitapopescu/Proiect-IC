import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    console.log('ProtectedRoute:', { token, userType, allowedRoles, location });

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userType)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
