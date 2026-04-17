import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/Dashboard/AdminSidebar';
import ResourceCatalogue from './ResourceCatalogue';
import CreateResource from './CreateResource';
import EditResource from './EditResource';
import AdminTickets from '../components/Dashboard/Views/AdminTickets';
import AdminBookingManagement from '../components/Booking/AdminBookingManagement';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedResourceId, setSelectedResourceId] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
        <div className="flex min-h-screen bg-[#f8fafc]">
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
            <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} p-4 md:p-10 pb-20`}>
                <div className="max-w-7xl mx-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-emerald-500 rounded-full animate-spin shadow-2xl shadow-blue-100" />
                            <div className="text-center">
                                <p className="text-blue-600 font-black uppercase tracking-widest text-xs animate-pulse mb-1">Authenticating Root Access...</p>
                                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter italic">UniSync Secure Shield Active</p>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter">
                                        System <span className="text-blue-600 underline decoration-emerald-400 decoration-4">Dashboard</span>
                                    </h1>
                                    <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-white group hover:border-slate-900 transition-colors cursor-help">
                                        <p className="text-slate-400 font-bold italic group-hover:text-slate-600">Core administrative modules ready for deployment</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'tickets' && <AdminTickets />}

                            {activeTab === 'bookings' && <AdminBookingManagement />}

                            {activeTab === 'users' && (
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tighter">User Management</h2>
                                    <div className="p-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                                        <p className="text-slate-400 font-bold italic">User audit and permission controls initialization pending</p>
                                    </div>
                                </div>
                            )}

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

                            {['security', 'settings'].includes(activeTab) && (
                                <div className="p-20 text-center text-slate-400 font-bold italic border-2 border-slate-100 rounded-[3rem] bg-white uppercase tracking-widest text-xs">
                                    Terminal: Accessing {activeTab} Control Node...
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
