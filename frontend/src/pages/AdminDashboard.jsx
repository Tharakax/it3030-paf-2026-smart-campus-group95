import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const response = await api.get('/admin/dashboard');
                setMessage(response.data.message);
            } catch (err) {
                console.error("Failed to fetch admin dashboard", err);
            }
        };
        fetchAdminData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#fdfbfb', minHeight: '100vh' }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #3498db', paddingBottom: '1rem' }}>
                <h2 style={{ color: '#2980b9' }}>🔒 UniSync Admin Portal</h2>
                <div>
                    <button onClick={() => navigate('/dashboard')} style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}>
                        Back to User Dashboard
                    </button>
                    <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Logout
                    </button>
                </div>
            </nav>

            <div style={{ marginTop: '2rem' }}>
                <h3>Administrator: {user?.email}</h3>

                <div style={{ marginTop: '2rem', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h4 style={{ color: '#e67e22' }}>Secure Admin Data:</h4>
                    <p>{message || "Loading secure data..."}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
