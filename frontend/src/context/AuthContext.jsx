import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import API from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
    
console.log(token);

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
                        name: decoded.name,
                        picture: decoded.picture,
                        role: decoded.role 
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
        try {
            const decoded = jwtDecode(newToken);
            return decoded;
        } catch (error) {
            console.error("Failed to decode token on login", error);
            return null;
        }
    };

    const logout = async () => {
        try {
            await API.post('/auth/logout');
        } catch (error) {
            console.error("Failed to log logout on server", error);
        }
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, login, logout, loading }}>
            {!loading ? children : <div>Loading session...</div>}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
