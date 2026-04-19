import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';
import NotificationBell from './NotificationBell';
import Swal from 'sweetalert2';

const DashboardHeader = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        Swal.fire({
            title: 'Logout?',
            text: "Are you sure you want to end your session?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#cbd5e1',
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel',
            background: '#ffffff',
            customClass: {
                popup: 'rounded-[1.5rem] border-none shadow-2xl',
                title: 'text-slate-800 font-bold',
                htmlContainer: 'text-slate-600 font-medium',
                confirmButton: 'rounded-xl font-bold px-6 py-3',
                cancelButton: 'rounded-xl font-bold px-6 py-3 text-slate-500'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                navigate('/login');
            }
        });
    };

    if (!user) return null;

    return (
        <div className="flex justify-end items-center mb-8 gap-4 px-2">
            {/* Notifications */}
            <NotificationBell onViewAll={() => navigate('/dashboard')} />

            {/* Profile Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 p-1 pr-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                >
                    <img
                        src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=eff6ff&color=2563eb`}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full object-cover border border-slate-100 shadow-sm"
                    />
                    <div className="text-left hidden md:block">
                        <p className="text-sm font-semibold text-slate-700 leading-tight">{user?.name?.split(' ')[0] || 'User'}</p>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest text-[9px] font-black">{user?.role}</p>
                    </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-[100] animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-2 border-b border-slate-100 mb-2">
                            <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
                        </div>
                        <button
                            onClick={() => {
                                navigate('/dashboard');
                                setIsProfileOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center"
                        >
                            <LayoutDashboard className="w-4 h-4 mr-2 text-slate-400" />
                            Dashboard
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center mt-1"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHeader;
