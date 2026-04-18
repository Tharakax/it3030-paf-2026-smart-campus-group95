import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TechnicianSidebar from '../components/Dashboard/TechnicianSidebar';
import TechnicianTickets from '../components/Dashboard/Views/TechnicianTickets';
import TechnicianHistory from '../components/Dashboard/Views/TechnicianHistory';

const TechnicianDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Tech Portal...</p>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {activeTab === 'overview' && (
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">System Overview</h1>
                                    <p className="text-slate-500 mt-2 font-medium">Welcome back, {user?.name || 'Technician'}. Here is your maintenance summary.</p>
                                    
                                    <div className="mt-12 p-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-white text-slate-400 italic">
                                        Overview modules are ready to be implemented
                                    </div>
                                </div>
                            )}
                            
                            {activeTab === 'tasks' && <TechnicianTickets />}

                            {activeTab === 'history' && <TechnicianHistory />}

                            {['tools', 'profile', 'settings'].includes(activeTab) && (
                                <div className="p-20 text-center text-slate-400 font-medium italic animate-in fade-in duration-500 bg-white rounded-[3rem] border border-slate-100 uppercase tracking-widest text-xs">
                                    Module: {activeTab}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TechnicianDashboard;
