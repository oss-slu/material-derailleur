// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
    children: JSX.Element;
    allowedRole: 'ADMIN' | 'DONOR';
}

const ProtectedRoute = ({ children, allowedRole }: Props) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.role !== allowedRole) {
            return <Navigate to="/" />;
        }
        return children;
    } catch (error) {
        console.error('Token decode error:', error);
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;
