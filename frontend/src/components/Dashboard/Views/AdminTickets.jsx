import React, { useState, useEffect, useMemo } from 'react';
import {
    AlertCircle,
    Search,
    Filter,
    Loader2,
    CheckCircle2,
    ChevronDown,
    X,
    Activity,
    ShieldAlert,
    AlertTriangle,
    BarChart3,
    Calendar,
    Tag,
    User,
    ChevronRight,
    Building2,
    History
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axiosConfig';
import TicketCard from '../Tickets/TicketCard';
import AdminTicketDetails from '../Tickets/AdminTicketDetails';
import Modal from '../../Common/Modal';

const AdminTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicketId, setSelectedTicketId] = useState(null);

    // Filtering & Search State
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
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
            toast.error('Failed to load tickets.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const openTicket = (id) => setSelectedTicketId(id);
    const closeTicket = () => setSelectedTicketId(null);

    // Memoized filtered tickets
    const filteredTickets = useMemo(() => {
        return tickets.filter(ticket => {
            const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
            const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter;
            const matchesCategory = categoryFilter === 'ALL' || ticket.category === categoryFilter;
            
            const ticketDate = new Date(ticket.createdAt).toISOString().split('T')[0];
            const matchesDateFrom = !dateFrom || ticketDate >= dateFrom;
            const matchesDateTo = !dateTo || ticketDate <= dateTo;

            const matchesSearch = !searchQuery ||
                ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (ticket.ticketId && ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase())) ||
                ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.category.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesStatus && matchesPriority && matchesCategory && matchesDateFrom && matchesDateTo && matchesSearch;
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [tickets, statusFilter, priorityFilter, categoryFilter, dateFrom, dateTo, searchQuery]);

    const stats = useMemo(() => ({
        total: tickets.length,
        open: tickets.filter(t => t.status === 'OPEN').length,
        inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        resolved: tickets.filter(t => t.status === 'RESOLVED').length,
        closed: tickets.filter(t => t.status === 'CLOSED').length
    }), [tickets]);

    const handleClearFilters = () => {
        setStatusFilter('ALL');
        setPriorityFilter('ALL');
        setCategoryFilter('ALL');
        setDateFrom('');
        setDateTo('');
        setSearchQuery('');
    };

    const hasActiveFilters = statusFilter !== 'ALL' || priorityFilter !== 'ALL' || categoryFilter !== 'ALL' || dateFrom || dateTo || searchQuery;

    if (selectedTicketId) {
        return (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <AdminTicketDetails
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
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center">
                        Ticket Management
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Global oversight and technician coordination for campus incidents.</p>
                </div>
            </div>

            {/* Optimized Stats Hub */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <button
                    onClick={() => setStatusFilter('OPEN')}
                    className={`p-4 rounded-3xl border transition-all duration-300 flex items-center space-x-4 group ${statusFilter === 'OPEN' ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-100' : 'bg-white border-slate-100 hover:border-indigo-200 shadow-sm'
                        }`}
                >
                    <div className={`p-2.5 rounded-2xl ${statusFilter === 'OPEN' ? 'bg-indigo-500' : 'bg-indigo-50'}`}>
                        <AlertCircle className={`w-4 h-4 ${statusFilter === 'OPEN' ? 'text-white' : 'text-indigo-500'}`} />
                    </div>
                    <div className="text-left">
                        <p className={`text-[9px] font-black uppercase tracking-wider ${statusFilter === 'OPEN' ? 'text-indigo-200' : 'text-slate-400'}`}>Open</p>
                        <p className={`text-xl font-black ${statusFilter === 'OPEN' ? 'text-white' : 'text-slate-800'}`}>{stats.open}</p>
                    </div>
                </button>

                <button
                    onClick={() => setStatusFilter('IN_PROGRESS')}
                    className={`p-4 rounded-3xl border transition-all duration-300 flex items-center space-x-4 group ${statusFilter === 'IN_PROGRESS' ? 'bg-violet-600 border-violet-500 shadow-xl shadow-violet-100' : 'bg-white border-slate-100 hover:border-violet-200 shadow-sm'
                        }`}
                >
                    <div className={`p-2.5 rounded-2xl ${statusFilter === 'IN_PROGRESS' ? 'bg-violet-500' : 'bg-violet-50'}`}>
                        <Activity className={`w-4 h-4 ${statusFilter === 'IN_PROGRESS' ? 'text-white' : 'text-violet-500'}`} />
                    </div>
                    <div className="text-left">
                        <p className={`text-[9px] font-black uppercase tracking-wider ${statusFilter === 'IN_PROGRESS' ? 'text-violet-200' : 'text-slate-400'}`}>Active</p>
                        <p className={`text-xl font-black ${statusFilter === 'IN_PROGRESS' ? 'text-white' : 'text-slate-800'}`}>{stats.inProgress}</p>
                    </div>
                </button>

                <button
                    onClick={() => setStatusFilter('RESOLVED')}
                    className={`p-4 rounded-3xl border transition-all duration-300 flex items-center space-x-4 group ${statusFilter === 'RESOLVED' ? 'bg-emerald-600 border-emerald-500 shadow-xl shadow-emerald-100' : 'bg-white border-slate-100 hover:border-emerald-200 shadow-sm'
                        }`}
                >
                    <div className={`p-2.5 rounded-2xl ${statusFilter === 'RESOLVED' ? 'bg-emerald-500' : 'bg-emerald-50'}`}>
                        <CheckCircle2 className={`w-4 h-4 ${statusFilter === 'RESOLVED' ? 'text-white' : 'text-emerald-500'}`} />
                    </div>
                    <div className="text-left">
                        <p className={`text-[9px] font-black uppercase tracking-wider ${statusFilter === 'RESOLVED' ? 'text-emerald-200' : 'text-slate-400'}`}>Resolved</p>
                        <p className={`text-xl font-black ${statusFilter === 'RESOLVED' ? 'text-white' : 'text-slate-800'}`}>{stats.resolved}</p>
                    </div>
                </button>

                <button
                    onClick={() => setStatusFilter('CLOSED')}
                    className={`p-4 rounded-3xl border transition-all duration-300 flex items-center space-x-4 group ${statusFilter === 'CLOSED' ? 'bg-slate-700 border-slate-600 shadow-xl shadow-slate-100' : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'
                        }`}
                >
                    <div className={`p-2.5 rounded-2xl ${statusFilter === 'CLOSED' ? 'bg-slate-600' : 'bg-slate-100'}`}>
                        <History className={`w-4 h-4 ${statusFilter === 'CLOSED' ? 'text-white' : 'text-slate-500'}`} />
                    </div>
                    <div className="text-left">
                        <p className={`text-[9px] font-black uppercase tracking-wider ${statusFilter === 'CLOSED' ? 'text-slate-300' : 'text-slate-400'}`}>Closed Tickets</p>
                        <p className={`text-xl font-black ${statusFilter === 'CLOSED' ? 'text-white' : 'text-slate-800'}`}>{stats.closed}</p>
                    </div>
                </button>

                <button
                    onClick={() => setStatusFilter('REJECTED')}
                    className={`p-4 rounded-3xl border transition-all duration-300 flex items-center space-x-4 group ${statusFilter === 'REJECTED' ? 'bg-rose-600 border-rose-500 shadow-xl shadow-rose-100' : 'bg-white border-slate-100 hover:border-rose-200 shadow-sm'
                        }`}
                >
                    <div className={`p-2.5 rounded-2xl ${statusFilter === 'REJECTED' ? 'bg-rose-500' : 'bg-rose-50'}`}>
                        <ShieldAlert className={`w-4 h-4 ${statusFilter === 'REJECTED' ? 'text-white' : 'text-rose-500'}`} />
                    </div>
                    <div className="text-left">
                        <p className={`text-[9px] font-black uppercase tracking-wider ${statusFilter === 'REJECTED' ? 'text-rose-200' : 'text-slate-400'}`}>Rejected</p>
                        <p className={`text-xl font-black ${statusFilter === 'REJECTED' ? 'text-white' : 'text-slate-800'}`}>{stats.rejected}</p>
                    </div>
                </button>
            </div>

            {/* Advanced Command Bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                {/* Global Search */}
                <div className="relative flex-1 group min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search incident ID, category, or description..."
                        className="w-full pl-11 pr-5 py-3 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-2xl text-sm font-medium text-slate-700 placeholder:text-slate-400 transition-all outline-none shadow-sm"
                    />
                </div>

                {/* Filters Toggle Button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-2xl transition-all border shadow-sm ${
                        showFilters 
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-indigo-50' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30'
                    }`}
                >
                    <Filter className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-90 text-indigo-600' : ''}`} />
                    Advanced Filters
                    {hasActiveFilters && (
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight ${
                            showFilters ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
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
                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 mb-8 shadow-xl shadow-slate-200/50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {/* Status Selector */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Status</label>
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 cursor-pointer focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all outline-none"
                                >
                                    <option value="ALL">All Statuses</option>
                                    <option value="OPEN">Open Incidents</option>
                                    <option value="IN_PROGRESS">Active Investigation</option>
                                    <option value="RESOLVED">Resolved Tickets</option>
                                    <option value="CLOSED">Archived / Closed</option>
                                    <option value="REJECTED">Rejected / Invalid</option>
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
                                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 cursor-pointer focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all outline-none"
                                >
                                    <option value="ALL">All Priorities</option>
                                    <option value="HIGH">High Priority</option>
                                    <option value="MEDIUM">Medium Level</option>
                                    <option value="LOW">Low Level</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Category Selector */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Category</label>
                            <div className="relative">
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 cursor-pointer focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all outline-none"
                                >
                                    <option value="ALL">All Categories</option>
                                    <option value="ELECTRICAL">Electrical</option>
                                    <option value="IT_NETWORK">IT & Network</option>
                                    <option value="PROJECTOR_AV">AV & Projector</option>
                                    <option value="FURNITURE">Furniture</option>
                                    <option value="PLUMBING">Plumbing</option>
                                    <option value="AC_VENTILATION">AC & Ventilation</option>
                                    <option value="CLEANING">Cleaning</option>
                                    <option value="SAFETY_SECURITY">Safety & Security</option>
                                    <option value="LAB_EQUIPMENT">Lab Equipment</option>
                                    <option value="OTHER">Other</option>
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
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 cursor-pointer focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all outline-none"
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
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 cursor-pointer focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Global Ticket List Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-6 drop-shadow-xl shadow-indigo-200" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Accessing Incident Database...</p>
                </div>
            ) : filteredTickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm animate-in zoom-in-95 duration-500">
                    <div className="p-8 bg-slate-50 rounded-full mb-8">
                        <CheckCircle2 className="w-16 h-16 text-slate-200" />
                    </div>
                    <p className="text-slate-800 font-black text-xl tracking-tight uppercase">No incidents found</p>
                    <p className="text-slate-400 text-sm mt-2 max-w-xs text-center leading-relaxed">Adjust your filters or search criteria to locate specific campus tickets.</p>
                    <button
                        onClick={handleClearFilters}
                        className="mt-8 text-indigo-600 font-black uppercase text-[10px] tracking-widest hover:text-indigo-700 underline underline-offset-8"
                    >
                        Reset All Viewports
                    </button>
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
                                <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Date</th>
                                <th className="px-3 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-3 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell text-center">Priority</th>
                                <th className="px-3 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredTickets.map((tkt, index) => (
                                <tr
                                    key={tkt.id}
                                    onClick={() => openTicket(tkt.id)}
                                    className={`
                                        cursor-pointer transition-all duration-200 group relative
                                        ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}
                                        hover:bg-indigo-50/50 hover:translate-x-1
                                    `}
                                >
                                    <td className="px-4 py-5 font-mono">
                                        <span className="text-sm font-semibold text-slate-700 uppercase tracking-tighter">
                                            {tkt.ticketId || tkt.id.substring(0, 8).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5">
                                        <span className="text-sm font-medium text-slate-600 uppercase tracking-tight">
                                            {tkt.category.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 hidden xl:table-cell">
                                        <span className="text-sm font-medium text-slate-600 tracking-tight">
                                            {tkt.department
                                                ? tkt.department.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
                                                : 'General'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 hidden lg:table-cell">
                                        <span className="text-sm font-medium text-slate-600 uppercase tracking-tight">
                                            {tkt.resourceType ? tkt.resourceType.replace(/_/g, ' ') : 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 hidden lg:table-cell">
                                        <span className="text-sm font-medium text-slate-600 uppercase tracking-tight">
                                            {tkt.resourceName || 'Campus General'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 hidden md:table-cell">
                                        <span className="text-sm font-medium text-slate-500 uppercase tracking-tight">
                                            {new Date(tkt.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-3 py-5">
                                        <span className={`px-3 py-1.5 rounded-xl text-sm font-semibold uppercase tracking-tighter inline-flex items-center ${tkt.status === 'OPEN' ? 'bg-indigo-50 text-indigo-600' :
                                            tkt.status === 'IN_PROGRESS' ? 'bg-violet-50 text-violet-600' :
                                                tkt.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' :
                                                    tkt.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' :
                                                        'bg-slate-50 text-slate-600'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${tkt.status === 'OPEN' ? 'bg-indigo-500' :
                                                tkt.status === 'IN_PROGRESS' ? 'bg-violet-500' :
                                                    tkt.status === 'RESOLVED' ? 'bg-emerald-500' :
                                                        tkt.status === 'REJECTED' ? 'bg-rose-500' :
                                                            'bg-slate-500'
                                                }`} />
                                            {tkt.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-3 py-5 hidden md:table-cell text-center">
                                        <span className={`px-2.5 py-1 rounded-lg text-sm font-semibold uppercase tracking-tighter border ${tkt.priority === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100' :
                                            tkt.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-sky-50 text-sky-600 border-sky-100'
                                            }`}>
                                            {tkt.priority}
                                        </span>
                                    </td>
                                    <td className="px-3 py-5 text-right flex items-center justify-end">
                                        <button className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
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

export default AdminTickets;
