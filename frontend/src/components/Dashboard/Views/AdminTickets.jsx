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
    const [searchQuery, setSearchQuery] = useState('');

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
            const matchesSearch = !searchQuery ||
                ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (ticket.ticketId && ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase())) ||
                ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.category.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesStatus && matchesPriority && matchesSearch;
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [tickets, statusFilter, priorityFilter, searchQuery]);

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
        setSearchQuery('');
    };

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
                        Command Center
                        <span className="ml-3 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-xl border border-indigo-100">
                            System Admin
                        </span>
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
            <div className="bg-white p-3 rounded-2xl border border-slate-100 mb-6 shadow-sm flex flex-col xl:flex-row gap-4 items-center">
                {/* Global Search */}
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search incident ID, category, or description..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 rounded-lg text-sm font-bold text-slate-700 placeholder:text-slate-300 transition-all outline-none"
                    />
                </div>

                <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                    {/* Multi-Filter Dropdowns */}
                    <div className="relative flex-1 md:flex-none md:w-40">
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="appearance-none w-full md:w-full px-4 py-2 bg-slate-50 border-none rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 cursor-pointer focus:ring-2 focus:ring-indigo-50 transition-all pr-10"
                        >
                            <option value="ALL">All Priorities</option>
                            <option value="HIGH">High Priority</option>
                            <option value="MEDIUM">Medium Level</option>
                            <option value="LOW">Low Level</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={handleClearFilters}
                        disabled={statusFilter === 'ALL' && priorityFilter === 'ALL' && !searchQuery}
                        className="md:flex-none flex items-center justify-center px-6 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group border border-red-100"
                        title="Clear all filters"
                    >
                        <X className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Clear All Filters</span>
                    </button>
                </div>
            </div>

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
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Ticket Id</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden lg:table-cell">Resource</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden xl:table-cell">Department</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Date</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell text-center">Priority</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredTickets.map((tkt) => (
                                <tr
                                    key={tkt.id}
                                    onClick={() => openTicket(tkt.id)}
                                    className="hover:bg-slate-50/50 cursor-pointer transition-colors group"
                                >
                                    <td className="px-6 py-5 font-mono">
                                        <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                                            {tkt.ticketId || tkt.id.substring(0, 8).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                                            {tkt.category.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 hidden lg:table-cell">
                                        <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                                            {tkt.resourceName || 'Campus General'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 hidden xl:table-cell">
                                        <span className="text-sm font-bold text-slate-700 tracking-tighter">
                                            {tkt.department 
                                                ? tkt.department.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
                                                : 'General'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 hidden md:table-cell">
                                        <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                                            {new Date(tkt.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1.5 rounded-xl text-sm font-bold uppercase tracking-tighter inline-flex items-center ${tkt.status === 'OPEN' ? 'bg-indigo-50 text-indigo-600' :
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
                                    <td className="px-6 py-5 hidden md:table-cell text-center">
                                        <span className={`px-2.5 py-1 rounded-lg text-sm font-bold uppercase tracking-tighter border ${tkt.priority === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100' :
                                            tkt.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-sky-50 text-sky-600 border-sky-100'
                                            }`}>
                                            {tkt.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right flex items-center justify-end">
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
