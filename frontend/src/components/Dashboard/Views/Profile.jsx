import React, { useState, useEffect } from 'react';
import { 
    Edit3, 
    CheckCircle2, 
    Settings,
    Shield,
    Mail,
    User as UserIcon,
    Award,
    Calendar,
    Sparkles,
    Phone,
    X,
    Save,
    Loader2
} from 'lucide-react';
import api from '../../../api/axiosConfig';
import toast from 'react-hot-toast';

const Profile = ({ user: initialUser }) => {
    const [user, setUser] = useState(initialUser);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialUser?.name || '',
        contactNumber: initialUser?.contactNumber || ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/auth/me');
                setUser(response.data);
                setFormData({
                    name: response.data.name,
                    contactNumber: response.data.contactNumber || ''
                });
            } catch (err) {
                console.error("Failed to fetch latest profile", err);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.put('/auth/me', formData);
            setUser(response.data);
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const glassStyle = {
        background: 'rgba(255,255,255,.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,0,0,.05)',
        borderRadius: 32,
        boxShadow: '0 8px 32px rgba(0,0,0,.04)'
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-4xl space-y-10">
            <div className="flex flex-col gap-2">
                <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Personal Profile</h2>
                <p className="text-slate-500 font-medium tracking-tight">Manage your digital campus identity and preferences</p>
            </div>
            
            <div className="space-y-10">
                {/* Profile Card */}
                <div style={glassStyle} className="bg-white/80 p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center md:items-start relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: 'linear-gradient(135deg,rgba(59,130,246,0.03),transparent)', borderRadius: '0 0 0 100%' }} />
                    
                    {!isEditing && (
                        <div className="absolute top-8 right-8 z-20">
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="p-4 bg-slate-900 text-white hover:bg-blue-600 rounded-2xl transition-all shadow-xl shadow-slate-900/10 hover:-translate-y-1 active:scale-95 group/edit"
                            >
                                <Edit3 className="w-5 h-5 group-hover/edit:rotate-12 transition-transform" />
                            </button>
                        </div>
                    )}

                    <div className="relative">
                        <div className="w-44 h-44 md:w-52 md:h-52 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white group-hover:rotate-2 transition-transform duration-700 relative z-10">
                            <img 
                                src={user?.profilePictureUrl || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=3b82f6&color=fff&size=400&bold=true&font-size=0.33`} 
                                className="w-full h-full object-cover"
                                alt="Profile"
                            />
                        </div>
                        <div className="absolute -bottom-4 -right-4 bg-emerald-500 border-[6px] border-[#f8fafc] p-3 rounded-3xl text-white shadow-xl z-20 animate-bounce-slow">
                            <CheckCircle2 size={24} />
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -top-4 -left-4 w-52 h-52 bg-blue-100 rounded-full blur-3xl opacity-30 -z-10 group-hover:scale-125 transition-transform duration-700" />
                    </div>

                    <div className="flex-1 space-y-8 text-center md:text-left relative z-10 w-full">
                        {isEditing ? (
                            <form onSubmit={handleUpdate} className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2 text-left">Full Identity Name</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                            <input 
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2 text-left">Contact Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                            <input 
                                                type="tel"
                                                value={formData.contactNumber}
                                                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                                placeholder="e.g. +94 77 123 4567"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button 
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 py-4 bg-blue-600 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        Secure Save
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({ name: user.name, contactNumber: user.contactNumber || '' });
                                        }}
                                        className="px-6 py-4 bg-slate-100 text-slate-500 font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                                        <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{user?.name}</h3>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-3 md:gap-6">
                                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 font-bold tracking-tight">
                                            <Mail size={16} className="text-slate-300" />
                                            <span>{user?.email}</span>
                                        </div>
                                        {user?.contactNumber && (
                                            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 font-bold tracking-tight">
                                                <Phone size={16} className="text-slate-300" />
                                                <span>{user.contactNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="py-2">
                                    <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50 group-hover:bg-white transition-colors duration-500">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1 text-left">Institutional Role</p>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100/50 rounded-xl text-blue-600">
                                                <Award size={18} />
                                            </div>
                                            <p className="font-extrabold text-slate-700 text-lg tracking-tight">{user?.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
