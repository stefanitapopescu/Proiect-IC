import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    const token = localStorage.getItem('token') || Cookies.get('token');
    const userType = localStorage.getItem('userType') || Cookies.get('userType');

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
