import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Ticket, Calendar, Clock, MapPin, User, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BookingQRCode = ({ booking }) => {
    const qrRef = useRef(null);

    if (!booking) return null;

    // Construct the verification URL
    const verificationUrl = `${window.location.origin}/verify-booking/${booking.id}`;

    const downloadQRCode = () => {
        const canvas = qrRef.current.querySelector('canvas');
        if (!canvas) return;

        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Booking-Ticket-${booking.id.slice(-6).toUpperCase()}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Ticket downloaded successfully!');
    };

    return (
        <div className="flex flex-col items-center p-6 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-sm mx-auto animate-in zoom-in-95 duration-500">
            {/* Header / Brand */}
            <div className="w-full flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-600 rounded-xl">
                        <Ticket className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-black text-slate-800 tracking-tighter uppercase">Campus Pass</span>
                </div>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                </div>
            </div>

            {/* QR Code Container */}
            <div 
                ref={qrRef}
                className="p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 mb-8 relative group"
            >
                <QRCodeCanvas
                    value={verificationUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                    imageSettings={{
                        src: "/favicon.ico", // Attempt to include favicon or a small logo
                        x: undefined,
                        y: undefined,
                        height: 24,
                        width: 24,
                        excavate: true,
                    }}
                    className="rounded-xl shadow-sm"
                />
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors duration-300 rounded-[2rem]" />
            </div>

            {/* Ticket Details Section */}
            <div className="w-full space-y-4 mb-8 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight leading-tight uppercase truncate">
                        {booking.resourceName}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {booking.resourceType?.replace(/_/g, ' ')}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/60">
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" /> Date
                        </span>
                        <p className="text-xs font-bold text-slate-700">{new Date(booking.date).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> Time
                        </span>
                        <p className="text-xs font-bold text-slate-700">{booking.startTime}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-1.5">
                            <User className="w-3 h-3" /> Holder
                        </span>
                        <p className="text-xs font-bold text-slate-700 truncate">{booking.userName || 'Student'}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-1.5">
                            <MapPin className="w-3 h-3" /> ID
                        </span>
                        <p className="text-[10px] font-mono font-bold text-blue-600">#{booking.id.slice(-6).toUpperCase()}</p>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={downloadQRCode}
                className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-slate-200 hover:shadow-blue-500/20 active:scale-95 group"
            >
                <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                Download Pass
            </button>
            
            <p className="mt-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center px-4 leading-relaxed">
                Scan this code at the facility entrance for instant verification.
            </p>
        </div>
    );
};

export default BookingQRCode;
