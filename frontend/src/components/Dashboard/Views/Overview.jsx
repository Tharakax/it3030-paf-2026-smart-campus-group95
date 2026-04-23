import React from 'react';
import { 
    Calendar, 
    Ticket, 
    ArrowUpRight, 
    Clock, 
    Activity, 
    CheckCircle2, 
    AlertCircle, 
    ChevronRight, 
    Server, 
    Plus, 
    ShieldCheck,
    Sparkles,
    Bell,
    TrendingUp
} from 'lucide-react';

const Overview = ({ user, message }) => {
    const glassStyle = {
        background: 'rgba(255,255,255,.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,0,0,.05)',
        borderRadius: 24,
        boxShadow: '0 8px 24px rgba(0,0,0,.02)'
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(59,130,246,.08)', border: '1px solid rgba(59,130,246,.12)', marginBottom: 12 }}>
                        <Sparkles size={12} className="text-blue-600" />
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Member Analytics</span>
                    </div>
                    <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
                        Hello, <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{user?.name?.split(' ')[0] || 'Student'}</span>! 👋
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium tracking-tight">Your campus activity at a glance.</p>
                </div>
                <div style={glassStyle} className="flex items-center space-x-3 bg-white/70 px-5 py-3 border-slate-100 shadow-sm self-start group hover:border-blue-200 transition-colors">
                    <div className="relative">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Session Status</span>
                        <span className="text-xs font-bold text-slate-700">Protected Connection</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Active Bookings', value: '4', icon: Calendar, color: 'blue', detail: 'Next: Study Room 204', bg: 'rgba(59,130,246,.1)' },
                    { label: 'Open Tickets', value: '2', icon: Ticket, color: 'indigo', detail: '1 urgent priority', bg: 'rgba(99,102,241,.1)' },
                    { label: 'Uni-Points', value: '1,250', icon: TrendingUp, color: 'emerald', detail: '+120 this week', bg: 'rgba(16,185,129,.1)' }
                ].map((stat, i) => (
                    <div key={i} style={glassStyle} className="bg-white/80 p-6 border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
                        <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: `linear-gradient(135deg,${stat.bg},transparent)`, borderRadius: '0 0 0 100%' }} />
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div style={{ background: stat.bg }} className={`p-3.5 rounded-2xl text-${stat.color}-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm`}>
                                <stat.icon size={22} />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{stat.label}</span>
                        </div>
                        <p className="text-4xl font-extrabold text-slate-800 mb-2 relative z-10 tracking-tight">{stat.value}</p>
                        <p className="text-[11px] text-slate-500 font-bold flex items-center relative z-10 px-0.5">
                            <Clock size={12} className="mr-2 text-slate-300 group-hover:text-blue-500 transition-colors" />
                            {stat.detail}
                        </p>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div style={glassStyle} className="lg:col-span-2 bg-white/70 border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                    <div className="px-8 py-6 border-b border-slate-100/50 flex justify-between items-center bg-slate-50/30">
                        <h3 className="font-extrabold text-slate-800 flex items-center tracking-tight">
                            <div className="p-2 bg-blue-50 rounded-lg mr-3">
                                <Activity className="w-4 h-4 text-blue-600" />
                            </div>
                            Recent Activity
                        </h3>
                        <button className="text-[11px] font-black text-blue-500 hover:text-blue-700 uppercase tracking-widest transition-colors flex items-center gap-1">
                            Full History <ChevronRight size={14} />
                        </button>
                    </div>
                    <div className="p-8 space-y-7">
                        {[
                            { title: 'Room Reservation Confirmed', time: '2 hours ago', type: 'booking', status: 'success' },
                            { title: 'WiFi Connectivity Issue Reported', time: '5 hours ago', type: 'ticket', status: 'pending' },
                            { title: 'Library Book Due Reminder', time: 'Yesterday', type: 'alert', status: 'info' }
                        ].map((act, i) => (
                            <div key={i} className="flex items-center group/item cursor-pointer">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-5 transition-all duration-300 ${act.status === 'success' ? 'bg-emerald-50 group-hover/item:bg-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-200' : 'bg-amber-50 group-hover/item:bg-amber-500 group-hover:shadow-lg group-hover:shadow-amber-200'}`}>
                                    {act.status === 'success' ? 
                                        <CheckCircle2 className={`w-5 h-5 transition-colors duration-300 ${act.status === 'success' ? 'text-emerald-500 group-hover/item:text-white' : 'text-amber-500 group-hover/item:text-white'}`} /> : 
                                        <AlertCircle className={`w-5 h-5 transition-colors duration-300 ${act.status === 'success' ? 'text-emerald-500 group-hover/item:text-white' : 'text-amber-500 group-hover/item:text-white'}`} />
                                    }
                                </div>
                                <div className="flex-1 border-b border-slate-100/60 pb-5 group-last:border-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm font-extrabold text-slate-700 group-hover/item:text-blue-600 transition-colors tracking-tight">{act.title}</p>
                                        <div className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-[9px] font-black text-slate-400 uppercase tracking-tighter opacity-0 group-hover/item:opacity-100 transition-opacity">
                                            {act.type}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 font-bold tracking-tight">{act.time}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-200 group-hover/item:translate-x-1 group-hover/item:text-blue-500 transition-all ml-3" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Message / Connection */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl shadow-slate-300 relative overflow-hidden group">
                        <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700">
                            <Server size={140} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="p-2.5 bg-blue-500/20 rounded-xl border border-white/10 backdrop-blur-md">
                                    <Bell className="w-4 h-4 text-blue-400" />
                                </div>
                                <span className="text-[10px] font-black tracking-[0.25em] uppercase opacity-60">System Notification</span>
                            </div>
                            <div className="space-y-5">
                                <p className="text-sm font-mono text-indigo-300">GET /api/users/dashboard</p>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                                    <p className="text-emerald-400 font-bold mb-2 text-xs uppercase tracking-tighter">Response Payload:</p>
                                    <p className="text-blue-100 text-sm leading-relaxed italic">
                                        "{message || 'Waiting for heartbeat...'}"
                                    </p>
                                </div>
                                <div className="flex items-center text-[10px] font-bold text-slate-400 mt-4 space-x-3">
                                    <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1" /> HTTP 200</span>
                                    <span>V1.0.4-STABLE</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between group cursor-pointer overflow-hidden relative">
                        <div className="relative z-10">
                            <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Upcoming Event</p>
                            <h4 className="font-bold text-lg">Tech Symposium 2026</h4>
                            <p className="text-xs opacity-70 mt-1">Tomorrow, 10:00 AM @ Hall A</p>
                        </div>
                        <Plus className="w-8 h-8 opacity-40 group-hover:scale-125 group-hover:rotate-90 transition-all duration-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
