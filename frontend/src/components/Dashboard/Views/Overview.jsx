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
    ShieldCheck 
} from 'lucide-react';

const Overview = ({ user, message }) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">
                        Hello, {user?.name?.split(' ')[0] || 'Student'}! 👋
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium">Here's what's happening on your campus today.</p>
                </div>
                <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">System Secure</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Active Bookings', value: '4', icon: Calendar, color: 'blue', detail: 'Next: Study Room 204' },
                    { label: 'Open Tickets', value: '2', icon: Ticket, color: 'indigo', detail: '1 urgent priority' },
                    { label: 'Uni-Points', value: '1,250', icon: ArrowUpRight, color: 'emerald', detail: '+120 this week' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 bg-${stat.color}-50 rounded-xl text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <p className="text-3xl font-black text-slate-800 mb-1">{stat.value}</p>
                        <p className="text-xs text-slate-500 font-medium flex items-center">
                            <Clock size={12} className="mr-1" />
                            {stat.detail}
                        </p>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-blue-600" />
                            Recent Activity
                        </h3>
                        <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View All</button>
                    </div>
                    <div className="p-8 space-y-6">
                        {[
                            { title: 'Room Reservation Confirmed', time: '2 hours ago', type: 'booking', status: 'success' },
                            { title: 'WiFi Connectivity Issue Reported', time: '5 hours ago', type: 'ticket', status: 'pending' },
                            { title: 'Library Book Due Reminder', time: 'Yesterday', type: 'alert', status: 'info' }
                        ].map((act, i) => (
                            <div key={i} className="flex items-center group cursor-pointer">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-slate-50 group-hover:bg-blue-50 transition-colors`}>
                                    {act.status === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
                                </div>
                                <div className="flex-1 border-b border-slate-50 pb-4 group-last:border-0">
                                    <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{act.title}</p>
                                    <p className="text-xs text-slate-400 font-medium">{act.time}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Message / Connection */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <Server size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                    <Server className="w-5 h-5 text-indigo-400" />
                                </div>
                                <span className="text-xs font-bold tracking-widest uppercase opacity-70">Server Handshake</span>
                            </div>
                            <div className="space-y-4">
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
