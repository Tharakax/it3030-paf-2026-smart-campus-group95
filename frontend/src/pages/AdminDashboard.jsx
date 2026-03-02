import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { ShieldAlert, Users, Server, Activity, ArrowLeft, Settings, Database, Lock } from 'lucide-react';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const response = await api.get('/admin/dashboard');
                setMessage(response.data.message);
            } catch (err) {
                console.error("Failed to fetch admin dashboard", err);
            }
        };
        fetchAdminData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-[calc(100vh-140px)] bg-slate-900 p-6 md:p-12 font-sans relative overflow-hidden">
            {/* Dark Mode Ambient Background for Admin View */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Admin Header */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-between items-center shadow-2xl">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-500/30">
                            <ShieldAlert className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                System Administration
                                <span className="ml-3 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/20 uppercase tracking-wider">Highly Restricted</span>
                            </h2>
                            <p className="text-slate-400 text-sm">Elevated access portal for global management.</p>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={() => navigate('/home')}
                            className="flex items-center bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-lg transition-colors border border-slate-600"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Return to Portal
                        </button>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
                        { title: 'System Status', value: 'Healthy', icon: Activity, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
                        { title: 'Database Nodes', value: '3 Active', icon: Database, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
                        { title: 'Security Alerts', value: '0 Found', icon: Lock, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-lg ${stat.bg} ${stat.border} border`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Secure Data Module */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/80">
                        <div className="flex items-center space-x-2">
                            <Server className="w-5 h-5 text-indigo-400" />
                            <h3 className="text-lg font-bold text-slate-200">Secure Backend Handshake</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                            </span>
                            <span className="text-xs font-mono text-indigo-300">Port 8080 : LIVE</span>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="bg-slate-900 rounded-xl p-6 font-mono text-sm border border-slate-700 relative overflow-hidden group">
                            {/* Decorative terminal header */}
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                <span className="text-slate-500 text-xs ml-2">bash ~ GET /api/admin/dashboard</span>
                            </div>

                            <p className="text-slate-400 mb-2">
                                <span className="text-emerald-400">admin@{user?.name?.split(' ')[0]?.toLowerCase() || 'user'}</span>
                                <span className="text-slate-500">:$</span> Initiating secure request...
                            </p>
                            <p className="text-slate-400 mb-4">
                                <span className="text-emerald-400">admin@{user?.name?.split(' ')[0]?.toLowerCase() || 'user'}</span>
                                <span className="text-slate-500">:$</span> Verifying active Bearer token validity... <span className="text-indigo-400">[OK]</span>
                            </p>

                            <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                                <p className="text-indigo-300 font-bold mb-2">&gt;_ SERVER RESPONSE:</p>
                                {message ? (
                                    <p className="text-emerald-400 text-base leading-relaxed typing-animation">
                                        {message}
                                    </p>
                                ) : (
                                    <p className="text-slate-500 animate-pulse">Awaiting payload...</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium">
                                <Settings className="w-4 h-4 mr-2" />
                                Advanced Configuration
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
