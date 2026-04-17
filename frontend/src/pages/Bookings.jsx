import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, FileText, Send, CheckCircle2, XCircle, Clock4, AlertTriangle, ArrowLeft, Box } from 'lucide-react';
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

    // Time slots generator (8:00 to 18:00 by default, or wider if needed)
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 8; hour <= 20; hour++) {
            const h = hour.toString().padStart(2, '0');
            slots.push(`${h}:00`);
            if (hour < 20) slots.push(`${h}:30`);
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
            case 'APPROVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'REJECTED': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'CANCELLED': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle2 className="w-4 h-4 mr-1" />;
            case 'REJECTED': return <XCircle className="w-4 h-4 mr-1" />;
            case 'CANCELLED': return <AlertTriangle className="w-4 h-4 mr-1" />;
            default: return <Clock4 className="w-4 h-4 mr-1" />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Booking Management</h1>
                        <p className="mt-2 text-slate-500">Request and manage your facility bookings</p>
                    </div>
                    
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm self-start">
                        <button 
                            onClick={() => setActiveTab('my')}
                            className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'my' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            My Bookings
                        </button>
                        <button 
                            onClick={() => setActiveTab('create')}
                            className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'create' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            New Request
                        </button>
                    </div>
                </div>

                {activeTab === 'create' ? (
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 md:p-12">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column: Resource & Purpose */}
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Selected Resource</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Box className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={formData.resourceName || 'No resource selected'}
                                                    disabled
                                                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 font-semibold focus:ring-0 cursor-not-allowed"
                                                />
                                            </div>
                                            {!formData.resourceId && (
                                                <button 
                                                    type="button"
                                                    onClick={() => navigate('/resources')}
                                                    className="mt-3 text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center"
                                                >
                                                    <ArrowLeft className="w-4 h-4 mr-1" /> Select a resource from catalogue
                                                </button>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Purpose of Booking</label>
                                            <div className="relative">
                                                <div className="absolute top-4 left-4 pointer-events-none">
                                                    <FileText className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <textarea
                                                    name="purpose"
                                                    required
                                                    value={formData.purpose}
                                                    onChange={handleInputChange}
                                                    placeholder="E.g., Research Lab session, Group presentation..."
                                                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition min-h-[120px]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                                                {formData.resourceType === 'EQUIPMENT' ? 'Quantity / Count' : 'Expected Attendees'}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Users className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <input
                                                    type="number"
                                                    name="attendees"
                                                    min="1"
                                                    required
                                                    value={formData.attendees}
                                                    onChange={handleInputChange}
                                                    placeholder={formData.resourceType === 'EQUIPMENT' ? 'Enter quantity' : 'Number of attendees'}
                                                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Time & Date */}
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Booking Date</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Calendar className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    required
                                                    min={new Date().toISOString().split('T')[0]}
                                                    value={formData.date}
                                                    onChange={handleInputChange}
                                                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Start Time</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Clock className="h-5 w-5 text-slate-400" />
                                                    </div>
                                                    <select
                                                        name="startTime"
                                                        required
                                                        value={formData.startTime}
                                                        onChange={handleInputChange}
                                                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                                                    >
                                                        <option value="">Select</option>
                                                        {timeSlots.map(slot => (
                                                            <option key={slot} value={slot}>{slot}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">End Time</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Clock className="h-5 w-5 text-slate-400" />
                                                    </div>
                                                    <select
                                                        name="endTime"
                                                        required
                                                        value={formData.endTime}
                                                        onChange={handleInputChange}
                                                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
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
                                            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center">
                                                    <Clock4 className="w-3 h-3 mr-2 text-blue-500" />
                                                    Busy Slots for this Day
                                                </h4>
                                                {loadingAvailability ? (
                                                    <div className="flex items-center text-[10px] text-slate-400 font-bold italic">
                                                        Checking availability...
                                                    </div>
                                                ) : busySlots.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {busySlots.map((slot, i) => (
                                                            <span key={i} className="px-2 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded text-[10px] font-bold">
                                                                {slot.startTime} - {slot.endTime}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-[10px] text-emerald-600 font-bold italic">
                                                        No bookings yet. Entire day is available!
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Operational Hours Hint */}
                                        {resourceDetails && (
                                            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                                <Box className="w-3 h-3 text-slate-300" />
                                                Operational Hours: {resourceDetails.availabilityStartTime} - {resourceDetails.availabilityEndTime} 
                                                | Max {formData.resourceType === 'EQUIPMENT' ? 'Count' : 'Capacity'}: {resourceDetails.capacity}
                                            </div>
                                        )}

                                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mt-8">
                                            <div className="flex items-start">
                                                <AlertTriangle className="w-5 h-5 text-blue-600 mt-1 mr-3 shrink-0" />
                                                <p className="text-sm text-blue-800 leading-relaxed italic">
                                                    * Your booking will be submitted for approval. You will receive a notification once an admin reviews your request.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={submitting || !formData.resourceId}
                                        className={`w-full flex items-center justify-center py-5 px-6 rounded-2xl font-black text-xl tracking-tight transition-all duration-300 ${
                                            submitting || !formData.resourceId
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/30 hover:-translate-y-1 active:scale-95'
                                        }`}
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="animate-spin w-6 h-6 border-4 border-white border-t-transparent rounded-full mr-3"></div>
                                                Processing Request...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-6 h-6 mr-3" /> Confirm Booking Request
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
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                                <p className="text-slate-500 font-bold">Retrieving your bookings...</p>
                            </div>
                        ) : myBookings.length === 0 ? (
                            <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Calendar className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">No bookings yet</h3>
                                <p className="text-slate-500 mb-8 max-w-sm mx-auto">You haven't made any resource requests. Explore the catalogue to get started.</p>
                                <button 
                                    onClick={() => navigate('/resources')}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                                >
                                    Browse Resources
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {myBookings.map((booking) => (
                                    <div key={booking.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase flex items-center ${getStatusStyle(booking.status)}`}>
                                                {getStatusIcon(booking.status)}
                                                {booking.status}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                                {new Date(booking.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">
                                            {booking.resourceName}
                                        </h3>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center text-slate-600">
                                                <Calendar className="w-4 h-4 mr-3 text-slate-400" />
                                                <span className="font-semibold">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center text-slate-600">
                                                <Clock className="w-4 h-4 mr-3 text-slate-400" />
                                                <span className="font-semibold">{booking.startTime} - {booking.endTime}</span>
                                            </div>
                                            <div className="flex items-center text-slate-600">
                                                <FileText className="w-4 h-4 mr-3 text-slate-400" />
                                                <span className="text-sm italic">"{booking.purpose}"</span>
                                            </div>
                                        </div>

                                        {booking.status === 'REJECTED' && booking.rejectionReason && (
                                            <div className="mb-6 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                                                <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">Reason for Rejection</p>
                                                <p className="text-rose-700 text-sm italic">{booking.rejectionReason}</p>
                                            </div>
                                        )}

                                        {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                                            <button 
                                                onClick={() => handleCancel(booking.id)}
                                                className="w-full py-3 text-slate-500 hover:text-rose-600 font-bold text-sm bg-slate-50 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                                            >
                                                Cancel Booking
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
