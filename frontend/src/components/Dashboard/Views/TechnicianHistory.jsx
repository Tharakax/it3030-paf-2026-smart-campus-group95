import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
    History,
    Search,
    Filter,
    Loader2,
    CheckCircle2,
    ChevronDown,
    X,
    ShieldAlert,
    BarChart3,
    Calendar,
    Tag,
    User,
    ChevronRight,
    Building2,
    Clock,
    XCircle,
    Archive
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import TechnicianTicketDetails from '../Tickets/TechnicianTicketDetails';

const TechnicianHistory = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicketId, setSelectedTicketId] = useState(null);

    // Filtering & Search State
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await api.get('/tickets');
            setTickets(res.data);
        } catch (err) {
            toast.error('Failed to load history logs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const openTicket = (id) => setSelectedTicketId(id);
    const closeTicket = () => setSelectedTicketId(null);

    // Filter tickets for terminal states assigned to current technician
    const historicalTickets = useMemo(() => {
        return tickets.filter(ticket => {
            const isAssignedToMe = ticket.assignedTo === user?.id;
            const isTerminal = ['RESOLVED', 'CLOSED'].includes(ticket.status);
            
            if (!isAssignedToMe || !isTerminal) return false;

            const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
            const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter;

            const ticketDate = new Date(ticket.updatedAt || ticket.createdAt).toISOString().split('T')[0];
            const matchesDateFrom = !dateFrom || ticketDate >= dateFrom;
            const matchesDateTo = !dateTo || ticketDate <= dateTo;

            const matchesSearch = !searchQuery || 
                ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (ticket.ticketId && ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase())) ||
                ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.category.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesStatus && matchesPriority && matchesDateFrom && matchesDateTo && matchesSearch;
        }).sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    }, [tickets, statusFilter, priorityFilter, dateFrom, dateTo, searchQuery, user?.id]);

    const stats = useMemo(() => {
        const myTerminal = tickets.filter(t => t.assignedTo === user?.id && ['RESOLVED', 'CLOSED', 'REJECTED'].includes(t.status));
        return {
            total: myTerminal.length,
            resolved: myTerminal.filter(t => t.status === 'RESOLVED').length,
            closed: myTerminal.filter(t => t.status === 'CLOSED').length
        };
    }, [tickets, user?.id]);

    const handleClearFilters = () => {
        setStatusFilter('ALL');
        setPriorityFilter('ALL');
        setDateFrom('');
        setDateTo('');
        setSearchQuery('');
    };

    const hasActiveFilters = statusFilter !== 'ALL' || priorityFilter !== 'ALL' || dateFrom || dateTo || searchQuery;

    if (selectedTicketId) {
        return (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <TechnicianTicketDetails
                    ticketId={selectedTicketId}
                    onClose={closeTicket}
                    onUpdate={fetchTickets}
                />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center">
                    Work History
                    <span className="ml-3 px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-xl border border-slate-200">
                        Archive Logs
                    </span>
                </h1>
                <p className="text-slate-500 mt-1 font-medium">Review your completed maintenance cycles and resolved incidents.</p>
            </div>

            {/* History Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                <div className="p-4 rounded-3xl border bg-white border-slate-100 shadow-sm flex items-center space-x-4">
                    <div className="p-2.5 rounded-2xl bg-indigo-50">
                        <Archive className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Total History</p>
                        <p className="text-xl font-black text-slate-800">{stats.total}</p>
                    </div>
                </div>

                <div className="p-4 rounded-3xl border bg-white border-slate-100 shadow-sm flex items-center space-x-4">
                    <div className="p-2.5 rounded-2xl bg-emerald-50">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Jobs Resolved</p>
                        <p className="text-xl font-black text-slate-800">{stats.resolved}</p>
                    </div>
                </div>

                <div className="p-4 rounded-3xl border bg-white border-slate-100 shadow-sm flex items-center space-x-4">
                    <div className="p-2.5 rounded-2xl bg-blue-50">
                        <BarChart3 className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Finalized</p>
                        <p className="text-xl font-black text-slate-800">{stats.closed}</p>
                    </div>
                </div>
            </div>

            {/* Advanced Command Bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                {/* Global Search */}
                <div className="relative flex-1 group min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search history logs by ID, category, or description..."
                        className="w-full pl-11 pr-5 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-2xl text-sm font-medium text-slate-700 placeholder:text-slate-400 transition-all outline-none shadow-sm"
                    />
                </div>

                {/* Filters Toggle Button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-2xl transition-all border shadow-sm ${
                        showFilters 
                            ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-blue-50' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/30'
                    }`}
                >
                    <Filter className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-90 text-blue-600' : ''}`} />
                    Advanced Filters
                    {hasActiveFilters && (
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight ${
                            showFilters ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                        }`}>
                            Active
                        </span>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showFilters ? 'rotate-180 opacity-60' : 'opacity-40'}`} />
                </button>

                {/* Reset Button (Visible only when filters active) */}
                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-2xl text-sm font-bold transition-all border border-rose-100 shadow-sm group"
                    >
                        <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                        Clear All
                    </button>
                )}
            </div>

            {/* Expandable Filter Panel */}
            {showFilters && (
                <div className="bg-white rounded-[2rem] border border-slate-200 p-4 mb-8 shadow-xl shadow-slate-200/50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl">
                        {/* Status Selector */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Status</label>
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 cursor-pointer focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none"
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="RESOLVED">Resolved Only</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Priority Selector */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Priority</label>
                            <div className="relative">
                                <select
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 cursor-pointer focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none"
                                >
                                    <option value="ALL">All Priorities</option>
                                    <option value="HIGH">High Priority</option>
                                    <option value="MEDIUM">Medium Level</option>
                                    <option value="LOW">Low Level</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Date From */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">From Date</label>
                            <input
                                type="date"
                                value={dateFrom}
                                max={dateTo || today}
                                onClick={(e) => e.target.showPicker?.()}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 cursor-pointer focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none"
                            />
                        </div>

                        {/* Date To */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">To Date</label>
                            <input
                                type="date"
                                value={dateTo}
                                min={dateFrom}
                                max={today}
                                onClick={(e) => e.target.showPicker?.()}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 cursor-pointer focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* List Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40">
                    <Loader2 className="w-12 h-12 animate-spin text-slate-400 mb-6" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving Work History...</p>
                </div>
            ) : historicalTickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm animate-in zoom-in-95 duration-500 text-center">
                    <div className="p-8 bg-slate-50 rounded-full mb-8">
                        <History className="w-16 h-16 text-slate-200" />
                    </div>
                    <p className="text-slate-800 font-black text-xl tracking-tight uppercase">History is clean</p>
                    <p className="text-slate-400 text-sm mt-2 max-w-xs leading-relaxed">Completed incidents and resolved assignments will appear here for your records.</p>
                </div>
            ) : (
                <div className="overflow-hidden bg-white rounded-[2rem] border border-slate-100 shadow-sm animate-in fade-in duration-700">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Ticket Id</th>
                                <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                                <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden xl:table-cell">Department</th>
                                <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden lg:table-cell">Resource Type</th>
                                <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden lg:table-cell">Resource</th>
                                <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Completed On</th>
                                <th className="px-3 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-3 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell text-center">Priority</th>
                                <th className="px-3 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {historicalTickets.map((tkt, index) => (
                                <tr
                                    key={tkt.id}
                                    onClick={() => openTicket(tkt.id)}
                                    className={`
                                        cursor-pointer transition-all duration-200 group relative
                                        ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}
                                        hover:bg-slate-50 hover:translate-x-1
                                    `}
                                >
                                    <td className="px-4 py-5 font-mono">
                                        <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                                            {tkt.ticketId || tkt.id.substring(0, 8).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5">
                                        <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                                            {tkt.category.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 hidden xl:table-cell">
                                        <span className="text-sm font-bold text-slate-700 tracking-tighter">
                                            {tkt.department 
                                                ? tkt.department.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
                                                : 'General'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 hidden lg:table-cell">
                                        <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                                            {tkt.resourceType ? tkt.resourceType.replace(/_/g, ' ') : 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 hidden lg:table-cell">
                                        <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                                            {tkt.resourceName || 'Campus General'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 hidden md:table-cell">
                                        <span className="text-sm font-bold text-slate-700">
                                            {new Date(tkt.updatedAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-3 py-5">
                                        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-tighter inline-flex items-center ${
                                            tkt.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                            tkt.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                tkt.status === 'RESOLVED' ? 'bg-emerald-500' :
                                                tkt.status === 'REJECTED' ? 'bg-rose-500' :
                                                'bg-slate-500'
                                            }`} />
                                            {tkt.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-5 hidden md:table-cell text-center">
                                        <span className={`px-2.5 py-1 rounded-lg text-sm font-bold uppercase tracking-tighter border ${tkt.priority === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100' :
                                            tkt.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-sky-50 text-sky-600 border-sky-100'
                                            }`}>
                                            {tkt.priority}
                                        </span>
                                    </td>
                                    <td className="px-3 py-5 text-right flex items-center justify-end">
                                        <button className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-slate-800 group-hover:text-white transition-all shadow-sm">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TechnicianHistory;
