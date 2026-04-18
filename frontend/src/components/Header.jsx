import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Bell, UserCircle, LogOut, Menu, X, Settings, Shield, Wrench, LayoutDashboard, Layers, Box } from 'lucide-react';
import NotificationBell from './Dashboard/NotificationBell';
import Swal from 'sweetalert2';


const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand Logo & Name */}
                    <div
                        className="flex items-center space-x-2 cursor-pointer group"
                        onClick={() => navigate('/home')}
                    >
                        <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
                            <Layers className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                            UniSync <span className="text-blue-600 font-extrabold">Hub</span>
                        </h2>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <Link to="/home" className="px-4 py-2 rounded-lg text-slate-600 font-medium hover:text-blue-600 hover:bg-blue-50 transition-all">
                            Home
                        </Link>
                        <Link to="/resources" className="px-4 py-2 rounded-lg text-slate-600 font-medium hover:text-blue-600 hover:bg-blue-50 transition-all">
                            Catalogue
                        </Link>
                        <Link to="/contact" className="px-4 py-2 rounded-lg text-slate-600 font-medium hover:text-blue-600 hover:bg-blue-50 transition-all">
                            Contact Us
                        </Link>

                        {/* Role-Specific Badges/Links */}
                        {user.role === 'ADMIN' && (
                            <Link to="/admin" className="ml-2 flex items-center px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition-all border border-indigo-100">
                                <Shield className="w-4 h-4 mr-2" />
                                Admin Panel
                            </Link>
                        )}
                        {user.role === 'TECHNICIAN' && (
                            <Link to="/technician" className="ml-2 flex items-center px-4 py-2 rounded-lg bg-orange-50 text-orange-700 font-semibold hover:bg-orange-100 transition-all border border-orange-100">
                                <Wrench className="w-4 h-4 mr-2" />
                                Tech Portal
                            </Link>
                        )}
                    </nav>

                    {/* Actions & Profile */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Notifications */}
                        <NotificationBell onViewAll={() => navigate('/dashboard')} />

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-3 p-1 pr-3 rounded-full border border-slate-200 hover:bg-slate-50 hover:border-blue-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <img
                                    src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=eff6ff&color=2563eb`}
                                    alt="User Avatar"
                                    className="w-8 h-8 rounded-full object-cover border border-slate-100 shadow-sm"
                                />
                                <div className="text-left hidden lg:block">
                                    <p className="text-sm font-semibold text-slate-700 leading-tight">{user?.name?.split(' ')[0] || 'User'}</p>
                                    <p className="text-xs text-slate-500 font-medium">{user?.role}</p>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2">
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

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        <Link to="/home" className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600">
                            Home
                        </Link>
                        <Link to="/bookings" className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600">
                            Bookings
                        </Link>
                        <Link to="/contact" className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600">
                            Contact Us
                        </Link>

                        {user?.role === 'ADMIN' && (
                            <Link to="/admin" className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-700 bg-indigo-50">
                                Admin Panel
                            </Link>
                        )}
                        {user?.role === 'TECHNICIAN' && (
                            <Link to="/technician" className="block px-3 py-2 rounded-lg text-base font-medium text-orange-700 bg-orange-50">
                                Tech Portal
                            </Link>
                        )}

                        <div className="border-t border-slate-100 mt-4 pt-4">
                            <div className="flex items-center px-3 mb-4">
                                <img 
                                    src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=eff6ff&color=2563eb`} 
                                    alt="Avatar" 
                                    className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm" 
                                />
                                <div className="ml-3">
                                    <p className="text-base font-medium text-slate-800">{user?.name || 'User'}</p>
                                    <p className="text-sm font-medium text-slate-500">{user?.email}</p>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="w-full flex items-center px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50">
                                <LogOut className="w-5 h-5 mr-3" />
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
