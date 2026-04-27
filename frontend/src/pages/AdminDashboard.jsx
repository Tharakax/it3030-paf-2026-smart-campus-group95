import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/Dashboard/AdminSidebar';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import ResourceCatalogue from './ResourceCatalogue';
import CreateResource from './CreateResource';
import EditResource from './EditResource';
import AdminTickets from '../components/Dashboard/Views/AdminTickets';
import AdminBookingManagement from '../components/Booking/AdminBookingManagement';
import ResourceAnalyticsPanel from '../components/Dashboard/Views/ResourceAnalyticsPanel';
import UserManagement from '../components/Dashboard/Views/UserManagement';
import NotificationCenter from '../components/Dashboard/Views/NotificationCenter';
import Logins from '../components/Dashboard/Views/Logins';
import SendNotificationModal from '../components/Dashboard/SendNotificationModal';
import { Bell, Globe, Send } from 'lucide-react';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedResourceId, setSelectedResourceId] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);

    useEffect(() => {
        // System initialization mock
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Admin Sidebar */}
            <AdminSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                user={user} 
                handleLogout={handleLogout}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            {/* Main Control Area */}
            <main className={`transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} p-4 md:p-10 pb-20`}>
                <div className="max-w-7xl mx-auto">
                    {/* Dashboard Header (Notifications & Profile) */}
                    <DashboardHeader />
                    
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-emerald-500 rounded-full animate-spin shadow-2xl shadow-blue-100" />
                            <div className="text-center">
                                <p className="text-blue-600 font-black uppercase tracking-widest text-xs animate-pulse mb-1">Authenticating Root Access...</p>
                                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">UniSync Secure Shield Active</p>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-8">
                                        System <span className="text-blue-600 underline decoration-emerald-400 decoration-4">Dashboard</span>
                                    </h1>
                                    
                                    <div className="mt-8">
                                        <ResourceAnalyticsPanel />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div 
                                            onClick={() => setActiveTab('notifications')}
                                            className="p-10 text-center border-2 border-dashed border-blue-100 rounded-[3rem] bg-white group hover:border-blue-600 transition-all cursor-pointer hover:shadow-xl hover:shadow-blue-50"
                                        >
                                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <Bell className="w-8 h-8" />
                                            </div>
                                            <p className="text-slate-800 font-bold text-lg">System Notifications</p>
                                            <p className="text-slate-400 font-medium text-sm mt-1">Review activity logs and system alerts</p>
                                        </div>

                                        <div 
                                            onClick={() => setIsSendModalOpen(true)}
                                            className="p-10 text-center border-2 border-dashed border-indigo-100 rounded-[3rem] bg-white group hover:border-indigo-600 transition-all cursor-pointer hover:shadow-xl hover:shadow-indigo-50"
                                        >
                                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                <Send className="w-8 h-8" />
                                            </div>
                                            <p className="text-slate-800 font-bold text-lg">Send Broadcast</p>
                                            <p className="text-slate-400 font-medium text-sm mt-1">Dispatch custom alerts to users/techs</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-8">
                                        <NotificationCenter />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'tickets' && <AdminTickets />}

                            {activeTab === 'bookings' && <AdminBookingManagement />}

                            {activeTab === 'users' && <UserManagement />}

                            {activeTab === 'campus' && (
                                <div className="space-y-6">
                                    <ResourceCatalogue 
                                        onAddResourceClick={() => setActiveTab('campus-create')} 
                                        onEditResourceClick={(id) => {
                                            setSelectedResourceId(id);
                                            setActiveTab('campus-edit');
                                        }}
                                    />
                                </div>
                            )}

                            {activeTab === 'logins' && <Logins />}

                            {activeTab === 'campus-create' && (
                                <div className="space-y-6">
                                    <div className="relative py-4 flex flex-col items-center">
                                        <button 
                                            onClick={() => setActiveTab('campus')}
                                            className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition flex items-center"
                                        >
                                            <span className="mr-1">←</span> Cancel & Return
                                        </button>
                                        <h2 className="text-3xl font-black text-slate-800 tracking-tighter text-center">Add Campus Resource</h2>
                                    </div>
                                    <CreateResource onResourceCreated={() => setActiveTab('campus')} />
                                </div>
                            )}

                            {activeTab === 'campus-edit' && (
                                <div className="space-y-6">
                                    <div className="relative py-4 flex flex-col items-center">
                                        <button 
                                            onClick={() => setActiveTab('campus')}
                                            className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition flex items-center"
                                        >
                                            <span className="mr-1">←</span> Cancel & Return
                                        </button>
                                        <h2 className="text-3xl font-black text-slate-800 tracking-tighter text-center border-b-4 border-blue-600 pb-1">Edit Campus Resource</h2>
                                    </div>
                                    <EditResource 
                                        resourceId={selectedResourceId} 
                                        onResourceUpdated={() => setActiveTab('campus')} 
                                    />
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </main>

            {/* Custom Modals */}
            <SendNotificationModal 
                isOpen={isSendModalOpen} 
                onClose={() => setIsSendModalOpen(false)} 
            />
        </div>
    );
};

export default AdminDashboard;
