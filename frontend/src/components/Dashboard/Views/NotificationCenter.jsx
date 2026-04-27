import React, { useState, useEffect, useContext } from 'react';
import { 
    Bell, 
    Check, 
    Trash2, 
    Filter, 
    Inbox, 
    CheckCircle2, 
    XCircle, 
    AlertTriangle, 
    Info, 
    Calendar,
    Search,
    RefreshCcw,
    Send,
    Edit3,
    Users,
    MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';
import notificationService from '../../../api/notificationService';
import toast from 'react-hot-toast';
import { AuthContext } from '../../../context/AuthContext';
import EditBroadcastModal from '../EditBroadcastModal';

const NotificationCenter = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [sentNotifications, setSentNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('INBOX'); // INBOX, SENT
    const [filter, setFilter] = useState('ALL'); // ALL, UNREAD, BOOKING, INCIDENT, CUSTOM
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBroadcast, setSelectedBroadcast] = useState(null);

    const isAuthorizedToManage = currentUser?.role === 'ADMIN' || currentUser?.role === 'TECHNICIAN';

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data);
            
            if (isAuthorizedToManage) {
                const sentData = await notificationService.getSentNotifications();
                setSentNotifications(sentData);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
            toast.error("Failed to load notifications");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            toast.error("Failed to update notification");
        }
    };

    const markAllAsRead = async () => {
        if (notifications.filter(n => !n.isRead).length === 0) return;
        
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success("All notifications marked as read");
        } catch (error) {
            toast.error("Failed to update notifications");
        }
    };

    const handleDeleteBroadcast = async (broadcastId) => {
        if (!window.confirm("Are you sure you want to retract this notification? It will be removed from all recipients' dashboards.")) return;
        
        try {
            await notificationService.deleteBroadcast(broadcastId);
            toast.success("Notification retracted successfully");
            fetchNotifications();
        } catch (error) {
            toast.error("Failed to delete notification");
        }
    };

    const handleEditBroadcast = (broadcast) => {
        setSelectedBroadcast(broadcast);
        setIsEditModalOpen(true);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'BOOKING_APPROVED': return <CheckCircle2 className="text-emerald-500" />;
            case 'BOOKING_REJECTED': return <XCircle className="text-red-500" />;
            case 'INCIDENT_ASSIGNED': return <Info className="text-blue-500" />;
            case 'INCIDENT_STATUS_UPDATE': return <AlertTriangle className="text-amber-500" />;
            case 'NEW_BOOKING_REQUEST': return <Calendar className="text-purple-500" />;
            case 'NEW_INCIDENT_REPORT': return <Bell className="text-orange-500" />;
            case 'TICKET_COMMENT': return <MessageSquare className="text-blue-600" />;
            default: return <Bell className="text-slate-400" />;
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'ALL') return true;
        if (filter === 'UNREAD') return !n.isRead;
        if (filter === 'BOOKING') return n.type.startsWith('BOOKING') || n.type === 'NEW_BOOKING_REQUEST';
        if (filter === 'INCIDENT') return n.type.startsWith('INCIDENT') || n.type === 'NEW_INCIDENT_REPORT' || n.type === 'TICKET_COMMENT';
        if (filter === 'CUSTOM') return n.type === 'CUSTOM';
        return true;
    });

    const getGroupedSentNotifications = () => {
        const groups = {};
        sentNotifications.forEach(n => {
            const key = n.broadcastId || n.id;
            if (!groups[key]) {
                groups[key] = {
                    ...n,
                    recipientCount: 0
                };
            }
            groups[key].recipientCount += 1;
        });
        return Object.values(groups).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    const groupedSent = getGroupedSentNotifications();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter">
                        Notification <span className="text-blue-600 underline decoration-emerald-400 decoration-4">Center</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">Manage all your system alerts and activity.</p>
                </div>

                <div className="flex items-center gap-2">
                    {viewMode === 'INBOX' ? (
                        <>
                            <button 
                                onClick={fetchNotifications}
                                className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                            >
                                <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
                            </button>
                            <button 
                                onClick={markAllAsRead}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                            >
                                <Check size={18} />
                                Mark all as read
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={fetchNotifications}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                        >
                            <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
                            Refresh History
                        </button>
                    )}
                </div>
            </div>

            {/* View Tabs */}
            {isAuthorizedToManage && (
                <div className="flex border-b border-slate-100">
                    <button 
                        onClick={() => { setViewMode('INBOX'); setFilter('ALL'); }}
                        className={`px-8 py-4 text-sm font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
                            viewMode === 'INBOX' 
                            ? 'border-blue-600 text-blue-600 bg-blue-50/30' 
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        Inbox (Recieved)
                    </button>
                    <button 
                        onClick={() => { setViewMode('SENT'); setFilter('ALL'); }}
                        className={`px-8 py-4 text-sm font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
                            viewMode === 'SENT' 
                            ? 'border-blue-600 text-blue-600 bg-blue-50/30' 
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        Sent History (Management)
                    </button>
                </div>
            )}

            {/* Filters */}
            {viewMode === 'INBOX' && (
                <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
                    {[
                        { id: 'ALL', label: 'All Activity' },
                        { id: 'UNREAD', label: 'Unread' },
                        { id: 'BOOKING', label: 'Bookings' },
                        { id: 'INCIDENT', label: 'Incidents' },
                        { id: 'CUSTOM', label: 'Broadcasts' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                filter === tab.id 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                {isLoading ? (
                    <div className="p-20 flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing Archives...</p>
                    </div>
                ) : (viewMode === 'INBOX' ? filteredNotifications.length > 0 : groupedSent.length > 0) ? (
                    <div className="divide-y divide-slate-50">
                        {(viewMode === 'INBOX' ? filteredNotifications : groupedSent).map((notif) => (
                            <div 
                                key={notif.id}
                                className={`group p-6 md:p-8 flex flex-col md:flex-row gap-6 transition-all hover:bg-slate-50/50 ${viewMode === 'INBOX' && !notif.isRead ? 'bg-blue-50/20' : ''}`}
                            >
                                <div className="flex items-start justify-between md:justify-start gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-white shrink-0 bg-white`}>
                                        {viewMode === 'SENT' ? <Send className="text-indigo-600" /> : getIcon(notif.type)}
                                    </div>
                                    <div className="md:hidden">
                                         {viewMode === 'INBOX' && !notif.isRead && (
                                            <button 
                                                onClick={() => markAsRead(notif.id)}
                                                className="p-2 bg-blue-100 text-blue-600 rounded-lg"
                                            >
                                                <Check size={16} />
                                            </button>
                                         )}
                                         {viewMode === 'SENT' && notif.type === 'CUSTOM' && (
                                             <div className="flex gap-2">
                                                 <button onClick={() => handleEditBroadcast(notif)} className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Edit3 size={16} /></button>
                                                 <button onClick={() => handleDeleteBroadcast(notif.broadcastId || notif.id)} className="p-2 bg-red-100 text-red-600 rounded-lg"><Trash2 size={16} /></button>
                                             </div>
                                         )}
                                    </div>
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className={`text-lg font-bold ${viewMode === 'INBOX' && !notif.isRead ? 'text-slate-900' : 'text-slate-600'}`}>
                                                {notif.title}
                                            </h3>
                                            {viewMode === 'INBOX' && !notif.isRead && (
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">New</span>
                                            )}
                                            {viewMode === 'SENT' && notif.recipientCount > 1 && (
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                                                    <Users size={12} />
                                                    {notif.recipientCount} Recipients
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-bold text-slate-400">
                                                {format(new Date(notif.createdAt), 'MMM d, yyyy • h:mm a')}
                                            </span>
                                        </div>
                                    </div>
                                    <p className={`text-sm leading-relaxed ${viewMode === 'INBOX' && !notif.isRead ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                                        {notif.message}
                                    </p>
                                    
                                    <div className="flex items-center gap-3 pt-2">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                            notif.type === 'CUSTOM' ? 'bg-indigo-50 text-indigo-600' :
                                            notif.type.startsWith('BOOKING') ? 'bg-emerald-50 text-emerald-600' :
                                            'bg-amber-50 text-amber-600'
                                        }`}>
                                            {notif.type.replace(/_/g, ' ')}
                                        </span>
                                        {viewMode === 'SENT' && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-slate-400">Sent by You</span>
                                                {notif.targetDisplayName && (
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md border border-slate-200">
                                                        Sent To: {notif.targetDisplayName}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="hidden md:flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                    {viewMode === 'INBOX' && !notif.isRead && (
                                        <button 
                                            onClick={() => markAsRead(notif.id)}
                                            className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm flex items-center gap-2 font-bold text-xs"
                                        >
                                            <Check size={16} />
                                            Mark as Read
                                        </button>
                                    )}
                                    {viewMode === 'SENT' && notif.type === 'CUSTOM' && (
                                        <>
                                            <button 
                                                onClick={() => handleEditBroadcast(notif)}
                                                className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 rounded-xl transition-all shadow-sm flex items-center gap-2 font-bold text-xs"
                                            >
                                                <Edit3 size={16} />
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteBroadcast(notif.broadcastId || notif.id)}
                                                className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 rounded-xl transition-all shadow-sm flex items-center gap-2 font-bold text-xs"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-20 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center border-2 border-dashed border-slate-200">
                            {viewMode === 'INBOX' ? <Inbox size={48} className="text-slate-200" /> : <Send size={48} className="text-slate-200" />}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">
                                {viewMode === 'INBOX' ? 'No Notifications Found' : 'No Sent History Yet'}
                            </h3>
                            <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">
                                {viewMode === 'INBOX' ? 'Clean Slate Archive' : 'Broadcast your first alert today'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {isEditModalOpen && (
                <EditBroadcastModal 
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    broadcast={selectedBroadcast}
                    onSuccess={fetchNotifications}
                />
            )}
        </div>
    );
};

export default NotificationCenter;
