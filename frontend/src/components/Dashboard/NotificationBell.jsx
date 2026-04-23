import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink, Inbox, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import notificationService from '../../api/notificationService';
import { useNavigate } from 'react-router-dom';

const NotificationBell = ({ onViewAll }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotificationsData = async () => {
        try {
            const [notifs, unread] = await Promise.all([
                notificationService.getNotifications(),
                notificationService.getUnreadCount()
            ]);
            setNotifications(notifs.slice(0, 5)); // Show only latest 5 in dropdown
            setUnreadCount(unread.count);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotificationsData();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotificationsData, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleMarkAllRead = async () => {
        setIsLoading(true);
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to mark all as read", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNotificationClick = async (notif) => {
        if (!notif.isRead) {
            await notificationService.markAsRead(notif.id);
        }
        setIsOpen(false);
        
        // Navigation logic based on type
        if (notif.type.startsWith('BOOKING')) {
            navigate('/bookings');
        } else if (notif.type.startsWith('INCIDENT')) {
            // If it's admin/technician dashboard, might need specific tab
            // For now, let's just go to the relevant dashboard or center
            if (onViewAll) onViewAll();
        }
    };

    const getTypeStyles = (type) => {
        switch (type) {
            case 'BOOKING_APPROVED': return 'bg-emerald-100 text-emerald-600';
            case 'BOOKING_REJECTED': return 'bg-red-100 text-red-600';
            case 'INCIDENT_ASSIGNED': return 'bg-blue-100 text-blue-600';
            case 'INCIDENT_STATUS_UPDATE': return 'bg-amber-100 text-amber-600';
            case 'NEW_BOOKING_REQUEST': return 'bg-purple-100 text-purple-600';
            case 'NEW_INCIDENT_REPORT': return 'bg-orange-100 text-orange-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-xl transition-all duration-200 ${
                    isOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                }`}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white text-[10px] font-bold text-white items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={handleMarkAllRead}
                                disabled={isLoading}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center"
                            >
                                {isLoading ? <Loader2 size={12} className="animate-spin mr-1" /> : <Check size={12} className="mr-1" />}
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 flex gap-3 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${getTypeStyles(notif.type)}`}>
                                        <Bell size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className={`text-sm font-bold truncate ${!notif.isRead ? 'text-slate-900' : 'text-slate-600'}`}>
                                                {notif.title}
                                            </p>
                                            {!notif.isRead && (
                                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1" />
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                                            {notif.message}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-medium mt-1">
                                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                                <div className="p-4 bg-slate-50 rounded-full mb-3">
                                    <Inbox size={32} />
                                </div>
                                <p className="text-sm font-bold">All caught up!</p>
                                <p className="text-xs">No new notifications</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            setIsOpen(false);
                            if (onViewAll) onViewAll();
                        }}
                        className="w-full py-3 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors flex items-center justify-center border-t border-slate-50 rounded-b-2xl"
                    >
                        View All Notifications
                        <ExternalLink size={12} className="ml-1.5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
