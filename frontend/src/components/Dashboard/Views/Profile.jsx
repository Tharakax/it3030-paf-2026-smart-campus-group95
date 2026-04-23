import React from 'react';
import { 
    Edit3, 
    CheckCircle2, 
    Settings,
    Shield,
    Mail,
    User as UserIcon,
    Award,
    Calendar,
    Sparkles
} from 'lucide-react';

const Profile = ({ user }) => {
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
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(59,130,246,.08)', border: '1px solid rgba(59,130,246,.12)', width: 'fit-content' }}>
                    <UserIcon size={12} className="text-blue-600" />
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Security & Identity</span>
                </div>
                <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Personal Profile</h2>
                <p className="text-slate-500 font-medium tracking-tight">Manage your digital campus identity and preferences</p>
            </div>
            
            <div className="space-y-10">
                {/* Profile Card */}
                <div style={glassStyle} className="bg-white/80 p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center md:items-start relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: 'linear-gradient(135deg,rgba(59,130,246,0.03),transparent)', borderRadius: '0 0 0 100%' }} />
                    
                    <div className="absolute top-8 right-8 z-20">
                        <button className="p-4 bg-slate-900 text-white hover:bg-blue-600 rounded-2xl transition-all shadow-xl shadow-slate-900/10 hover:-translate-y-1 active:scale-95 group/edit">
                            <Edit3 className="w-5 h-5 group-hover/edit:rotate-12 transition-transform" />
                        </button>
                    </div>

                    <div className="relative">
                        <div className="w-44 h-44 md:w-52 md:h-52 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white group-hover:rotate-2 transition-transform duration-700 relative z-10">
                            <img 
                                src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=3b82f6&color=fff&size=400&bold=true&font-size=0.33`} 
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

                    <div className="flex-1 space-y-8 text-center md:text-left relative z-10">
                        <div className="space-y-2">
                            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                                <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{user?.name}</h3>
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                    <Shield size={10} /> Active
                                </span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 font-bold tracking-tight">
                                <Mail size={16} className="text-slate-300" />
                                <span>{user?.email}</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-2">
                            <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50 group-hover:bg-white transition-colors duration-500">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Institutional Role</p>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100/50 rounded-xl text-blue-600">
                                        <Award size={18} />
                                    </div>
                                    <p className="font-extrabold text-slate-700 text-lg tracking-tight">{user?.role}</p>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50 group-hover:bg-white transition-colors duration-500">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Reference ID</p>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-200/50 rounded-xl text-slate-500">
                                        <Calendar size={18} />
                                    </div>
                                    <p className="font-black text-slate-700 text-lg font-mono uppercase tracking-tighter">IT-3030-2026</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                            {[
                                { text: 'Member since 2024', icon: Calendar },
                                { text: 'Identity Verified', icon: Shield },
                                { text: 'Full Resource Access', icon: Sparkles }
                            ].map((badge, i) => (
                                <span key={i} className="px-4 py-2 bg-white/50 text-slate-600 rounded-2xl text-[11px] font-bold border border-slate-100 shadow-sm hover:border-blue-200 transition-colors flex items-center gap-2">
                                    <badge.icon size={12} className="text-blue-500" />
                                    {badge.text}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Account Settings Placeholder */}
                <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[40px] p-16 text-center group hover:bg-slate-50 hover:border-blue-200 transition-all duration-500">
                    <div className="w-20 h-20 bg-slate-100 rounded-[30px] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-inner">
                        <Settings className="w-10 h-10 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h4 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Custom Preferences</h4>
                    <p className="text-slate-500 font-bold italic tracking-tight mb-8">Enhanced security and personalization controls coming soon.</p>
                    <button className="px-8 py-3 bg-slate-100 text-slate-400 font-black text-xs uppercase tracking-[0.2em] rounded-2xl border border-slate-200 cursor-not-allowed">
                        Coming Q3 2026
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
