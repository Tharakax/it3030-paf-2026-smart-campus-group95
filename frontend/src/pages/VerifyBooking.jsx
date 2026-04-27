import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    CheckCircle2, 
    XCircle, 
    Calendar, 
    Clock, 
    User, 
    Building2, 
    ShieldCheck,
    AlertTriangle,
    ArrowLeft
} from 'lucide-react';
import bookingService from '../api/bookingService';

const VerifyBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const data = await bookingService.getBookingById(id);
                setBooking(data);
            } catch (err) {
                console.error('Error verifying booking:', err);
                setError('Invalid or expired booking ticket.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBooking();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
                <div className="w-16 h-16 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Authenticating Ticket...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="max-w-sm w-full bg-white rounded-[2.5rem] p-8 text-center shadow-xl border border-rose-100">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-10 h-10 text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Verification Failed</h2>
                    <p className="text-slate-500 mb-8 font-medium">{error}</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    const isApproved = booking.status === 'APPROVED';

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-sm mx-auto space-y-6">
                {/* Status Card */}
                <div className={`rounded-[2.5rem] p-8 text-center shadow-2xl border-4 ${
                    isApproved ? 'bg-emerald-50 border-emerald-500' : 'bg-amber-50 border-amber-400'
                } animate-in zoom-in-95 duration-500`}>
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                        isApproved ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}>
                        {isApproved ? (
                            <ShieldCheck className="w-12 h-12 text-white" />
                        ) : (
                            <AlertTriangle className="w-12 h-12 text-white" />
                        )}
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter mb-1 uppercase">
                        {isApproved ? 'Verified' : booking.status}
                    </h1>
                    <p className={`text-xs font-black uppercase tracking-[0.2em] ${
                        isApproved ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                        Booking Status Confirmation
                    </p>
                </div>

                {/* Details Card */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 space-y-6 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                        <div className="p-3 bg-blue-50 rounded-2xl">
                            <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight leading-tight uppercase truncate max-w-[200px]">
                                {booking.resourceName}
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {booking.resourceType?.replace(/_/g, ' ')}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-4 text-slate-600">
                            <User className="w-5 h-5 text-slate-300" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reserved For</p>
                                <p className="text-sm font-bold text-slate-800">{booking.userName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600">
                            <Calendar className="w-5 h-5 text-slate-300" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Booking Date</p>
                                <p className="text-sm font-bold text-slate-800">{new Date(booking.date).toLocaleDateString(undefined, { dateStyle: 'full' })}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600">
                            <Clock className="w-5 h-5 text-slate-300" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time Window</p>
                                <p className="text-sm font-bold text-slate-800">{booking.startTime} - {booking.endTime}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50">
                        <div className="bg-slate-50 rounded-2xl p-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Booking ID</p>
                            <p className="text-xs font-mono font-bold text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-100 shadow-xs">
                                {booking.id}
                            </p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => navigate('/')}
                    className="w-full py-4 bg-white hover:bg-slate-50 text-slate-400 rounded-2xl font-bold text-xs uppercase tracking-widest border border-slate-200 transition-all flex items-center justify-center gap-2"
                >
                    <ArrowLeft size={14} /> Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default VerifyBooking;
