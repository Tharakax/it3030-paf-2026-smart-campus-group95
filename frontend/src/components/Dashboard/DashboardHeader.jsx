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
            {/* Empty Header as requested */}
        </div>
    );
};

export default DashboardHeader;
