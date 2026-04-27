import React, { useState, useEffect } from 'react';
import { 
    Calendar, 
    Plus, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    AlertCircle, 
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    MapPin,
    Trash2,
    QrCode,
    X
} from 'lucide-react';
import bookingService from '../../../api/bookingService';
import BookingQRCode from '../../Booking/BookingQRCode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const navigate = useNavigate();

    const glassStyle = {
        background: 'rgba(255,255,255,.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,0,0,.05)',
        borderRadius: 24,
        boxShadow: '0 8px 24px rgba(0,0,0,.02)'
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await bookingService.getMyBookings();
            // Sort Priority: PENDING > APPROVED > REJECTED > CANCELLED
            const sorted = data.sort((a, b) => {
                const priority = { 'PENDING': 0, 'APPROVED': 1, 'REJECTED': 2, 'CANCELLED': 3 };
                if (priority[a.status] !== priority[b.status]) {
                    return priority[a.status] - priority[b.status];
                }
                return new Date(b.date) - new Date(a.date);
            });
            setBookings(sorted);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to load your reservations');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
        try {
            await bookingService.cancelBooking(id);
            toast.success('Reservation cancelled');
            fetchBookings();
        } catch (error) {
            toast.error('Failed to cancel reservation');
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'APPROVED': return { 
                label: 'Confirmed', 
                icon: CheckCircle2, 
                color: 'emerald', 
                bg: 'bg-emerald-500/10',
                text: 'text-emerald-600'
            };
            case 'REJECTED': return { 
                label: 'Declined', 
                icon: XCircle, 
                color: 'rose', 
                bg: 'bg-rose-500/10',
                text: 'text-rose-600'
            };
            case 'CANCELLED': return { 
                label: 'Cancelled', 
                icon: AlertCircle, 
                color: 'slate', 
                bg: 'bg-slate-500/10',
                text: 'text-slate-500'
            };
            default: return { 
                label: 'Pending', 
                icon: Clock, 
                color: 'amber', 
                bg: 'bg-amber-500/10',
                text: 'text-amber-600'
            };
        }
    };

    const filteredBookings = bookings.filter(b => {
        const matchesSearch = b.resourceName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving Reservations...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(59,130,246,.08)', border: '1px solid rgba(59,130,246,.12)', marginBottom: 12 }}>
                        <ArrowUpRight size={12} className="text-blue-600" />
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Bookings Hub</span>
                    </div>
                    <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
                        My <span className="text-blue-600">Bookings</span>
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium tracking-tight">Review and manage your campus facility requests.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            type="text"
                            placeholder="Find a booking..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all w-64 shadow-sm"
                        />
                    </div>
                    <button 
                        onClick={() => navigate('/resources')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center shadow-lg shadow-blue-500/20 transition-all active:scale-95 group"
                    >
                        <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                        New Reservation
                    </button>
                </div>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-3">
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => {
                    const isActive = statusFilter === f;
                    return (
                        <button
                            key={f}
                            onClick={() => setStatusFilter(f)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                                isActive 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30' 
                                : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200'
                            }`}
                        >
                            {f === 'ALL' ? 'Show All' : f}
                        </button>
                    );
                })}
            </div>

            {/* Bookings Grid */}
            {filteredBookings.length === 0 ? (
                <div style={glassStyle} className="p-20 text-center border-slate-100 bg-white/50">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No reservations found</h3>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm font-medium">You don't have any bookings matching your search yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBookings.map((booking) => {
                        const status = getStatusConfig(booking.status);
                        return (
                            <div 
                                key={booking.id} 
                                style={glassStyle} 
                                className="bg-white/80 border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-500 group flex flex-col h-full"
                            >
                                {/* Card Header */}
                                <div className="p-6 pb-4 border-b border-slate-50">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                                            <Calendar size={18} />
                                        </div>
                                        <div className={`inline-flex items-center px-2.5 py-1 rounded-lg border ${status.bg} ${status.text} border-transparent`}>
                                            <status.icon size={12} className="mr-1.5" />
                                            <span className="text-[9px] font-black uppercase tracking-widest leading-none mt-0.5">{status.label}</span>
                                        </div>
                                    </div>
                                    <h3 className="font-extrabold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors uppercase text-sm line-clamp-1" title={booking.resourceName}>
                                        {booking.resourceName}
                                    </h3>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                        {booking.resourceType?.replace(/_/g, ' ')}
                                    </span>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 space-y-4 flex-1">
                                    <div className="space-y-2">
                                        <div className="flex items-center text-slate-600 font-bold text-xs tracking-tight">
                                            <Calendar size={14} className="mr-3 text-slate-300" />
                                            {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center text-slate-500 font-bold text-[11px]">
                                            <Clock size={14} className="mr-3 text-slate-300" />
                                            {booking.startTime} - {booking.endTime}
                                        </div>
                                        {booking.resourceType !== 'EQUIPMENT' && (
                                            <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-[0.1em]">
                                                <ArrowUpRight size={14} className="mr-3 text-slate-200" />
                                                Attendees: {booking.attendees}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-slate-50">
                                        <p className="text-xs text-slate-500 font-medium italic leading-relaxed line-clamp-2" title={booking.purpose}>
                                            "{booking.purpose}"
                                        </p>
                                    </div>

                                    {/* Rejection Reason Panel */}
                                    {booking.status === 'REJECTED' && booking.rejectionReason && (
                                        <div className="mt-4 p-4 bg-rose-50 rounded-2xl border border-rose-100 animate-in fade-in zoom-in-95 duration-300">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <XCircle size={10} className="text-rose-400" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-rose-400">Rejection Reason</span>
                                            </div>
                                            <p className="text-rose-700 text-xs italic leading-snug font-medium">
                                                {booking.rejectionReason}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Card Footer Actions */}
                                <div className="p-6 pt-0 mt-auto">
                                    {booking.status === 'APPROVED' && (
                                        <button 
                                            onClick={() => setSelectedBooking(booking)}
                                            className="w-full py-3 mb-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group/qr"
                                        >
                                            <QrCode size={14} className="group-hover/qr:rotate-12 transition-transform" />
                                            View Digital Ticket
                                        </button>
                                    )}

                                    {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                                        <button 
                                            onClick={() => handleCancel(booking.id)}
                                            className="w-full py-3 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border border-transparent hover:border-rose-100 flex items-center justify-center gap-2 group/btn"
                                        >
                                            <Trash2 size={14} className="group-hover/btn:scale-110 transition-transform" />
                                            Cancel Reservation
                                        </button>
                                    )}
                                    {booking.status === 'REJECTED' || booking.status === 'CANCELLED' ? (
                                        <div className="w-full py-3 px-4 bg-slate-50/50 rounded-xl text-center">
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Record Closed</span>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* QR Code Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="relative w-full max-w-sm">
                        <button 
                            onClick={() => setSelectedBooking(null)}
                            className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
                        >
                            <X size={32} />
                        </button>
                        <BookingQRCode booking={selectedBooking} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookings;
