import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Welcome to UniSync, <span className="highlight">{user?.name}</span>!</h1>
                <p className="subtitle">Your Smart Campus Operations Hub</p>
            </div>

            <div className="services-grid">
                <div className="service-card">
                    <div className="card-icon">📅</div>
                    <h3>My Bookings</h3>
                    <p>Manage your facility and resource reservations seamlessly.</p>
                    <button className="action-btn">View Bookings</button>
                </div>

                <div className="service-card">
                    <div className="card-icon">🎫</div>
                    <h3>My Tickets</h3>
                    <p>Track your IT and maintenance support requests.</p>
                    <button className="action-btn">View Tickets</button>
                </div>

                <div className="service-card">
                    <div className="card-icon">📢</div>
                    <h3>Announcements</h3>
                    <p>Stay updated with the latest campus news and alerts.</p>
                    <button className="action-btn">Read More</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
