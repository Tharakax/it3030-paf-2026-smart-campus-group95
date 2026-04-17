import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Calendar, 
    Clock, 
    Users, 
    FileText, 
    Send, 
    CheckCircle2, 
    XCircle, 
    Clock4, 
    AlertTriangle, 
    ArrowLeft, 
    Box,
    Sparkles,
    Info,
    MessageSquare,
    Trash2,
    CheckSquare
} from 'lucide-react';
import bookingService from '../api/bookingService';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Bookings = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    // Form State
    const [formData, setFormData] = useState({
        resourceId: location.state?.resourceId || '',
        resourceName: location.state?.resourceName || '',
        resourceType: location.state?.resourceType || '',
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        attendees: 1
    });

    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState(location.state?.resourceId ? 'create' : 'my');
    
    // Availability state
    const [busySlots, setBusySlots] = useState([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [resourceDetails, setResourceDetails] = useState(null);

    // Time slots generator (8:00 to 18:00)
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 8; hour <= 18; hour++) {
            const h = hour.toString().padStart(2, '0');
            slots.push(`${h}:00`);
            if (hour < 18) slots.push(`${h}:30`);
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        try {
            const data = await bookingService.getMyBookings();
            // Sort: PENDING first, then APPROVED, then date descending
            const sortedData = [...data].sort((a, b) => {
                const statusOrder = { 'PENDING': 0, 'APPROVED': 1, 'REJECTED': 2, 'CANCELLED': 3 };
                if (statusOrder[a.status] !== statusOrder[b.status]) {
                    return statusOrder[a.status] - statusOrder[b.status];
                }
                return new Date(b.date + 'T' + b.startTime) - new Date(a.date + 'T' + a.startTime);
            });
            setMyBookings(sortedData);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to load your bookings');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailability = async (resourceId, date) => {
        if (!resourceId || !date) return;
        setLoadingAvailability(true);
        try {
            const data = await bookingService.getAvailability(resourceId, date);
            setBusySlots(data);
        } catch (error) {
            console.error('Error fetching availability:', error);
        } finally {
            setLoadingAvailability(false);
        }
    };

    useEffect(() => {
        if (formData.date && formData.resourceId) {
            fetchAvailability(formData.resourceId, formData.date);
        }
    }, [formData.date, formData.resourceId]);

    useEffect(() => {
        const fetchResource = async () => {
            if (formData.resourceId) {
                try {
                    // Assuming we have a getResourceById in a resourceService, 
                    // but for now I'll check if I can fetch it or if I should add it.
                    // Actually, let's use a generic fetch since I don't want to break if service is missing.
                    const response = await fetch(`/api/resources/${formData.resourceId}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    const data = await response.json();
                    setResourceDetails(data);
                } catch (error) {
                    console.error('Error fetching resource details:', error);
                }
            }
        };
        fetchResource();
    }, [formData.resourceId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate time sequence
        if (formData.startTime >= formData.endTime) {
            toast.error('Booking end time must be after the start time');
            return;
        }

        setSubmitting(true);
        try {
            await bookingService.createBooking({
                resourceId: formData.resourceId,
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                purpose: formData.purpose,
                attendees: parseInt(formData.attendees)
            });
            toast.success('Booking request submitted successfully!');
            setActiveTab('my');
            fetchMyBookings();
            // Reset form but keep resource info if needed
            setFormData(prev => ({
                ...prev,
                date: '',
                startTime: '',
                endTime: '',
                purpose: '',
                attendees: 1
            }));
        } catch (error) {
            console.error('Booking error:', error);
            const message = error.response?.data?.message || 'Failed to submit booking request';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        
        try {
            await bookingService.cancelBooking(id);
            toast.success('Booking cancelled');
            fetchMyBookings();
        } catch (error) {
            toast.error('Failed to cancel booking');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'CANCELLED': return 'bg-slate-50 text-slate-500 border-slate-100';
            default: return 'bg-amber-50 text-amber-600 border-amber-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return <Clock className="w-3.5 h-3.5 mr-1.5" />;
            case 'APPROVED': return <CheckSquare className="w-3.5 h-3.5 mr-1.5" />;
            case 'REJECTED': return <XCircle className="w-3.5 h-3.5 mr-1.5" />;
            case 'CANCELLED': return <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />;
            default: return null;
        }
    };

    const glass = {
        background: 'rgba(255,255,255,.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,0,0,.05)',
        borderRadius: 24,
        boxShadow: '0 8px 24px rgba(0,0,0,.02)'
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 pt-24 relative overflow-hidden">
             {/* Animated Orbs (Background layer) */}
             <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{
                    position: 'absolute', top: '10%', left: '5%',
                    width: 520, height: 520,
                    background: 'radial-gradient(circle,rgba(59,130,246,0.03) 0%,transparent 70%)',
                    borderRadius: '50%', filter: 'blur(60px)'
                }} />
                <div style={{
                    position: 'absolute', bottom: '10%', right: '5%',
                    width: 420, height: 420,
                    background: 'radial-gradient(circle,rgba(99,102,241,0.03) 0%,transparent 70%)',
                    borderRadius: '50%', filter: 'blur(60px)'
                }} />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(59,130,246,.08)', border: '1px solid rgba(59,130,246,.1)', marginBottom: 12 }}>
                            <Calendar size={12} className="text-blue-600" />
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Facility Hub</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">Booking Management</h1>
                        <p className="mt-2 text-slate-500 font-medium tracking-tight">Request and manage your facility bookings</p>
                    </div>
                    
                    <div style={glass} className="flex p-1.5 self-start shadow-sm border-slate-100">
                        <button 
                            onClick={() => setActiveTab('my')}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'my' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                        >
                            My Bookings
                        </button>
                        <button 
                            onClick={() => setActiveTab('create')}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'create' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                        >
                            New Request
                        </button>
                    </div>
                </div>

                {activeTab === 'create' ? (
                    <div style={glass} className="bg-white/70 border-white/40 shadow-xl shadow-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 md:p-12">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                    {/* Left Column: Resource & Purpose */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Selected Resource</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Box className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={formData.resourceName || 'No resource selected'}
                                                    disabled
                                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200/60 rounded-2xl text-slate-600 font-bold focus:ring-0 cursor-not-allowed"
                                                />
                                            </div>
                                            {!formData.resourceId && (
                                                <button 
                                                    type="button"
                                                    onClick={() => navigate('/resources')}
                                                    className="mt-3 text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center transition-colors px-1"
                                                >
                                                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Select from catalogue
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Purpose of Booking</label>
                                            <div className="relative group">
                                                <div className="absolute top-4 left-4 pointer-events-none">
                                                    <FileText className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                                </div>
                                                <textarea
                                                    name="purpose"
                                                    required
                                                    value={formData.purpose}
                                                    onChange={handleInputChange}
                                                    placeholder="E.g., Research Lab session, Group presentation..."
                                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200/60 rounded-2xl text-slate-700 font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all min-h-35 appearance-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                                                {formData.resourceType === 'EQUIPMENT' ? 'Quantity / Count' : 'Expected Attendees'}
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Users className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                                </div>
                                                <input
                                                    type="number"
                                                    name="attendees"
                                                    min="1"
                                                    required
                                                    value={formData.attendees}
                                                    onChange={handleInputChange}
                                                    placeholder={formData.resourceType === 'EQUIPMENT' ? 'Enter quantity' : 'Number of attendees'}
                                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200/60 rounded-2xl text-slate-700 font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Time & Date */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Booking Date</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                                </div>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    required
                                                    min={new Date().toISOString().split('T')[0]}
                                                    value={formData.date}
                                                    onChange={handleInputChange}
                                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200/60 rounded-2xl text-slate-700 font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Start Time</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Clock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                                    </div>
                                                    <select
                                                        name="startTime"
                                                        required
                                                        value={formData.startTime}
                                                        onChange={handleInputChange}
                                                        className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200/60 rounded-2xl text-slate-700 font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Select</option>
                                                        {timeSlots.map(slot => (
                                                            <option key={slot} value={slot}>{slot}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">End Time</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Clock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                                    </div>
                                                    <select
                                                        name="endTime"
                                                        required
                                                        value={formData.endTime}
                                                        onChange={handleInputChange}
                                                        className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200/60 rounded-2xl text-slate-700 font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Select</option>
                                                        {timeSlots.map(slot => (
                                                            <option key={slot} value={slot}>{slot}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Availability / Busy Slots Indicator */}
                                        {formData.date && (
                                            <div className="mt-4 p-5 bg-blue-50/30 rounded-2xl border border-blue-100/50">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-3 flex items-center">
                                                    <Clock4 className="w-3.5 h-3.5 mr-2" />
                                                    Daily Occupancy
                                                </h4>
                                                {loadingAvailability ? (
                                                    <div className="flex items-center text-[11px] text-slate-400 font-bold italic animate-pulse">
                                                        Fetching occupancy data...
                                                    </div>
                                                ) : busySlots.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {busySlots.map((slot, i) => (
                                                            <span key={i} className="px-3 py-1 bg-white text-rose-500 border border-rose-100 rounded-lg text-[10px] font-bold shadow-sm">
                                                                {slot.startTime} - {slot.endTime}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-[11px] text-emerald-600 font-bold italic flex items-center gap-1.5">
                                                        <Sparkles size={12} /> Resource is completely free!
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Operational Hours Hint */}
                                        {resourceDetails && (
                                            <div className="mt-4 flex items-center gap-2 p-3 bg-slate-50/50 rounded-xl border border-slate-100/50 text-[10px] font-bold text-slate-500">
                                                <Info className="w-3.5 h-3.5 text-blue-500" />
                                                <span>Active Window: <span className="text-slate-700">{resourceDetails.availabilityStartTime} - {resourceDetails.availabilityEndTime}</span></span>
                                                <span className="mx-1">•</span>
                                                <span>Capacity: <span className="text-slate-700">{resourceDetails.capacity} {formData.resourceType === 'EQUIPMENT' ? 'Units' : 'Seats'}</span></span>
                                            </div>
                                        )}

                                        <div className="bg-slate-900 p-6 rounded-2xl border border-white/10 mt-8 relative overflow-hidden group">
                                            <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(59,130,246,.05))', pointerEvents: 'none' }} />
                                            <div className="flex items-start gap-4 relative z-10">
                                                <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                                                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                                    Your request will be queued for administrator approval. Notifications will be triggered upon status changes.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <button
                                        type="submit"
                                        disabled={submitting || !formData.resourceId}
                                        className={`w-full flex items-center justify-center py-5 px-6 rounded-2xl font-black text-xl tracking-tight transition-all duration-500 relative overflow-hidden group ${
                                            submitting || !formData.resourceId
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xl shadow-blue-500/25 hover:-translate-y-1 active:scale-[0.98]'
                                        }`}
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="animate-spin w-6 h-6 border-4 border-white/30 border-t-white rounded-full mr-3"></div>
                                                Transmitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                                                Confirm Booking Request
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                <div className="animate-spin w-12 h-12 border-4 border-blue-600/10 border-t-blue-600 rounded-full"></div>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving secure records</p>
                            </div>
                        ) : myBookings.length === 0 ? (
                            <div style={glass} className="bg-white/70 p-20 text-center border-slate-100 shadow-sm">
                                <div className="w-24 h-24 bg-slate-50/50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <Calendar className="w-12 h-12 text-slate-200" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">No Active Bookings</h3>
                                <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">You haven't initiated any resource reservation requests yet.</p>
                                <button 
                                    onClick={() => navigate('/resources')}
                                    className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black tracking-tight hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:-translate-y-1"
                                >
                                    Explore Catalogue
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {myBookings.map((booking) => (
                                    <div key={booking.id} style={glass} className="bg-white/80 border-slate-100 p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden">
                                        <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: 'linear-gradient(135deg,rgba(59,130,246,0.02),transparent)', borderRadius: '0 0 0 100%' }} />
                                        
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center backdrop-blur-sm ${getStatusStyle(booking.status)}`}>
                                                {getStatusIcon(booking.status)}
                                                {booking.status}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none bg-slate-50/80 px-3 py-2 rounded-lg border border-slate-100 group-hover:bg-white group-hover:text-slate-500 transition-colors">
                                                {new Date(booking.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        
                                        <h3 className="text-2xl font-extrabold text-slate-800 mb-5 group-hover:text-blue-600 transition-colors tracking-tight">
                                            {booking.resourceName}
                                        </h3>

                                        <div className="space-y-4 mb-10">
                                            <div className="flex items-center text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50 group-hover:bg-white transition-colors">
                                                <Calendar className="w-4 h-4 mr-3.5 text-blue-500/70" />
                                                <span className="font-bold text-slate-700">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50 group-hover:bg-white transition-colors">
                                                <Clock className="w-4 h-4 mr-3.5 text-blue-500/70" />
                                                <span className="font-bold text-slate-700">{booking.startTime} - {booking.endTime}</span>
                                            </div>
                                            <div className="flex items-start text-slate-600 bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 group-hover:bg-white transition-colors italic">
                                                <MessageSquare className="w-4 h-4 mr-3.5 text-slate-300 mt-0.5 shrink-0" />
                                                <span className="text-sm font-medium leading-relaxed">"{booking.purpose}"</span>
                                            </div>
                                        </div>

                                        {booking.status === 'REJECTED' && booking.rejectionReason && (
                                            <div className="mb-8 p-5 bg-rose-50/50 rounded-2xl border border-rose-100/50">
                                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.15em] mb-2 px-1">Reason for Rejection</p>
                                                <p className="text-rose-700 text-sm italic font-medium leading-relaxed">"{booking.rejectionReason}"</p>
                                            </div>
                                        )}

                                        {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                                            <button 
                                                onClick={() => handleCancel(booking.id)}
                                                className="w-full py-4 text-slate-400 hover:text-rose-600 font-bold text-sm bg-slate-50/50 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100 flex items-center justify-center gap-2 group/cancel"
                                            >
                                                <Trash2 size={14} className="group-hover/cancel:scale-110 transition-transform" />
                                                Cancel This Booking
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;
