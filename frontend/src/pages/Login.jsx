import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const { user } = useContext(AuthContext);

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleGoogleLogin = () => {
        // Redirect to Spring Boot OAuth2 endpoint
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>UniSync</h1>
                <p>Smart Campus Operations Hub</p>

                <button className="google-btn" onClick={handleGoogleLogin}>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                        alt="Google Logo"
                    />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
