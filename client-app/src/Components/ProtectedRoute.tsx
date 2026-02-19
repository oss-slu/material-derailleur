// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Props type for the ProtectedRoute component.
 * @interface Props
 * @property {JSX.Element} children - The component or content that should be rendered if the user has the correct role.
 * @property {'ADMIN' | 'DONOR' | 'TIER_ONE | 'TIER_TWO' | 'TIER_THREE'} allowedRole - The role that is allowed to access the protected route.
 */
interface Props {
    children: JSX.Element;
    allowedRole:  'ADMIN' | 'DONOR' | 'TIER_ONE' | 'TIER_TWO' | 'TIER_THREE';
}

/**
 * ProtectedRoute component that restricts access based on the user's role.
 * If the user does not have a valid token or their role does not match the allowed role, they are redirected.
 * @component
 * @param {Props} props - The properties passed to the component.
 * @returns {JSX.Element} A JSX element to either navigate or render the children.
 */
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
