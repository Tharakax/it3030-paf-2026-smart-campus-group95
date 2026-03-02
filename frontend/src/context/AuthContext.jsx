import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Ensure token isn't expired
                const isExpired = decoded.exp * 1000 < Date.now();
                if (isExpired) {
                    logout();
                } else {
                    setUser({
                        id: decoded.id,
                        email: decoded.sub,
                        role: decoded.role // e.g. "USER" or "ADMIN"
                    });
                    localStorage.setItem('token', token);
                }
            } catch (error) {
                console.error("Invalid token", error);
                logout();
            }
        } else {
            setUser(null);
            localStorage.removeItem('token');
        }
        setLoading(false);
    }, [token]);

    const login = (newToken) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading ? children : <div>Loading session...</div>}
        </AuthContext.Provider>
    );
};
