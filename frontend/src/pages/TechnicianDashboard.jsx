import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosConfig';

const TechnicianDashboard = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axiosInstance.get('/api/technician/dashboard');
                setMessage(response.data.message);
            } catch (error) {
                console.error('Error fetching technician dashboard data', error);
                setMessage('Error loading technician dashboard.');
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ color: '#f1c40f', marginBottom: '1rem' }}>Technician Portal</h1>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h2>{message}</h2>
                <p style={{ color: '#7f8c8d', marginTop: '1rem' }}>
                    Welcome to the specialized Technician interface. Here you can manage maintenance tasks and resolve IT tickets assigned to you.
                </p>
            </div>
        </div>
    );
};

export default TechnicianDashboard;
