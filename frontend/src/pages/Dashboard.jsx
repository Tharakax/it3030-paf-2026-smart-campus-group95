import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import DashboardSidebar from '../components/Dashboard/DashboardSidebar';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import { useLocation } from 'react-router-dom';

// Import View Components
import Overview from '../components/Dashboard/Views/Overview';
import Bookings from '../components/Dashboard/Views/Bookings';
import Tickets from '../components/Dashboard/Views/Tickets';
import Profile from '../components/Dashboard/Views/Profile';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (location.state && location.state.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location]);

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
        <div className="flex min-h-screen bg-[#f8fafc] relative overflow-hidden">
            {/* Animated Orbs (Background layer) */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{
                    position: 'absolute', top: '5%', left: '5%',
                    width: 600, height: 600,
                    background: 'radial-gradient(circle,rgba(59,130,246,0.03) 0%,transparent 70%)',
                    borderRadius: '50%', filter: 'blur(60px)'
                }} />
                <div style={{
                    position: 'absolute', bottom: '5%', right: '5%',
                    width: 500, height: 500,
                    background: 'radial-gradient(circle,rgba(99,102,241,0.03) 0%,transparent 70%)',
                    borderRadius: '50%', filter: 'blur(60px)'
                }} />
            </div>

            {/* Sidebar */}
            <div className="relative z-20">
                <DashboardSidebar 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    user={user} 
                    handleLogout={handleLogout}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                />
            </div>

            {/* Content Area */}
            <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} p-4 md:p-10 pb-20 relative z-10`}>
                <div className="max-w-6xl mx-auto">
                    {/* Dashboard Header (Notifications & Profile) */}
                    <DashboardHeader />

                    {/* Render current tab/tag */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-blue-500/10 rounded-full" />
                                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0" />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Syncing Hub</p>
                                <div className="h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 animate-[shimmer_2s_infinite]" style={{ width: '60%' }} />
                                </div>
                            </div>
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
