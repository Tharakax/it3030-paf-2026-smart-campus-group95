import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { LayoutDashboard, LogOut, ShieldAlert, Server, Activity, UserCircle } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/users/dashboard');
                setMessage(response.data.message);
            } catch (err) {
                console.error("Failed to fetch dashboard", err);
            }
        };
        fetchDashboard();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-[calc(100vh-140px)] bg-slate-50 p-6 md:p-12 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-white to-blue-50">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <div className="bg-blue-100 p-3 rounded-xl">
                            <LayoutDashboard className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">User Dashboard</h2>
                            <p className="text-slate-500 text-sm">Welcome back to your personalized space.</p>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        {user?.role === 'ADMIN' && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="flex items-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-4 py-2 rounded-lg transition-colors border border-indigo-100"
                            >
                                <ShieldAlert className="w-4 h-4 mr-2" />
                                Admin Panel
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: User Info */}
                    <div className="md:col-span-1 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex items-center justify-center mb-6">
                                <div className="relative">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=eff6ff&color=2563eb&size=100`}
                                        alt="Avatar"
                                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                                    />
                                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <p className="text-xl font-bold text-slate-800">{user?.name || "Student User"}</p>
                                <p className="text-slate-500 text-sm break-all">{user?.email}</p>
                                <span className="inline-block mt-2 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wider">
                                    {user?.role}
                                </span>
                            </div>

                            <hr className="my-6 border-slate-100" />

                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-center p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-medium text-sm border border-transparent hover:border-slate-200">
                                    <UserCircle className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm border border-transparent hover:border-red-100"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out safely
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: System Status / Server Messages */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 h-full">
                            <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                    <Server className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">Backend Communication</h3>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>

                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Server Message</span>
                                    <div className="flex items-center space-x-1.5 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                                        <Activity className="w-3 h-3" />
                                        <span>200 OK</span>
                                    </div>
                                </div>

                                <p className="text-slate-800 font-medium text-lg leading-relaxed mt-4">
                                    {message ? (
                                        <span className="flex items-start">
                                            <span className="text-blue-500 mr-2">"</span>
                                            {message}
                                            <span className="text-blue-500 ml-1">"</span>
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 animate-pulse flex items-center">
                                            <Activity className="w-4 h-4 mr-2 animate-spin-slow" />
                                            Establishing secure connection...
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                                    <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Session Target</p>
                                    <p className="text-slate-800 font-medium font-mono text-sm">/api/users/dashboard</p>
                                </div>
                                <div className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                                    <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Auth Type</p>
                                    <p className="text-slate-800 font-medium font-mono text-sm">Bearer (JWT)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
