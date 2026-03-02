import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const OAuth2RedirectHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            login(token);
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    }, [location, login, navigate]);

    return <div>Logging you in...</div>;
};

export default OAuth2RedirectHandler;
