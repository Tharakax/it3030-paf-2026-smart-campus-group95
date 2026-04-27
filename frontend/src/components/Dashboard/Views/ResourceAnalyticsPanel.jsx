import React, { useState, useEffect } from 'react';
import { 
    Activity, Building2, CheckCircle2, AlertCircle, 
    Calendar, RefreshCw, LayoutGrid, Layers, ArrowUpRight,
    Ticket, Clock, CheckCheck, Landmark, ClipboardList
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, Cell, PieChart, Pie, Legend,
    AreaChart, Area
} from 'recharts';
import axiosInstance from '../../../api/axiosConfig';
import bookingService from '../../../api/bookingService';

const ResourceAnalyticsPanel = () => {
    const [analytics, setAnalytics] = useState(null);
    const [ticketStats, setTicketStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
    const [bookingStats, setBookingStats] = useState({ total: 0, pending: 0, approved: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchAnalytics = async () => {
        setIsRefreshing(true);
        try {
            const [resourceRes, ticketRes, bookingRes] = await Promise.all([
                axiosInstance.get('/resources/analytics/summary'),
                axiosInstance.get('/tickets'),
                bookingService.getAllBookings().catch(() => bookingService.getMyBookings())
            ]);

            setAnalytics(resourceRes.data);
            
            // Process Tickets
            const tickets = ticketRes.data || [];
            setTicketStats({
                total: tickets.length,
                open: tickets.filter(t => t.status === 'OPEN').length,
                inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
                resolved: tickets.filter(t => t.status === 'RESOLVED').length,
                urgent: tickets.filter(t => t.priority === 'URGENT').length
            });

            // Process Bookings
            const bookings = bookingRes || [];
            setBookingStats({
                total: bookings.length,
                pending: bookings.filter(b => b.status === 'PENDING').length,
                approved: bookings.filter(b => b.status === 'APPROVED').length,
                upcoming: bookings.filter(b => new Date(b.date) >= new Date()).length
            });

            setError(null);
        } catch (err) {
            console.error("Analytics Error:", err);
            setError("Failed to synchronize campus data");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const CHART_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 backdrop-blur-md p-3 border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        {label || payload[0].name}
                    </p>
                    <p className="text-sm font-black text-slate-800">
                        {payload[0].value} <span className="text-[10px] text-slate-400 font-bold ml-1">Units</span>
                    </p>
                    {payload[0].payload.percentage && (
                        <p className="text-[9px] font-bold text-slate-500 mt-1">
                            {payload[0].payload.percentage}% of total
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-white/40 backdrop-blur-sm rounded-[3rem] border border-white/50 shadow-xl shadow-blue-50/50 mb-8 animate-in fade-in duration-500">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                    <Activity className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 text-blue-600 animate-pulse" />
                </div>
                <div className="mt-8 text-center">
                    <h3 className="text-lg font-black text-slate-800 tracking-tighter uppercase mb-2">Synchronizing Grid</h3>
                    <div className="flex items-center justify-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-4">Calibrating Campus Intelligence</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-rose-50 border border-rose-100 rounded-4xl text-center mb-8">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                <p className="text-rose-600 font-bold tracking-tight">{error}</p>
                <button 
                    onClick={fetchAnalytics}
                    className="mt-3 text-xs font-black uppercase tracking-widest text-rose-500 hover:text-rose-700 underline underline-offset-4"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    // Prepare data for horizontal bar chart
    const barData = Object.entries(analytics.resourcesByType).map(([name, value]) => ({
        name: name.replace(/_/g, ' '),
        value,
        percentage: ((value / analytics.totalResources) * 100).toFixed(1)
    }));

    // Prepare data for donut chart
    const pieData = Object.entries(analytics.resourcesByDepartment).map(([name, value]) => ({
        name: name.replace(/_/g, ' '),
        value,
        percentage: ((value / analytics.totalResources) * 100).toFixed(1)
    }));

    // Custom label for the donut center
    const renderCenterLabel = () => {
        return (
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-black"
            >
                <tspan x="50%" dy="-8" fontSize="24" fill="#1e293b">
                    {analytics.totalResources}
                </tspan>
                <tspan x="50%" dy="16" fontSize="9" fill="#64748b" letterSpacing="0.1em" fontWeight={700}>
                    TOTAL
                </tspan>
            </text>
        );
    };

    return (
        <div className="space-y-6 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Header with Title and Sync Button */}
            <div className="flex justify-between items-end px-1">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Campus Intelligence</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time infrastructure & operations overview</p>
                </div>
                <button 
                    onClick={fetchAnalytics}
                    disabled={isRefreshing}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-blue-600 hover:border-blue-100 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 group"
                >
                    <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Sync Grid</span>
                </button>
            </div>

            {/* Top Stat Grid - Essential Core Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Resources Card */}
                <div style={glassStyle} className="p-5 rounded-4xl group hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            <Building2 size={18} />
                        </div>
                        <div className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-black rounded-full uppercase">Assets</div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Facilities</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-black text-slate-800 tracking-tight">{analytics.totalResources}</p>
                        <span className="text-[10px] font-bold text-slate-400">Inventory</span>
                    </div>
                </div>

                {/* Tickets Card */}
                <div style={glassStyle} className="p-5 rounded-4xl group hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2.5 bg-rose-50 rounded-2xl text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                            <Ticket size={18} />
                        </div>
                        {ticketStats.urgent > 0 && (
                            <div className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[8px] font-black rounded-full uppercase animate-pulse">Critical</div>
                        )}
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Incident Tickets</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-black text-slate-800 tracking-tight">{ticketStats.open + ticketStats.inProgress}</p>
                        <span className="text-[10px] font-bold text-slate-400">Pending</span>
                    </div>
                </div>

                {/* Bookings Card */}
                <div style={glassStyle} className="p-5 rounded-4xl group hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <Calendar size={18} />
                        </div>
                        <div className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black rounded-full uppercase">Reservations</div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Upcoming Bookings</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-black text-slate-800 tracking-tight">{bookingStats.upcoming}</p>
                        <span className="text-[10px] font-bold text-slate-400">Scheduled</span>
                    </div>
                </div>

                {/* Active Support Card */}
                <div style={glassStyle} className="p-5 rounded-4xl group hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <Activity size={18} />
                        </div>
                        <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded-full uppercase">Operational</div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">System Health</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-black text-slate-800 tracking-tight">
                            {((analytics.activeResources / analytics.totalResources) * 100).toFixed(0)}%
                        </p>
                        <span className="text-[10px] font-bold text-slate-400">Up-time</span>
                    </div>
                </div>
            </div>

            {/* Secondary Operational Metrics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Distribution - Resource Types */}
                <div style={glassStyle} className="lg:col-span-2 p-6 rounded-[2.5rem] min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-md">
                                <LayoutGrid size={16} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Asset Distribution</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Inventory categorized by functional type</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                layout="vertical" 
                                data={barData}
                                margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                                barCategoryGap={10}
                            >
                                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    axisLine={false}
                                    tickLine={false}
                                    width={100}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={24} animationDuration={1000}>
                                    {barData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-slate-100/50">
                        {barData.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 group cursor-default">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                                <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase select-none">{item.name}</span>
                                <span className="text-[10px] font-black text-slate-300 ml-1">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modern Status Breakdown - Tickets & Operational Health */}
                <div style={glassStyle} className="p-6 rounded-[2.5rem] flex flex-col">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="p-2 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl shadow-md text-white">
                            <ClipboardList size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Operation Status</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Current throughput & health</p>
                        </div>
                    </div>

                    <div className="flex-1 space-y-5">
                        {/* Maintenance Pipeline Card */}
                        <div className="bg-slate-50/50 rounded-3xl p-4 border border-slate-100">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maintenance Pipe</span>
                                <span className="text-[10px] font-black text-rose-500">{ticketStats.urgent > 0 ? 'CRITICAL LOADS' : 'NORMAL LOAD'}</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-rose-400" />
                                        <span className="text-xs font-bold text-slate-600">Open Incidents</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-800">{ticketStats.open}</span>
                                </div>
                                <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="absolute top-0 left-0 h-full bg-rose-400 rounded-full transition-all duration-1000"
                                        style={{ width: `${(ticketStats.open / (ticketStats.total || 1)) * 100}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                                        <span className="text-xs font-bold text-slate-600">Active Repair</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-800">{ticketStats.inProgress}</span>
                                </div>
                                <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="absolute top-0 left-0 h-full bg-blue-400 rounded-full transition-all duration-1000"
                                        style={{ width: `${(ticketStats.inProgress / (ticketStats.total || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Booking Approval Card */}
                        <div className="bg-slate-50/50 rounded-3xl p-4 border border-slate-100">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Booking Workflow</span>
                                <span className="text-[10px] font-black text-emerald-500">{((bookingStats.approved / (bookingStats.total || 1)) * 100).toFixed(0)}% RATE</span>
                            </div>
                            <div className="flex items-end gap-2 mb-1">
                                <span className="text-xl font-black text-slate-800">{bookingStats.pending}</span>
                                <span className="text-[10px] font-bold text-slate-400 pb-1 uppercase tracking-tight">Pending Approval</span>
                            </div>
                            <p className="text-[9px] font-medium text-slate-500 leading-relaxed uppercase">Manual review required for system consistency</p>
                        </div>

                        {/* Resource Health Donut (Mini) */}
                        <div className="pt-4 mt-auto border-t border-slate-100 border-dashed">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Resource Availability</p>
                                    <p className="text-sm font-black text-slate-800 uppercase">{analytics.bookableResources} Bookable Areas</p>
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                                    <ArrowUpRight size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Department Allocation - Full Width Detailed View */}
            <div style={glassStyle} className="p-6 rounded-[2.5rem]">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-md text-white">
                            <Layers size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Departmental Hubs</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Resource allocation across university divisions</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total Depts</span>
                            <span className="text-xs font-black text-slate-800">{pieData.length}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={90}
                                    paddingAngle={6}
                                    dataKey="value"
                                    nameKey="name"
                                    animationDuration={1200}
                                >
                                    {pieData.map((_, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]}
                                            stroke="white"
                                            strokeWidth={4}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <text
                                    x="50%"
                                    y="50%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    <tspan x="50%" dy="-6" className="fill-slate-800 text-3xl font-black">
                                        {analytics.totalResources}
                                    </tspan>
                                    <tspan x="50%" dy="18" className="fill-slate-400 text-[8px] font-black uppercase tracking-[0.2em]">
                                        ASSETS
                                    </tspan>
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        {pieData.map((dept, idx) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-md" style={{ backgroundColor: CHART_COLORS[(idx + 2) % CHART_COLORS.length] }} />
                                    <span className="text-xs font-bold text-slate-500 uppercase truncate max-w-[120px]">{dept.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-slate-800">{dept.value}</span>
                                    <span className="text-[9px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">({dept.percentage}%)</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceAnalyticsPanel;