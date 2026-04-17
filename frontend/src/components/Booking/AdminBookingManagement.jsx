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

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [bookings, searchTerm, statusFilter, typeFilter, sortBy]);

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

        // Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(b => 
                b.resourceName.toLowerCase().includes(term) || 
                b.userName.toLowerCase().includes(term) ||
                b.purpose.toLowerCase().includes(term)
            );
        }

        // Status Filter
        if (statusFilter !== 'ALL') {
            result = result.filter(b => b.status === statusFilter);
        }

        // Type Filter
        if (typeFilter !== 'ALL') {
            result = result.filter(b => b.resourceType === typeFilter);
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'PENDING_FIRST') {
                if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
                if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortBy === 'NEWEST') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortBy === 'OLDEST') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else if (sortBy === 'BOOKING_DATE') {
                return new Date(a.date) - new Date(b.date);
            }
            return 0;
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
                inputAttributes: {
                    'aria-label': 'Type your reason here'
                },
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

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'REJECTED': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'CANCELLED': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Booking Management</h2>
                    <p className="text-slate-500 font-medium">Review and manage site-wide facility requests</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search resource, user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-64 shadow-sm"
                        />
                    </div>

                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setStatusFilter(filter)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                                    statusFilter === filter ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <select 
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
                    >
                        <option value="ALL">All Types</option>
                        <option value="LECTURE_HALL">Lecture Halls</option>
                        <option value="LAB">Laboratories</option>
                        <option value="EQUIPMENT">Equipment</option>
                        <option value="MEETING_ROOM">Meeting Rooms</option>
                    </select>

                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
                    >
                        <option value="PENDING_FIRST">Priority: Pending</option>
                        <option value="NEWEST">Latest Submitted</option>
                        <option value="OLDEST">Oldest Submitted</option>
                        <option value="BOOKING_DATE">Booking Date</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-100">
                    <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Booking Vault...</p>
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
                    <AlertCircle className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-slate-800">No records found</h3>
                    <p className="text-slate-500 font-medium mt-2">Adjust your filters or check back later for new requests.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 pb-12">
                    {filteredBookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-[1.5rem] border border-slate-100 p-5 shadow-sm hover:shadow-lg hover:shadow-blue-500/5 transition-all group overflow-hidden relative flex flex-col">
                            {/* Status Accent Bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                                booking.status === 'APPROVED' ? 'bg-emerald-500' : 
                                booking.status === 'REJECTED' ? 'bg-rose-500' : 
                                booking.status === 'CANCELLED' ? 'bg-slate-400' : 'bg-amber-400'
                            }`} />

                            <div className="flex items-start justify-between mb-5">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase flex items-center ${getStatusBadge(booking.status)}`}>
                                            <Circle className="w-1.5 h-1.5 mr-1.5 fill-current" />
                                            {booking.status}
                                        </span>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded">
                                            {booking.resourceType?.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                                        {booking.resourceName}
                                    </h3>
                                    <div className="flex items-center text-slate-500 text-[11px] font-bold">
                                        <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center mr-2 text-[9px] text-slate-400 font-black">
                                            {booking.userName.charAt(0)}
                                        </div>
                                        {booking.userName}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/50">
                                    <div className="flex items-center text-slate-400 mb-0.5">
                                        <Calendar className="w-3 h-3 mr-1.5" />
                                        <span className="text-[8px] font-bold uppercase tracking-widest">Date</span>
                                    </div>
                                    <p className="font-extrabold text-slate-700 text-xs">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                </div>
                                <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/50">
                                    <div className="flex items-center text-slate-400 mb-0.5">
                                        <Clock className="w-3 h-3 mr-1.5" />
                                        <span className="text-[8px] font-bold uppercase tracking-widest">Time</span>
                                    </div>
                                    <p className="font-extrabold text-slate-700 text-xs">{booking.startTime}</p>
                                </div>
                            </div>

                            <div className="mb-5 flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <MessageSquare className="w-3.5 h-3.5 text-slate-300" />
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Purpose</span>
                                </div>
                                <p className="text-slate-600 text-xs italic font-medium line-clamp-2 leading-relaxed">"{booking.purpose}"</p>
                                
                                <div className="mt-3 flex items-center gap-2">
                                    <Users className="w-3.5 h-3.5 text-slate-300" />
                                    <span className="text-[10px] font-bold text-slate-500">
                                        {booking.resourceType === 'EQUIPMENT' ? 'Quantity:' : 'Attendees:'} 
                                        <span className="text-slate-800 ml-1">{booking.attendees}</span>
                                    </span>
                                </div>
                            </div>

                            {booking.status === 'PENDING' && (
                                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => handleUpdateStatus(booking.id, 'APPROVED')}
                                        className="flex-1 flex items-center justify-center py-2.5 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-emerald-700 shadow-md shadow-emerald-500/10 transition-all hover:-translate-y-0.5"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(booking.id, 'REJECTED')}
                                        className="flex-1 flex items-center justify-center py-2.5 bg-white text-rose-600 border border-rose-100 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-rose-50 transition-all"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}

                            {booking.status === 'REJECTED' && (
                                <div className="pt-3 border-t border-slate-100 mt-auto">
                                    <div className="flex items-center text-rose-500 text-[9px] font-black uppercase tracking-widest italic justify-center">
                                        Request Declined
                                    </div>
                                </div>
                            )}

                            {booking.status === 'APPROVED' && (
                                <div className="pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-center text-emerald-600 font-black text-xs uppercase tracking-[0.2em] italic">
                                        Resource Reserved Successfully
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )
            }
        </div>
    );
};

export default AdminBookingManagement;
