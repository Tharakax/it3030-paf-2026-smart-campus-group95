import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TechnicianSidebar from '../components/Dashboard/TechnicianSidebar';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import TechnicianTickets from '../components/Dashboard/Views/TechnicianTickets';
import TechnicianHistory from '../components/Dashboard/Views/TechnicianHistory';
import Profile from '../components/Dashboard/Views/Profile';
import NotificationCenter from '../components/Dashboard/Views/NotificationCenter';
import SendNotificationModal from '../components/Dashboard/SendNotificationModal';
import { Bell, Send } from 'lucide-react';

const TechnicianDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tasks');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);

    useEffect(() => {
        // Mock loading effect
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Sidebar */}
            <TechnicianSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                user={user}
                handleLogout={handleLogout}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            {/* Main Content Area */}
            <main className={`transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} p-4 md:p-10 pb-20`}>
                <div className="max-w-6xl mx-auto">
                    {/* Dashboard Header (Notifications & Profile) */}
                    <DashboardHeader />

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Tech Portal...</p>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {activeTab === 'notifications' && <NotificationCenter />}
                            
                            {activeTab === 'tasks' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <h1 className="text-3xl font-black text-slate-800 tracking-tighter">
                                            Assigned <span className="text-blue-600 underline decoration-blue-200 decoration-4">Tasks</span>
                                        </h1>
                                        <button 
                                            onClick={() => setIsSendModalOpen(true)}
                                            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
                                        >
                                            <Send size={16} /> Broadcast Message
                                        </button>
                                    </div>
                                    <TechnicianTickets />
                                </div>
                            )}

                            {activeTab === 'history' && <TechnicianHistory />}

                            {activeTab === 'profile' && <Profile user={user} />}

                            {['tools', 'settings'].includes(activeTab) && (
                                <div className="p-20 text-center text-slate-400 font-medium italic animate-in fade-in duration-500 bg-white rounded-[3rem] border border-slate-100 uppercase tracking-widest text-xs">
                                    Module: {activeTab}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <SendNotificationModal 
                isOpen={isSendModalOpen} 
                onClose={() => setIsSendModalOpen(false)} 
            />
        </div>
    );
};

export default TechnicianDashboard;
