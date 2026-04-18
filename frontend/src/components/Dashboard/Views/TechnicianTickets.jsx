import React, { useState, useEffect, useMemo, useContext } from 'react';
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
    BarChart3,
    Calendar,
    Tag,
    User,
    ChevronRight,
    Building2,
    Clock,
    PlayCircle,
    UserPlus
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import TechnicianTicketDetails from '../Tickets/TechnicianTicketDetails';

const TechnicianTickets = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicketId, setSelectedTicketId] = useState(null);

    // Filtering & Search State
    const [statusFilter, setStatusFilter] = useState('OPEN');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

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

    // Filter tickets based on technician's role
    const filteredTickets = useMemo(() => {
        return tickets.filter(ticket => {
            // ONLY show tickets assigned to me that are ACTIVE
            const isRelevant = ticket.assignedTo === user?.id;
            const isActive = ['OPEN', 'IN_PROGRESS'].includes(ticket.status);

            if (!isRelevant || !isActive) return false;

            const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
            const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter;
            
            const ticketDate = new Date(ticket.createdAt).toISOString().split('T')[0];
            const matchesDateFrom = !dateFrom || ticketDate >= dateFrom;
            const matchesDateTo = !dateTo || ticketDate <= dateTo;

            const matchesSearch = !searchQuery || 
                ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (ticket.ticketId && ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase())) ||
                ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.category.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesStatus && matchesPriority && matchesDateFrom && matchesDateTo && matchesSearch;
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [tickets, statusFilter, priorityFilter, searchQuery, dateFrom, dateTo, user?.id]);

    const stats = useMemo(() => ({
        myActive: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        pendingAcceptance: tickets.filter(t => t.status === 'OPEN').length,
    }), [tickets]);

    const handleClearFilters = () => {
        setPriorityFilter('ALL');
        setDateFrom('');
        setDateTo('');
        setSearchQuery('');
    };

    const hasActiveFilters = priorityFilter !== 'ALL' || dateFrom || dateTo || searchQuery;

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
                    Maintenance Hub
                </h1>
                <p className="text-slate-500 mt-1 font-medium">Manage your assigned tasks and respond to campus incidents.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <button
                    onClick={() => setStatusFilter('OPEN')}
                    className={`p-4 rounded-3xl border transition-all duration-300 flex items-center space-x-4 ${statusFilter === 'OPEN' ? 'bg-amber-600 border-amber-500 shadow-xl shadow-amber-100' : 'bg-white border-slate-100 hover:border-amber-200 shadow-sm'
                        }`}
                >
                    <div className={`p-2.5 rounded-2xl ${statusFilter === 'OPEN' ? 'bg-amber-500' : 'bg-amber-50'}`}>
                        <Clock className={`w-4 h-4 ${statusFilter === 'OPEN' ? 'text-white' : 'text-amber-500'}`} />
                    </div>
                    <div className="text-left">
                        <p className={`text-[9px] font-black uppercase tracking-wider ${statusFilter === 'OPEN' ? 'text-amber-200' : 'text-slate-400'}`}>Pending tasks</p>
                        <p className={`text-xl font-black ${statusFilter === 'OPEN' ? 'text-white' : 'text-slate-800'}`}>{stats.pendingAcceptance}</p>
                    </div>
                </button>

                <button
                    onClick={() => setStatusFilter('IN_PROGRESS')}
                    className={`p-4 rounded-3xl border transition-all duration-300 flex items-center space-x-4 ${statusFilter === 'IN_PROGRESS' ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-100' : 'bg-white border-slate-100 hover:border-indigo-200 shadow-sm'
                        }`}
                >
                    <div className={`p-2.5 rounded-2xl ${statusFilter === 'IN_PROGRESS' ? 'bg-indigo-500' : 'bg-indigo-50'}`}>
                        <PlayCircle className={`w-4 h-4 ${statusFilter === 'IN_PROGRESS' ? 'text-white' : 'text-indigo-500'}`} />
                    </div>
                    <div className="text-left">
                        <p className={`text-[9px] font-black uppercase tracking-wider ${statusFilter === 'IN_PROGRESS' ? 'text-indigo-200' : 'text-slate-400'}`}>Accepted tasks</p>
                        <p className={`text-xl font-black ${statusFilter === 'IN_PROGRESS' ? 'text-white' : 'text-slate-800'}`}>{stats.myActive}</p>
                    </div>
                </button>
            </div>

            {/* Advanced Command Bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="relative flex-1 group min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search incident ID, category, or description..."
                        className="w-full pl-11 pr-5 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-2xl text-sm font-medium text-slate-700 placeholder:text-slate-400 transition-all outline-none shadow-sm"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative md:w-36">
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="appearance-none w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 cursor-pointer focus:ring-4 focus:ring-blue-50 transition-all pr-10 outline-none shadow-sm"
                        >
                            <option value="ALL">All Priorities</option>
                            <option value="HIGH">High Priority</option>
                            <option value="MEDIUM">Medium Level</option>
                            <option value="LOW">Low Level</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="relative md:w-40 flex items-center">
                        <input
                            type="date"
                            value={dateFrom}
                            max={dateTo || today}
                            onClick={(e) => e.target.showPicker?.()}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold text-slate-600 cursor-pointer focus:ring-4 focus:ring-blue-50 transition-all outline-none shadow-sm"
                        />
                        <span className="absolute -top-2 left-3 px-1 bg-white text-[8px] font-black text-slate-400 uppercase">From</span>
                    </div>

                    <div className="relative md:w-40 flex items-center">
                        <input
                            type="date"
                            value={dateTo}
                            min={dateFrom}
                            max={today}
                            onClick={(e) => e.target.showPicker?.()}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold text-slate-600 cursor-pointer focus:ring-4 focus:ring-blue-50 transition-all outline-none shadow-sm"
                        />
                        <span className="absolute -top-2 left-3 px-1 bg-white text-[8px] font-black text-slate-400 uppercase">To</span>
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={handleClearFilters}
                            title="Clear All Filters"
                            className="inline-flex items-center gap-2 px-5 py-3 bg-red-50 text-red-600 rounded-2xl border border-red-100 hover:bg-red-100 transition-all group shadow-sm text-xs font-bold"
                        >
                            <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                            Clear
                        </button>
                    )}
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
                                        <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                                            {new Date(tkt.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-3 py-5">
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
                                    <td className="px-3 py-5 hidden md:table-cell text-center">
                                        <span className={`px-2.5 py-1 rounded-lg text-sm font-bold uppercase tracking-tighter border ${tkt.priority === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100' :
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

export default TechnicianTickets;
