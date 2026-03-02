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
            const decodedToken = login(token);
            if (decodedToken) {
                const role = decodedToken.role;
                if (role === 'ADMIN') {
                    navigate('/admin');
                } else if (role === 'TECHNICIAN') {
                    navigate('/technician');
                } else {
                    navigate('/home');
                }
            } else {
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [location, login, navigate]);

    return <div>Logging you in...</div>;
};

export default OAuth2RedirectHandler;
