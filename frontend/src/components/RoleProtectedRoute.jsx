import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RoleProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default RoleProtectedRoute;
