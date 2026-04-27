import React, { useState, useEffect, useMemo } from 'react';
import { 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Calendar, 
    Users, 
    FileText, 
    Search, 
    Filter, 
    MessageSquare, 
    AlertCircle, 
    Circle,
    Activity,
    ChevronDown,
    X,
    Building2,
    CalendarDays,
    Clock4,
    Hash,
    User,
    MoreHorizontal
} from 'lucide-react';
import bookingService from '../../api/bookingService';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

const AdminBookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('NEWEST');
    const [showFilters, setShowFilters] = useState(false);

    const [activeTab, setActiveTab] = useState('PENDING');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await bookingService.getAllBookings();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = useMemo(() => {
        let result = [...bookings];

        // Tab Filter
        if (activeTab === 'PENDING') {
            result = result.filter(b => b.status === 'PENDING');
        } else if (activeTab === 'APPROVED') {
            result = result.filter(b => b.status === 'APPROVED');
        } else if (activeTab === 'REJECTED') {
            result = result.filter(b => b.status === 'REJECTED');
        }

        // Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(b => 
                b.resourceName.toLowerCase().includes(term) || 
                b.userName.toLowerCase().includes(term) ||
                b.purpose.toLowerCase().includes(term) ||
                (b.bookingCode && b.bookingCode.toLowerCase().includes(term))
            );
        }

        // Type Filter
        if (typeFilter !== 'ALL') {
            result = result.filter(b => b.resourceType === typeFilter);
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'NEWEST') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortBy === 'OLDEST') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else if (sortBy === 'BOOKING_DATE') {
                return new Date(a.date) - new Date(b.date);
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return result;
    }, [bookings, searchTerm, typeFilter, sortBy, activeTab]);

    const stats = useMemo(() => ({
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'PENDING').length,
        approved: bookings.filter(b => b.status === 'APPROVED').length,
        rejected: bookings.filter(b => b.status === 'REJECTED').length,
    }), [bookings]);

    const handleUpdateStatus = async (id, status) => {
        if (status === 'REJECTED') {
            const { value: reason } = await Swal.fire({
                title: 'Reject Booking',
                input: 'textarea',
                inputLabel: 'Reason for rejection',
                inputPlaceholder: 'Type your reason here...',
                showCancelButton: true,
                confirmButtonColor: '#e11d48',
                confirmButtonText: 'Reject Booking',
                background: '#ffffff',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-xl font-bold px-6 py-3',
                    cancelButton: 'rounded-xl font-bold px-6 py-3 text-slate-500'
                }
            });

            if (reason) {
                try {
                    await bookingService.updateBookingStatus(id, 'REJECTED', reason);
                    toast.success('Booking rejected');
                    fetchBookings();
                } catch (error) {
                    toast.error('Failed to update booking');
                }
            }
        } else if (status === 'CANCELLED') {
            const confirm = await Swal.fire({
                title: 'Cancel Approved Booking?',
                text: "This will revoke the user's access to the resource.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#475569',
                confirmButtonText: 'Yes, Cancel it',
                background: '#ffffff',
                customClass: {
                    popup: 'rounded-2xl'
                }
            });

            if (confirm.isConfirmed) {
                try {
                    await bookingService.updateBookingStatus(id, 'CANCELLED');
                    toast.success('Booking cancelled');
                    fetchBookings();
                } catch (error) {
                    toast.error('Failed to cancel booking');
                }
            }
        } else {
            const confirm = await Swal.fire({
                title: 'Approve Booking?',
                text: "The resource will be reserved for this user.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#059669',
                confirmButtonText: 'Yes, Approve',
                background: '#ffffff',
                customClass: {
                    popup: 'rounded-2xl'
                }
            });

            if (confirm.isConfirmed) {
                try {
                    await bookingService.updateBookingStatus(id, 'APPROVED');
                    toast.success('Booking approved');
                    fetchBookings();
                } catch (error) {
                    toast.error('Failed to update booking');
                }
            }
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'REJECTED': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'CANCELLED': return 'bg-slate-50 text-slate-700 border-slate-100';
            default: return 'bg-amber-50 text-amber-700 border-amber-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle2 className="w-3.5 h-3.5" />;
            case 'REJECTED': return <XCircle className="w-3.5 h-3.5" />;
            default: return <Clock className="w-3.5 h-3.5" />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter">
                        Booking <span className="text-blue-600 underline decoration-emerald-400 decoration-4">Hub</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Streamlined management of campus resources</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'All Requests', value: stats.total, state: 'ALL', icon: Activity, color: 'indigo' },
                    { label: 'Pending', value: stats.pending, state: 'PENDING', icon: Clock, color: 'amber' },
                    { label: 'Approved', value: stats.approved, state: 'APPROVED', icon: CheckCircle2, color: 'emerald' },
                    { label: 'Rejected', value: stats.rejected, state: 'REJECTED', icon: XCircle, color: 'rose' },
                ].map((stat) => (
                    <button
                        key={stat.label}
                        onClick={() => setActiveTab(stat.state)}
                        className={`p-5 rounded-3xl border transition-all duration-300 flex items-center space-x-4 ${
                            activeTab === stat.state 
                            ? 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-100 text-white' 
                            : 'bg-white border-slate-100 hover:border-indigo-200 shadow-sm text-slate-600'
                        }`}
                    >
                        <div className={`p-3 rounded-2xl ${activeTab === stat.state ? 'bg-white/20' : 'bg-slate-50'}`}>
                            <stat.icon className={`w-5 h-5 ${activeTab === stat.state ? 'text-white' : `text-${stat.color}-600`}`} />
                        </div>
                        <div className="text-left">
                            <p className={`text-[10px] font-black uppercase tracking-widest ${activeTab === stat.state ? 'text-white/70' : 'text-slate-400'}`}>
                                {stat.label}
                            </p>
                            <p className="text-xl font-black">{stat.value}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Command Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by resource, user, or purpose..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-5 py-3.5 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-2xl text-sm font-medium transition-all shadow-sm"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`inline-flex items-center gap-2 px-5 py-3.5 text-sm font-bold rounded-2xl transition-all border shadow-sm ${
                            showFilters || typeFilter !== 'ALL' || sortBy !== 'NEWEST'
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                        {(typeFilter !== 'ALL' || sortBy !== 'NEWEST') && (
                            <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                    </button>
                </div>
            </div>

            {/* Expandable Filter Panel */}
            {showFilters && (
                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-xl shadow-slate-200/50 animate-in zoom-in-95 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Resource Type</label>
                            <div className="relative">
                                <select 
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition cursor-pointer"
                                >
                                    <option value="ALL">All Types</option>
                                    <option value="LECTURE_HALL">Lecture Halls</option>
                                    <option value="LAB">Laboratories</option>
                                    <option value="EQUIPMENT">Equipment</option>
                                    <option value="MEETING_ROOM">Meeting Rooms</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sort By</label>
                            <div className="relative">
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition cursor-pointer"
                                >
                                    <option value="NEWEST">Newest Request</option>
                                    <option value="OLDEST">Oldest Request</option>
                                    <option value="BOOKING_DATE">Booking Date</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex items-end flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    setTypeFilter('ALL');
                                    setSortBy('NEWEST');
                                    setSearchTerm('');
                                }}
                                className="px-5 py-3 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* List Section */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="relative">
                        <div className="animate-spin w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full opacity-20"></div>
                        <div className="animate-spin w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full absolute top-0 left-0"></div>
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-6">Synchronizing Booking Data...</p>
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">No bookings found</h3>
                    <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                    {filteredBookings.map((booking) => (
                        <div 
                            key={booking.id}
                            className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 hover:-translate-y-1.5 transition-all duration-500"
                        >
                            {/* Card Header */}
                            <div className="p-6 pb-4 flex items-start justify-between border-b border-slate-50">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-xl ${getStatusStyle(booking.status)} bg-opacity-10 border-none`}>
                                            <Building2 className="w-5 h-5 shadow-sm" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-black text-slate-800 line-clamp-1">{booking.resourceName}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{booking.resourceType?.replace(/_/g, ' ')}</p>
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100 shadow-sm ${getStatusStyle(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 py-5 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                            <User className="w-3 h-3" /> Requester
                                        </span>
                                        <p className="text-xs font-bold text-slate-700 truncate">{booking.userName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                            <CalendarDays className="w-3 h-3" /> Date
                                        </span>
                                        <p className="text-xs font-bold text-slate-700 truncate">{new Date(booking.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                            <Clock4 className="w-3 h-3" /> Time
                                        </span>
                                        <p className="text-xs font-bold text-slate-700 truncate">{booking.startTime} - {booking.endTime}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                            <Hash className="w-3 h-3" /> Booking ID
                                        </span>
                                        <p className="text-[10px] font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md w-fit truncate">
                                            #{booking.id.slice(-6).toUpperCase()}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-2">
                                        <FileText className="w-3 h-3" /> Purpose
                                    </span>
                                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                        {booking.purpose}
                                    </p>
                                </div>

                                {booking.status === 'REJECTED' && booking.rejectionReason && (
                                    <div className="pt-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-1.5 mb-2">
                                            <AlertCircle className="w-3 h-3" /> Rejection Reason
                                        </span>
                                        <p className="text-xs text-rose-600 leading-relaxed font-bold bg-rose-50/50 p-3 rounded-xl border border-rose-100 italic">
                                            "{booking.rejectionReason}"
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Card Footer Actions */}
                            {booking.status === 'PENDING' && (
                                <div className="px-6 pb-6 pt-2 flex items-center gap-3">
                                    <button
                                        onClick={() => handleUpdateStatus(booking.id, 'APPROVED')}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-200"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(booking.id, 'REJECTED')}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-xs font-bold rounded-xl transition-all"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            )}

                            {booking.status === 'APPROVED' && (
                                <div className="px-6 pb-6 pt-2">
                                    <button
                                        onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-600 text-xs font-bold rounded-xl transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel Approved Booking
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminBookingManagement;
