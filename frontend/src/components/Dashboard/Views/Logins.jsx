import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, Search, Clock, User, Filter, ArrowUpDown, AlertTriangle } from 'lucide-react';
import adminService from '../../../api/adminService';
import { format } from 'date-fns';

const Logins = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('ALL'); // ALL, LOGIN, LOGOUT, LOGIN_FAILURE

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await adminService.getLoginLogs();
            setLogs(data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => {
        const userName = log.userName || '';
        const userId = log.userId || '';
        const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            userId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'ALL' || log.type === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Access Logs</h1>
                    <p className="text-slate-500 font-medium">Monitor user login and logout activities across the campus</p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={fetchLogs}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                    >
                        <ArrowUpDown size={20} />
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative col-span-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by user name or ID..."
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all font-medium text-slate-700 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <select
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all font-medium text-slate-700 shadow-sm appearance-none cursor-pointer"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="ALL">All Activities</option>
                        <option value="LOGIN">Logins Only</option>
                        <option value="LOGOUT">Logouts Only</option>
                        <option value="LOGIN_FAILURE">Login Failures Only</option>
                    </select>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Activity</th>
                                <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-5"><div className="h-10 bg-slate-100 rounded-xl w-48"></div></td>
                                        <td className="px-6 py-5"><div className="h-6 bg-slate-100 rounded-lg w-24"></div></td>
                                        <td className="px-6 py-5"><div className="h-6 bg-slate-100 rounded-lg w-32"></div></td>
                                        <td className="px-6 py-5"><div className="h-8 bg-slate-100 rounded-full w-20"></div></td>
                                    </tr>
                                ))
                            ) : filteredLogs.length > 0 ? (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                                                        {log.userName}
                                                    </p>
                                                    <p className="text-xs text-slate-400 font-medium">
                                                        {log.userId === 'N/A' ? 'Unregistered Attempt' : `ID: ${log.userId}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                {log.type === 'LOGIN' ? (
                                                    <LogIn size={18} className="text-emerald-500" />
                                                ) : log.type === 'LOGOUT' ? (
                                                    <LogOut size={18} className="text-amber-500" />
                                                ) : (
                                                    <AlertTriangle size={18} className="text-red-500" />
                                                )}
                                                <span className={`font-semibold ${log.type === 'LOGIN_FAILURE' ? 'text-red-600' : 'text-slate-700'}`}>
                                                    {log.type === 'LOGIN' ? 'Logged In' : log.type === 'LOGOUT' ? 'Logged Out' : 'Login Failed'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-slate-600 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-slate-400" />
                                                {format(new Date(log.timestamp), 'MMM dd, yyyy • HH:mm:ss')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${
                                                log.type === 'LOGIN' 
                                                ? 'bg-emerald-100 text-emerald-700' 
                                                : log.type === 'LOGOUT'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-red-100 text-red-700 border border-red-200'
                                            }`}>
                                                {log.type.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                <Search size={32} />
                                            </div>
                                            <p className="text-slate-500 font-bold text-lg">No activity logs found</p>
                                            <p className="text-slate-400 font-medium">Try adjusting your filters or search terms</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && filteredLogs.length > 0 && (
                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-sm text-slate-500 font-bold">
                            Showing {filteredLogs.length} activity records
                        </p>
                        <div className="flex gap-2">
                            {/* Pagination would go here if needed */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Logins;
