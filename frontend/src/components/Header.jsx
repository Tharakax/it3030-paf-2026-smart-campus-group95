import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <header className="app-header">
            <div className="header-brand" onClick={() => navigate('/home')}>
                <h2>UniSync <span className="brand-subtitle">Hub</span></h2>
            </div>

            <nav className="header-nav">
                <Link to="/bookings" className="nav-link">Bookings</Link>
                <Link to="/tickets" className="nav-link">Tickets</Link>

                {user.role === 'ADMIN' && (
                    <Link to="/admin" className="nav-link admin-link">Admin Panel</Link>
                )}
                {user.role === 'TECHNICIAN' && (
                    <Link to="/technician" className="nav-link tech-link">Tech Portal</Link>
                )}
            </nav>

            <div className="header-actions">
                <div className="notification-icon">
                    🔔
                    <span className="badge">3</span>
                </div>
                <div className="user-profile">
                    <span className="user-email">{user.email}</span>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </header>
    );
};

export default Header;
