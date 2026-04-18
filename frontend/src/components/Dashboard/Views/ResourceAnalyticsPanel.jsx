import React, { useState, useEffect } from 'react';
import { 
    Activity, Building2, CheckCircle2, AlertCircle, 
    Calendar, RefreshCw, LayoutGrid, Layers, ArrowUpRight
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, Cell, PieChart, Pie, Legend 
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

    return (
        <div className="space-y-6 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Header & Refresh */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
                        <Activity size={18} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Infrastructure Intelligence</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time resource utilization metrics</p>
                    </div>
                </div>
                <button 
                    onClick={fetchAnalytics}
                    disabled={isRefreshing}
                    className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all hover:rotate-180 duration-500 disabled:opacity-50"
                >
                    <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div style={glassStyle} className="p-5 rounded-4xl group hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            <Building2 size={18} />
                        </div>
                        <ArrowUpRight size={14} className="text-slate-300" />
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

            {/* Simple Breakdown Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resources By Type - Horizontal Bar Chart */}
                <div style={glassStyle} className="p-6 rounded-[2.5rem] min-h-[350px]">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl">
                                <LayoutGrid size={16} />
                            </div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Resource Distribution</h3>
                        </div>
                    </div>
                    
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <BarChart 
                                layout="vertical" 
                                data={Object.entries(analytics.resourcesByType).map(([name, value]) => ({ 
                                    name: name.replace(/_/g, ' '), 
                                    value 
                                }))}
                                margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
                            >
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    axisLine={false}
                                    tickLine={false}
                                    width={80}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b', textTransform: 'uppercase' }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={12}>
                                    {Object.entries(analytics.resourcesByType).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Resources By Department - Donut Chart */}
                <div style={glassStyle} className="p-6 rounded-[2.5rem] min-h-[350px]">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
                            <Layers size={16} />
                        </div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Department Allocation</h3>
                    </div>

                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <PieChart>
                                <Pie
                                    data={Object.entries(analytics.resourcesByDepartment).map(([name, value]) => ({ 
                                        name: name.replace(/_/g, ' '), 
                                        value 
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {Object.entries(analytics.resourcesByDepartment).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend 
                                    layout="vertical" 
                                    align="right" 
                                    verticalAlign="middle"
                                    iconType="circle"
                                    formatter={(value) => (
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight ml-1">{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Metric */}
                        <div className="absolute top-1/2 left-[35%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <p className="text-xl font-black text-slate-800">{analytics.totalResources}</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase">Total</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceAnalyticsPanel;
