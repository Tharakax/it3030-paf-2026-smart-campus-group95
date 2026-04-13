import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { 
    LayoutDashboard, 
    Calendar, 
    Ticket, 
    User, 
    Activity, 
    Server, 
    ArrowUpRight, 
    Clock, 
    Plus,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Edit3,
    ShieldCheck
} from 'lucide-react';
import DashboardSidebar from '../components/Dashboard/DashboardSidebar';

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

    // --- Sub-View Components ---

    const OverviewView = () => (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">
                        Hello, {user?.name?.split(' ')[0] || 'Student'}! 👋
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium">Here's what's happening on your campus today.</p>
                </div>
                <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">System Secure</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Active Bookings', value: '4', icon: Calendar, color: 'blue', detail: 'Next: Study Room 204' },
                    { label: 'Open Tickets', value: '2', icon: Ticket, color: 'indigo', detail: '1 urgent priority' },
                    { label: 'Uni-Points', value: '1,250', icon: ArrowUpRight, color: 'emerald', detail: '+120 this week' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 bg-${stat.color}-50 rounded-xl text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <p className="text-3xl font-black text-slate-800 mb-1">{stat.value}</p>
                        <p className="text-xs text-slate-500 font-medium flex items-center">
                            <Clock size={12} className="mr-1" />
                            {stat.detail}
                        </p>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-blue-600" />
                            Recent Activity
                        </h3>
                        <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View All</button>
                    </div>
                    <div className="p-8 space-y-6">
                        {[
                            { title: 'Room Reservation Confirmed', time: '2 hours ago', type: 'booking', status: 'success' },
                            { title: 'WiFi Connectivity Issue Reported', time: '5 hours ago', type: 'ticket', status: 'pending' },
                            { title: 'Library Book Due Reminder', time: 'Yesterday', type: 'alert', status: 'info' }
                        ].map((act, i) => (
                            <div key={i} className="flex items-center group cursor-pointer">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-slate-50 group-hover:bg-blue-50 transition-colors`}>
                                    {act.status === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
                                </div>
                                <div className="flex-1 border-b border-slate-50 pb-4 group-last:border-0">
                                    <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{act.title}</p>
                                    <p className="text-xs text-slate-400 font-medium">{act.time}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Message / Connection */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <Server size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                    <Server className="w-5 h-5 text-indigo-400" />
                                </div>
                                <span className="text-xs font-bold tracking-widest uppercase opacity-70">Server Handshake</span>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm font-mono text-indigo-300">GET /api/users/dashboard</p>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                                    <p className="text-emerald-400 font-bold mb-2 text-xs uppercase tracking-tighter">Response Payload:</p>
                                    <p className="text-blue-100 text-sm leading-relaxed italic">
                                        "{message || 'Waiting for heartbeat...'}"
                                    </p>
                                </div>
                                <div className="flex items-center text-[10px] font-bold text-slate-400 mt-4 space-x-3">
                                    <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1" /> HTTP 200</span>
                                    <span>V1.0.4-STABLE</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between group cursor-pointer overflow-hidden relative">
                        <div className="relative z-10">
                            <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Upcoming Event</p>
                            <h4 className="font-bold text-lg">Tech Symposium 2026</h4>
                            <p className="text-xs opacity-70 mt-1">Tomorrow, 10:00 AM @ Hall A</p>
                        </div>
                        <Plus className="w-8 h-8 opacity-40 group-hover:scale-125 group-hover:rotate-90 transition-all duration-500" />
                    </div>
                </div>
            </div>
        </div>
    );

    const BookingsView = () => (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">My Bookings</h2>
                    <p className="text-slate-500 mt-1">Manage and track your facility reservations.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-blue-200 transition-all active:scale-95">
                    <Plus className="w-5 h-5 mr-2" />
                    New Reservation
                </button>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Resource</th>
                            <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
                            <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {[
                            { resource: 'Study Room 204', icon: Calendar, time: 'April 15, 10:00 AM', status: 'Confirmed', color: 'bg-green-100 text-green-700' },
                            { resource: 'Main Library Desk 12', icon: Calendar, time: 'April 18, 02:30 PM', status: 'Pending', color: 'bg-amber-100 text-amber-700' }
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mr-3 group-hover:scale-110 transition-transform">
                                            <row.icon size={18} />
                                        </div>
                                        <span className="font-bold text-slate-700 tracking-tight">{row.resource}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-sm text-slate-500 font-medium">{row.time}</td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${row.color}`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <button className="text-slate-400 hover:text-blue-600 font-bold text-xs uppercase transition-colors">Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const TicketsView = () => (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Support Tickets</h2>
                    <p className="text-slate-500 mt-1">Get help with campus services and IT.</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-indigo-200 transition-all active:scale-95">
                    <Plus className="w-5 h-5 mr-2" />
                    Open New Ticket
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { id: 'TKT-7821', title: 'WiFi Connectivity in Block C', priority: 'High', status: 'In Progress', date: '2 days ago' },
                    { id: 'TKT-7845', title: 'Library Card Not Working', priority: 'Medium', status: 'Resolved', date: '5 days ago' }
                ].map((tkt, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-[10px] font-black font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded tracking-widest">{tkt.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                tkt.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'
                            }`}>{tkt.priority} Priority</span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-indigo-600 transition-colors">{tkt.title}</h4>
                        <div className="flex items-center justify-between mt-8">
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${tkt.status === 'Resolved' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`} />
                                <span className="text-sm font-bold text-slate-500">{tkt.status}</span>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">{tkt.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const ProfileView = () => (
        <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-4xl">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">Personal Profile</h2>
            
            <div className="space-y-8">
                {/* Profile Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 flex flex-col md:flex-row gap-10 items-center md:items-start relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                        <button className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all">
                            <Edit3 className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="relative group">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=2563eb&color=fff&size=200`} 
                            className="w-40 h-40 rounded-3xl shadow-2xl border-4 border-white transform group-hover:rotate-3 transition-transform duration-500"
                            alt="Profile"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white p-2 rounded-xl text-white">
                            <CheckCircle2 size={20} />
                        </div>
                    </div>

                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{user?.name}</h3>
                            <p className="text-slate-500 font-medium">{user?.email}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">User Role</p>
                                <p className="font-bold text-slate-700">{user?.role}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student ID</p>
                                <p className="font-bold text-slate-700 font-mono text-sm uppercase">IT-3030-2026</p>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
                            {['Member since 2024', 'Account Verified', 'Premium Access'].map((badge, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Account Settings Placeholder */}
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                    <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold italic">Detailed profile settings coming soon...</p>
                </div>
            </div>
        </div>
    );

    // --- Main Render ---

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
                    {/* Render current tab */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Hub...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'overview' && <OverviewView />}
                            {activeTab === 'bookings' && <BookingsView />}
                            {activeTab === 'tickets' && <TicketsView />}
                            {activeTab === 'profile' && <ProfileView />}
                            {activeTab === 'settings' && <div className="p-20 text-center text-slate-400 font-medium italic">Settings module under development</div>}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
