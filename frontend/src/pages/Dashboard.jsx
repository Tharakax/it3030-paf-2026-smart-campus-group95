import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import DashboardSidebar from '../components/Dashboard/DashboardSidebar';

// Import View Components
import Overview from '../components/Dashboard/Views/Overview';
import Bookings from '../components/Dashboard/Views/Bookings';
import Tickets from '../components/Dashboard/Views/Tickets';
import Profile from '../components/Dashboard/Views/Profile';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/users/dashboard');
                setMessage(response.data.message);
                setTimeout(() => setIsLoading(false), 500); // Small delay for UX feel
            } catch (err) {
                console.error("Failed to fetch dashboard", err);
                setIsLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-[#f8fafc]">
            {/* Sidebar */}
            <DashboardSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                user={user} 
                handleLogout={handleLogout}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            {/* Content Area */}
            <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} p-4 md:p-10 pb-20`}>
                <div className="max-w-6xl mx-auto">
                    {/* Render current tab/tag */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Hub...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'overview' && <Overview user={user} message={message} />}
                            {activeTab === 'bookings' && <Bookings />}
                            {activeTab === 'tickets' && <Tickets />}
                            {activeTab === 'profile' && <Profile user={user} />}
                            {activeTab === 'settings' && (
                                <div className="p-20 text-center text-slate-400 font-medium italic animate-in fade-in duration-500">
                                    Settings module under development
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
