import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Calendar, Users, FileText, Search, Filter, MessageSquare, AlertCircle, Circle } from 'lucide-react';
import bookingService from '../../api/bookingService';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

const AdminBookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('PENDING_FIRST');

    const [activeTab, setActiveTab] = useState('PENDING');

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [bookings, searchTerm, statusFilter, typeFilter, sortBy, activeTab]);

    const fetchBookings = async () => {
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

    const applyFilters = () => {
        let result = [...bookings];

        // Tab Filter
        if (activeTab === 'PENDING') {
            result = result.filter(b => b.status === 'PENDING');
        } else if (activeTab === 'HISTORY') {
            result = result.filter(b => b.status !== 'PENDING');
        }

        // Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(b => 
                b.resourceName.toLowerCase().includes(term) || 
                b.userName.toLowerCase().includes(term) ||
                b.purpose.toLowerCase().includes(term)
            );
        }

        // Status Filter (within History tab)
        if (activeTab === 'HISTORY' && statusFilter !== 'ALL') {
            result = result.filter(b => b.status === statusFilter);
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

        setFilteredBookings(result);
    };

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
            case 'APPROVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'REJECTED': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'CANCELLED': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="space-y-4">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Booking Hub</h2>
                        <p className="text-slate-500 font-medium">Streamlined management of campus resources</p>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
                        <button 
                            onClick={() => setActiveTab('PENDING')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-tight transition-all ${activeTab === 'PENDING' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            Pending Requests ({bookings.filter(b => b.status === 'PENDING').length})
                        </button>
                        <button 
                            onClick={() => setActiveTab('HISTORY')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-tight transition-all ${activeTab === 'HISTORY' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            History / All
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Quick search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-64 shadow-inner"
                        />
                    </div>

                    {activeTab === 'HISTORY' && (
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    )}

                    <select 
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition"
                    >
                        <option value="ALL">All Resource Types</option>
                        <option value="LECTURE_HALL">Lecture Halls</option>
                        <option value="LAB">Laboratories</option>
                        <option value="EQUIPMENT">Equipment</option>
                        <option value="MEETING_ROOM">Meeting Rooms</option>
                    </select>

                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition"
                    >
                        <option value="NEWEST">Newest First</option>
                        <option value="OLDEST">Oldest First</option>
                        <option value="BOOKING_DATE">Booking Date</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing Booking Data...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="py-32 text-center">
                        <AlertCircle className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-slate-800 italic">"No bookings found matching your filters"</h3>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Resource / Type</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Requested By</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date & Time</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Details</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{booking.resourceName}</span>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{booking.resourceType?.replace(/_/g, ' ')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs mr-3 border border-blue-100">
                                                    {booking.userName.charAt(0)}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700">{booking.userName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <div className="flex items-center text-slate-700 font-bold text-sm">
                                                    <Calendar className="w-3 h-3 mr-2 text-slate-400" />
                                                    {new Date(booking.date).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center text-slate-500 font-medium text-[11px] mt-1">
                                                    <Clock className="w-3 h-3 mr-2 text-slate-400" />
                                                    {booking.startTime} - {booking.endTime}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="max-w-[200px]">
                                                <p className="text-xs text-slate-600 italic line-clamp-1 group-hover:line-clamp-none transition-all">"{booking.purpose}"</p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <Users className="w-3 h-3 text-slate-300" />
                                                    <span className="text-[10px] font-bold text-slate-500">
                                                        {booking.resourceType === 'EQUIPMENT' ? 'Count' : 'Att.'}: {booking.attendees}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase flex items-center w-fit ${getStatusStyle(booking.status)}`}>
                                                <Circle className={`w-1.5 h-1.5 mr-2 fill-current`} />
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {booking.status === 'PENDING' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleUpdateStatus(booking.id, 'APPROVED')}
                                                        className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleUpdateStatus(booking.id, 'REJECTED')}
                                                        className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                                                    Processed
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBookingManagement;
