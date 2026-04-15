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

    // Filter tickets based on technician's role
    const filteredTickets = useMemo(() => {
        return tickets.filter(ticket => {
            // Only show tickets that are either:
            // 1. Assigned to me
            // 2. Unassigned and OPEN
            const isRelevant = ticket.assignedTo === user?.id || (!ticket.assignedTo && ticket.status === 'OPEN');
            
            if (!isRelevant && statusFilter === 'ALL') return false;

            const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
            const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter;
            const matchesSearch = !searchQuery || 
                ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.category.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesStatus && matchesPriority && matchesSearch;
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [tickets, statusFilter, priorityFilter, searchQuery, user?.id]);

    const stats = useMemo(() => ({
        total: tickets.filter(t => t.assignedTo === user?.id).length,
        myActive: tickets.filter(t => t.assignedTo === user?.id && t.status === 'IN_PROGRESS').length,
        unassigned: tickets.filter(t => !t.assignedTo && t.status === 'OPEN').length,
        resolved: tickets.filter(t => t.assignedTo === user?.id && t.status === 'RESOLVED').length
    }), [tickets, user?.id]);

    const handleClearFilters = () => {
        setStatusFilter('ALL');
        setPriorityFilter('ALL');
        setSearchQuery('');
    };

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
                    <span className="ml-3 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-xl border border-blue-100">
                        Technician Portal
                    </span>
                </h1>
                <p className="text-slate-500 mt-1 font-medium">Manage your assigned tasks and respond to campus incidents.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <button 
                    onClick={() => setStatusFilter('IN_PROGRESS')}
                    className={`p-4 rounded-3xl border transition-all duration-300 flex items-center space-x-4 ${
                        statusFilter === 'IN_PROGRESS' ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-100' : 'bg-white border-slate-100 hover:border-indigo-200 shadow-sm'
                    }`}
                >
                    <div className={`p-2.5 rounded-2xl ${statusFilter === 'IN_PROGRESS' ? 'bg-indigo-500' : 'bg-indigo-50'}`}>
                        <PlayCircle className={`w-4 h-4 ${statusFilter === 'IN_PROGRESS' ? 'text-white' : 'text-indigo-500'}`} />
                    </div>
                    <div className="text-left">
                        <p className={`text-[9px] font-black uppercase tracking-wider ${statusFilter === 'IN_PROGRESS' ? 'text-indigo-200' : 'text-slate-400'}`}>My Active</p>
                        <p className={`text-xl font-black ${statusFilter === 'IN_PROGRESS' ? 'text-white' : 'text-slate-800'}`}>{stats.myActive}</p>
                    </div>
                </button>

                <button 
                    onClick={() => setStatusFilter('OPEN')}
                    className={`p-4 rounded-3xl border transition-all duration-300 flex items-center space-x-4 ${
                        statusFilter === 'OPEN' ? 'bg-amber-600 border-amber-500 shadow-xl shadow-amber-100' : 'bg-white border-slate-100 hover:border-amber-200 shadow-sm'
                    }`}
                >
                    <div className={`p-2.5 rounded-2xl ${statusFilter === 'OPEN' ? 'bg-amber-500' : 'bg-amber-50'}`}>
                        <Clock className={`w-4 h-4 ${statusFilter === 'OPEN' ? 'text-white' : 'text-amber-500'}`} />
                    </div>
                    <div className="text-left">
                        <p className={`text-[9px] font-black uppercase tracking-wider ${statusFilter === 'OPEN' ? 'text-amber-200' : 'text-slate-400'}`}>Dispatch Queue</p>
                        <p className={`text-xl font-black ${statusFilter === 'OPEN' ? 'text-white' : 'text-slate-800'}`}>{stats.unassigned}</p>
                    </div>
                </button>

                <button 
                    onClick={() => setStatusFilter('RESOLVED')}
                    className={`p-4 rounded-3xl border transition-all duration-300 flex items-center space-x-4 ${
                        statusFilter === 'RESOLVED' ? 'bg-emerald-600 border-emerald-500 shadow-xl shadow-emerald-100' : 'bg-white border-slate-100 hover:border-emerald-200 shadow-sm'
                    }`}
                >
                    <div className={`p-2.5 rounded-2xl ${statusFilter === 'RESOLVED' ? 'bg-emerald-500' : 'bg-emerald-50'}`}>
                        <CheckCircle2 className={`w-4 h-4 ${statusFilter === 'RESOLVED' ? 'text-white' : 'text-emerald-500'}`} />
                    </div>
                    <div className="text-left">
                        <p className={`text-[9px] font-black uppercase tracking-wider ${statusFilter === 'RESOLVED' ? 'text-emerald-200' : 'text-slate-400'}`}>My Resolved</p>
                        <p className={`text-xl font-black ${statusFilter === 'RESOLVED' ? 'text-white' : 'text-slate-800'}`}>{stats.resolved}</p>
                    </div>
                </button>

                <div className={`p-4 rounded-3xl border bg-white border-slate-100 shadow-sm flex items-center space-x-4`}>
                    <div className="p-2.5 rounded-2xl bg-blue-50">
                        <BarChart3 className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-left">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Total Work</p>
                        <p className="text-xl font-black text-slate-800">{stats.total}</p>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white p-3 rounded-2xl border border-slate-100 mb-6 shadow-sm flex flex-col xl:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tasks by ID or description..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-50 transition-all outline-none"
                    />
                </div>

                <div className="flex gap-4 w-full xl:w-auto">
                    <div className="relative flex-1 md:w-40">
                        <select 
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="appearance-none w-full px-4 py-2 bg-slate-50 border-none rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 cursor-pointer focus:ring-2 focus:ring-blue-50 transition-all pr-10 outline-none"
                        >
                            <option value="ALL">All Priorities</option>
                            <option value="HIGH">High Priority</option>
                            <option value="MEDIUM">Medium Level</option>
                            <option value="LOW">Low Level</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>

                    <button 
                        onClick={handleClearFilters}
                        disabled={statusFilter === 'ALL' && priorityFilter === 'ALL' && !searchQuery}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group"
                    >
                        <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Task Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-6 drop-shadow-xl shadow-blue-100" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing Task logs...</p>
                </div>
            ) : filteredTickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm border-dashed">
                    <div className="p-8 bg-slate-50 rounded-full mb-8">
                        <CheckCircle2 className="w-16 h-16 text-slate-200" />
                    </div>
                    <p className="text-slate-800 font-black text-xl tracking-tight uppercase">No tasks in this viewport</p>
                    <p className="text-slate-400 text-sm mt-2 max-w-xs text-center leading-relaxed font-medium">Clear your filters or check the dispatch queue for available campus reports.</p>
                </div>
            ) : (
                <div className="overflow-hidden bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                    <table className="w-full text-left border-collapse font-sans">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Incident Info</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden lg:table-cell">Dispatch Details</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Priority</th>
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
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-tight mb-1">
                                                ID: {tkt.id.substring(0, 8).toUpperCase()}
                                            </span>
                                            <span className="text-sm font-bold text-slate-800 leading-tight">
                                                {tkt.category}
                                            </span>
                                            <div className="flex items-center mt-1.5 space-x-3 text-[10px] font-bold text-slate-400 lg:hidden">
                                                <div className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {new Date(tkt.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 hidden lg:table-cell">
                                        <div className="flex flex-col max-w-xs space-y-1.5">
                                            <p className="text-xs text-slate-500 line-clamp-1 font-medium italic">"{tkt.description}"</p>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center text-[10px] font-extrabold text-slate-400 uppercase tracking-tighter">
                                                    <Calendar className="w-3 h-3 mr-1 text-slate-300" />
                                                    {new Date(tkt.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center text-[10px] font-extrabold text-slate-400 uppercase tracking-tighter">
                                                    <Building2 className="w-3 h-3 mr-1 text-slate-300" />
                                                    {tkt.department || 'General'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider inline-flex items-center ${
                                            tkt.status === 'OPEN' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                            tkt.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                            tkt.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                            tkt.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                            'bg-slate-50 text-slate-600 border border-slate-100'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                tkt.status === 'OPEN' ? 'bg-amber-500' :
                                                tkt.status === 'IN_PROGRESS' ? 'bg-blue-500 animate-pulse' :
                                                tkt.status === 'RESOLVED' ? 'bg-emerald-500' :
                                                tkt.status === 'REJECTED' ? 'bg-rose-500' :
                                                'bg-slate-500'
                                            }`} />
                                            {tkt.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 hidden md:table-cell">
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tight border ${
                                            tkt.priority === 'HIGH' ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-50' :
                                            tkt.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm shadow-amber-50' :
                                            'bg-sky-50 text-sky-600 border-sky-100 shadow-sm shadow-sky-50'
                                        }`}>
                                            {tkt.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm hover:scale-105 active:scale-95">
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
