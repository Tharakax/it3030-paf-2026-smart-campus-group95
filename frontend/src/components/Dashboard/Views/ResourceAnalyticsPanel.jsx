import React, { useState, useEffect } from 'react';
import { 
    Activity, Building2, CheckCircle2, AlertCircle, 
    Calendar, RefreshCw, LayoutGrid, Layers, ArrowUpRight
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, Area, RadarChart, PolarGrid, PolarAngleAxis,
    PolarRadiusAxis, Radar, Legend
} from 'recharts';
import axiosInstance from '../../../api/axiosConfig';

const ResourceAnalyticsPanel = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchAnalytics = async () => {
        setIsRefreshing(true);
        try {
            const response = await axiosInstance.get('/resources/analytics/summary');
            setAnalytics(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching resource analytics:', err);
            setError('Could not load infrastructure intelligence. Please try again.');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const CHART_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const LINE_GRADIENT_ID = 'lineGradient';
    const AREA_GRADIENT_ID = 'areaGradient';

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 backdrop-blur-md p-3 border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label || payload[0].name}</p>
                    <p className="text-sm font-black text-slate-800">
                        {payload[0].value} <span className="text-[10px] text-slate-400 font-bold ml-1">Units</span>
                    </p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-white/50 animate-pulse rounded-3xl border border-slate-100" />
                ))}
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

    // Prepare data for line chart (Resource Distribution)
    const lineData = Object.entries(analytics.resourcesByType).map(([name, value]) => ({
        name: name.replace(/_/g, ' '),
        value: value,
    }));

    // Prepare data for radar chart (Department Allocation)
    const radarData = Object.entries(analytics.resourcesByDepartment).map(([name, value]) => ({
        subject: name.replace(/_/g, ' '),
        value: value,
        fullMark: analytics.totalResources,
    }));

    return (
        <div className="space-y-6 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div style={glassStyle} className="p-5 rounded-4xl group hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            <Building2 size={18} />
                        </div>
                        <button 
                            onClick={fetchAnalytics}
                            disabled={isRefreshing}
                            className="p-1.5 hover:text-blue-600 transition-all hover:rotate-180 duration-500 disabled:opacity-50"
                        >
                            <RefreshCw size={12} className={isRefreshing ? 'animate-spin text-blue-600' : 'text-slate-300'} />
                        </button>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Assets</p>
                    <p className="text-2xl font-black text-slate-800 tracking-tight">{analytics.totalResources}</p>
                </div>

                <div style={glassStyle} className="p-5 rounded-4xl group hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <CheckCircle2 size={18} />
                        </div>
                        <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded-full uppercase">Online</div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Active Now</p>
                    <p className="text-2xl font-black text-slate-800 tracking-tight">{analytics.activeResources}</p>
                </div>

                <div style={glassStyle} className="p-5 rounded-4xl group hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2.5 bg-rose-50 rounded-2xl text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                            <AlertCircle size={18} />
                        </div>
                        <div className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[8px] font-black rounded-full uppercase">Alert</div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Out of Service</p>
                    <p className="text-2xl font-black text-slate-800 tracking-tight">{analytics.outOfServiceResources}</p>
                </div>

                <div style={glassStyle} className="p-5 rounded-4xl group hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <Calendar size={18} />
                        </div>
                        <div className="text-[10px] font-black text-blue-600">{(analytics.bookableResources / analytics.totalResources * 100).toFixed(0)}%</div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Bookable</p>
                    <p className="text-2xl font-black text-slate-800 tracking-tight">{analytics.bookableResources}</p>
                </div>
            </div>

            {/* New Chart Types Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resource Distribution - Line Chart with Area Fill */}
                <div style={glassStyle} className="p-6 rounded-[2.5rem] min-h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md">
                                <LayoutGrid size={16} className="text-white" />
                            </div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Resource Distribution</h3>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400">trend across types</span>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={lineData}
                                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                            >
                                <defs>
                                    <linearGradient id={LINE_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                                <XAxis 
                                    dataKey="name" 
                                    tick={{ fontSize: 9, fontWeight: 600, fill: '#64748b' }}
                                    tickLine={false}
                                    axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                                    interval={0}
                                    angle={-20}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis 
                                    tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#6366f1"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill={`url(#${LINE_GRADIENT_ID})`}
                                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#6366f1' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#6366f1"
                                    strokeWidth={2.5}
                                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-3 pt-2 border-t border-slate-100">
                        {lineData.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{item.name}: {item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Department Allocation - Radar Chart */}
                <div style={glassStyle} className="p-6 rounded-[2.5rem] min-h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-md">
                                <Layers size={16} className="text-white" />
                            </div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Department Allocation</h3>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400">balanced view</span>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart outerRadius={90} data={radarData}>
                                <PolarGrid stroke="#cbd5e1" strokeOpacity={0.5} />
                                <PolarAngleAxis 
                                    dataKey="subject" 
                                    tick={{ fontSize: 9, fontWeight: 600, fill: '#475569', textTransform: 'capitalize' }}
                                />
                                <PolarRadiusAxis 
                                    angle={30} 
                                    domain={[0, analytics.totalResources]} 
                                    tick={{ fontSize: 8, fill: '#94a3b8' }}
                                    axisLine={false}
                                />
                                <Radar
                                    name="Resources"
                                    dataKey="value"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fill="#10b981"
                                    fillOpacity={0.25}
                                    dot={{ r: 3, fill: '#10b981', stroke: '#fff', strokeWidth: 1 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend 
                                    wrapperStyle={{ fontSize: 9, fontWeight: 700, paddingTop: 8 }}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-slate-600 uppercase tracking-tight">{value}</span>}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-[9px] font-bold text-slate-400">
                            Total departments: {radarData.length} · Spread across campus
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceAnalyticsPanel;