import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Clock, 
    Users, 
    Info, 
    Box, 
    Edit, 
    Trash2,
    Sparkles,
    Calendar,
    ChevronRight,
    MapPin,
    CheckCircle2,
    XCircle,
    Compass
} from 'lucide-react';
import axiosInstance from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

/* ─── Inline styles (CSS-in-JS) ──────────────────────────────── */
const css = `
  @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(.95)} }
  @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,40px) scale(.9)} 66%{transform:translate(20px,-20px) scale(1.05)} }
  @keyframes orb3 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,30px) scale(1.08)} 66%{transform:translate(-40px,-10px) scale(.92)} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  
  .details-root *{box-sizing:border-box;font-family:'Outfit',sans-serif}
  .details-root h1,.details-root h2,.details-root h3{font-family:'Sora',sans-serif}
  .anim-0{animation:fadeSlideUp .7s ease both}
  .anim-1{animation:fadeSlideUp .7s .15s ease both}
  .anim-2{animation:fadeSlideUp .7s .3s ease both}
  
  .glass-panel{
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 24px;
  }
`;

const ResourceDetails = ({ resourceId, onClose }) => {
    const { id: paramId } = useParams();
    const id = resourceId || paramId;
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [resource, setResource] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const glass = {
        background: 'rgba(255,255,255,.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,0,0,.08)',
        borderRadius: 24
    };

    useEffect(() => {
        const fetchResource = async () => {
            try {
                const response = await axiosInstance.get(`/resources/${id}`);
                setResource(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching resource details:', err);
                setError('Could not find the requested resource.');
            } finally {
                setLoading(false);
            }
        };

        fetchResource();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: '#f8fafc' }}>
                <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Synchronizing Details...</p>
            </div>
        );
    }

    if (error || !resource) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#f8fafc' }}>
                <div style={glass} className="max-w-md w-full p-8 text-center border-rose-500/10 bg-white">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/5 flex items-center justify-center border border-rose-500/10">
                        <XCircle className="w-10 h-10 text-rose-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Resource Missing</h3>
                    <p className="text-slate-500 mb-6">{error || 'Resource not found'}</p>
                    <button 
                        onClick={() => onClose ? onClose() : navigate('/resources')}
                        className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
                    >
                        <Compass className="w-4 h-4" /> Back to Catalogue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="details-root" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg,#f8fafc 0%,#f1f5f9 40%,#e2e8f0 70%,#f8fafc 100%)',
            position: 'relative',
            overflowX: 'hidden'
        }}>
            <style>{css}</style>

            {/* ── Animated Orbs ─────────────────────────────────── */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{
                    position: 'absolute', top: '8%', left: '5%',
                    width: 520, height: 520,
                    background: 'radial-gradient(circle,rgba(59,130,246,.06) 0%,transparent 70%)',
                    borderRadius: '50%', animation: 'orb1 18s ease-in-out infinite'
                }} />
                <div style={{
                    position: 'absolute', top: '30%', right: '3%',
                    width: 420, height: 420,
                    background: 'radial-gradient(circle,rgba(99,102,241,.05) 0%,transparent 70%)',
                    borderRadius: '50%', animation: 'orb2 22s ease-in-out infinite'
                }} />
                <div style={{
                    position: 'absolute', bottom: '10%', left: '35%',
                    width: 360, height: 360,
                    background: 'radial-gradient(circle,rgba(6,182,212,.04) 0%,transparent 70%)',
                    borderRadius: '50%', animation: 'orb3 15s ease-in-out infinite'
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(0,0,0,.01) 1px,transparent 1px), linear-gradient(90deg,rgba(0,0,0,.01) 1px,transparent 1px)',
                    backgroundSize: '60px 60px'
                }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' }}>
                
                {/* ── Navigation ────────────────────────────────────── */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-10 anim-0">
                    <button 
                        onClick={() => onClose ? onClose() : navigate('/resources')}
                        className="group flex items-center px-4 py-2 bg-white/50 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl transition-all font-semibold shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Catalogue
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* ── Left Column: Media ──────────────────────────── */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-6 anim-1">
                        <div style={glass} className="overflow-hidden border-slate-200/50 shadow-xl bg-white/50">
                            {/* Main Gallery */}
                            <div className="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                                {resource.imageUrls && resource.imageUrls.length > 0 ? (
                                    <>
                                        <img 
                                            src={resource.imageUrls[activeImage]} 
                                            alt={resource.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
                                        
                                        {/* Image Counter Badge */}
                                        <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/80 backdrop-blur-xl rounded-full border border-slate-200/50 text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] shadow-sm">
                                            REF: {resource.resourceCode} • IMG {activeImage + 1}/{resource.imageUrls.length}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-20">
                                        <Box size={60} className="text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-400 font-semibold">No media available</p>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {resource.imageUrls?.length > 1 && (
                                <div className="p-4 bg-white/30 border-t border-slate-100 flex gap-3 overflow-x-auto no-scrollbar">
                                    {resource.imageUrls.map((url, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(index)}
                                            className={`relative shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                                activeImage === index 
                                                ? 'border-blue-500 scale-105 ring-4 ring-blue-500/10'
                                                : 'border-white opacity-60 hover:opacity-100 hover:scale-105 shadow-sm'
                                            }`}
                                        >
                                            <img src={url} alt="Thumb" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description Panel */}
                        <div style={glass} className="p-8 border-slate-200/50 bg-white/50">
                            <div className="flex items-center gap-3 mb-6">
                                <Info className="text-blue-500" size={20} />
                                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Facility Overview</h2>
                            </div>
                            <p className="text-slate-600 text-lg leading-relaxed font-['Outfit']">
                                {resource.description || 'No detailed description provided for this campus resource.'}
                            </p>
                        </div>
                    </div>

                    {/* ── Right Column: Info & Booking ─────────────────── */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-6 anim-2">
                        
                        {/* Status & Identity Card */}
                        <div style={glass} className="p-8 border-slate-200/50 bg-white/60">
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <div className="px-3 py-1 bg-blue-500/5 border border-blue-500/10 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-widest">
                                    {resource.type.replace(/_/g, ' ')}
                                </div>
                                <div className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest border ${
                                    resource.status === 'ACTIVE' 
                                    ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600' 
                                    : 'bg-rose-500/5 border-rose-500/10 text-rose-600'
                                }`}>
                                    • {resource.status.replace(/_/g, ' ')}
                                </div>
                            </div>
                            
                            <h1 className="text-4xl font-black text-slate-800 mb-6 leading-tight tracking-tight">
                                {resource.name}
                            </h1>

                            <div className="space-y-4 pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <MapPin size={18} className="text-slate-400" />
                                        <span className="text-slate-500 font-semibold text-sm">Target Faculty</span>
                                    </div>
                                    <span className="text-slate-700 font-bold text-sm tracking-tight">
                                        {resource.department?.replace(/_/g, ' ') || 'General Campus'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <Users size={18} className="text-slate-400" />
                                        <span className="text-slate-500 font-semibold text-sm">Capacity</span>
                                    </div>
                                    <span className="text-slate-700 font-bold text-sm">
                                        {resource.capacity} Students
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Availability & Booking */}
                        <div style={glass} className="p-8 border-blue-500/10 bg-linear-to-br from-blue-500/5 to-white/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none" />
                            
                            <div className="flex items-center gap-3 mb-8">
                                <Clock className="text-blue-500" size={20} />
                                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Operational Hours</h2>
                            </div>

                            <div className="space-y-4 mb-10">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 font-medium">Daily Availability</span>
                                    <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl border border-slate-200/50 shadow-sm">
                                        <span className="text-slate-800 font-black text-lg">{resource.availabilityStartTime}</span>
                                        <span className="text-slate-400 font-bold text-sm">to</span>
                                        <span className="text-slate-800 font-black text-lg">{resource.availabilityEndTime}</span>
                                    </div>
                                </div>
                            </div>

                            {user?.role === 'USER' && (
                                resource.bookable ? (
                                    <button
                                        onClick={() => navigate('/bookings', { state: { resourceId: id, resourceName: resource.name } })}
                                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-3 group"
                                    >
                                        <Calendar size={20} />
                                        Book Now
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <div className="p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl text-center">
                                        <span className="text-rose-500 font-bold text-sm tracking-tight flex items-center justify-center gap-2">
                                            <XCircle size={16} /> Facility is for reference only
                                        </span>
                                    </div>
                                )
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceDetails;
