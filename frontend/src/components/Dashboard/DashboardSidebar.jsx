import React from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    User,
    Calendar,
    Ticket,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Layers
} from 'lucide-react';

const DashboardSidebar = ({ activeTab, setActiveTab, user, handleLogout, isCollapsed, setIsCollapsed }) => {
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'bookings', label: 'My Bookings', icon: Calendar },
        { id: 'tickets', label: 'My Tickets', icon: Ticket },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside
            className={`fixed left-0 top-0 bottom-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'
                } hidden md:block`}
        >
            <div className="flex flex-col h-full py-4">
                {/* Branding Section */}
                <Link 
                    to="/" 
                    className={`px-6 mb-8 flex items-center hover:opacity-80 transition-opacity ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
                >
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
                        <Layers className="text-white w-6 h-6" />
                    </div>
                    {!isCollapsed && (
                        <span className="text-xl font-black text-slate-800 tracking-tighter">
                            UniSync <span className="text-blue-600">Hub</span>
                        </span>
                    )}
                </Link>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-4 bg-white border border-slate-200 rounded-full p-1 text-slate-400 hover:text-blue-600 shadow-sm z-50 transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* User Intro - Only visible when expanded */}
                {!isCollapsed && (
                    <div className="px-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100 shadow-sm">
                            <div className="flex items-start space-x-3">
                                <img
                                    src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=2563eb&color=fff`}
                                    className="w-11 h-11 rounded-xl shadow-md object-cover border-2 border-white"
                                    alt="User"
                                />
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <p className="text-sm font-bold text-slate-800 truncate leading-tight tracking-tight">{user?.name || 'Student'}</p>
                                    <p className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest mt-0.5 leading-none">{user?.role}</p>
                                    <div className="flex items-center mt-1.5">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                                        <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest leading-none">Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 px-3 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center transition-all duration-200 group relative ${isCollapsed ? 'justify-center py-4' : 'px-4 py-3 rounded-xl'
                                    } ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                                    }`}
                            >
                                <Icon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}`} />
                                {!isCollapsed && <span className="font-semibold text-sm">{item.label}</span>}

                                {isActive && !isCollapsed && (
                                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white opacity-40 animate-pulse" />
                                )}

                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                        {item.label}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="px-3 mt-auto">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center text-red-500 hover:bg-red-50 transition-all group relative ${isCollapsed ? 'justify-center py-4' : 'px-4 py-3 rounded-xl'
                            }`}
                    >
                        <LogOut className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}`} />
                        {!isCollapsed && <span className="font-semibold text-sm">Logout</span>}

                        {isCollapsed && (
                            <div className="absolute left-full ml-4 px-2 py-1 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                Logout
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
