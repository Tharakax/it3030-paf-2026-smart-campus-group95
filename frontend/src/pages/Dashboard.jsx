import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Test the secured endpoint
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/users/dashboard');
                setMessage(response.data.message);
            } catch (err) {
                console.error("Failed to fetch dashboard", err);
            }
        };
        fetchDashboard();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
                <h2>UniSync User Dashboard</h2>
                <div>
                    {user?.role === 'ADMIN' && (
                        <button onClick={() => navigate('/admin')} style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}>
                            Admin Panel
                        </button>
                    )}
                    <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Logout
                    </button>
                </div>
            </nav>

            <div style={{ marginTop: '2rem' }}>
                <h3>Welcome, {user?.email}</h3>
                <p>Your Role: <strong>{user?.role}</strong></p>

                <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                    <h4>Backend Message:</h4>
                    <p>{message || "Loading..."}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
