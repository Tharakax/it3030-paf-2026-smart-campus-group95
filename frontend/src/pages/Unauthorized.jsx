import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
            <h1 style={{ color: '#e74c3c', fontSize: '4rem', margin: 0 }}>403</h1>
            <h2>Access Denied</h2>
            <p style={{ color: '#7f8c8d' }}>You do not have permission to view this page.</p>

            <button
                onClick={() => navigate('/dashboard')}
                style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                Return to Dashboard
            </button>
        </div>
    );
};

export default Unauthorized;
