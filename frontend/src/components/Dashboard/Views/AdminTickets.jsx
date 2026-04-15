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
    BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axiosConfig';
import TicketCard from '../Tickets/TicketCard';
import TicketDetails from '../Tickets/TicketDetails';
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
                ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.category.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesStatus && matchesPriority && matchesSearch;
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [tickets, statusFilter, priorityFilter, searchQuery]);

    const stats = useMemo(() => ({
        total: tickets.length,
        open: tickets.filter(t => t.status === 'OPEN').length,
        inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        resolved: tickets.filter(t => t.status === 'RESOLVED').length
    }), [tickets]);

    const handleClearFilters = () => {
        setStatusFilter('ALL');
        setPriorityFilter('ALL');
        setSearchQuery('');
    };

    if (selectedTicketId) {
        return (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <TicketDetails 
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center">
                        Command Center
                        <span className="ml-3 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-xl border border-indigo-100">
                            System Admin
                        </span>
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Global oversight and technician coordination for campus incidents.</p>
                </div>
                <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full bg-indigo-100 animate-pulse" />
                            </div>
                        ))}
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Active Resolvers</span>
                </div>
            </div>

            {/* Interactive Stats Hub */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <button 
                    onClick={() => handleClearFilters()}
                    className={`p-5 rounded-[1.8rem] border transition-all duration-300 flex flex-col items-start text-left group ${
                        statusFilter === 'ALL' ? 'bg-slate-800 border-slate-700 shadow-xl shadow-slate-200' : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'
                    }`}
                >
                    <BarChart3 className={`w-5 h-5 mb-3 ${statusFilter === 'ALL' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${statusFilter === 'ALL' ? 'text-slate-400' : 'text-slate-400'}`}>Total Tickets</span>
                    <span className={`text-2xl font-black ${statusFilter === 'ALL' ? 'text-white' : 'text-slate-800'}`}>{stats.total}</span>
                </button>

                <button 
                    onClick={() => setStatusFilter('OPEN')}
                    className={`p-5 rounded-[1.8rem] border transition-all duration-300 flex flex-col items-start text-left group ${
                        statusFilter === 'OPEN' ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-100' : 'bg-white border-slate-100 hover:border-indigo-200 shadow-sm'
                    }`}
                >
                    <AlertCircle className={`w-5 h-5 mb-3 ${statusFilter === 'OPEN' ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-600'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${statusFilter === 'OPEN' ? 'text-indigo-200' : 'text-slate-400'}`}>Requires Action</span>
                    <span className={`text-2xl font-black ${statusFilter === 'OPEN' ? 'text-white' : 'text-slate-800'}`}>{stats.open}</span>
                </button>

                <button 
                    onClick={() => setStatusFilter('IN_PROGRESS')}
                    className={`p-5 rounded-[1.8rem] border transition-all duration-300 flex flex-col items-start text-left group ${
                        statusFilter === 'IN_PROGRESS' ? 'bg-violet-600 border-violet-500 shadow-xl shadow-violet-100' : 'bg-white border-slate-100 hover:border-violet-200 shadow-sm'
                    }`}
                >
                    <Activity className={`w-5 h-5 mb-3 ${statusFilter === 'IN_PROGRESS' ? 'text-white' : 'text-violet-400 group-hover:text-violet-600'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${statusFilter === 'IN_PROGRESS' ? 'text-violet-200' : 'text-slate-400'}`}>In Progress</span>
                    <span className={`text-2xl font-black ${statusFilter === 'IN_PROGRESS' ? 'text-white' : 'text-slate-800'}`}>{stats.inProgress}</span>
                </button>

                <button 
                    onClick={() => setStatusFilter('RESOLVED')}
                    className={`p-5 rounded-[1.8rem] border transition-all duration-300 flex flex-col items-start text-left group ${
                        statusFilter === 'RESOLVED' ? 'bg-emerald-600 border-emerald-500 shadow-xl shadow-emerald-100' : 'bg-white border-slate-100 hover:border-emerald-200 shadow-sm'
                    }`}
                >
                    <CheckCircle2 className={`w-5 h-5 mb-3 ${statusFilter === 'RESOLVED' ? 'text-white' : 'text-emerald-400 group-hover:text-emerald-600'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${statusFilter === 'RESOLVED' ? 'text-emerald-200' : 'text-slate-400'}`}>Successfully Closed</span>
                    <span className={`text-2xl font-black ${statusFilter === 'RESOLVED' ? 'text-white' : 'text-slate-800'}`}>{stats.resolved}</span>
                </button>
            </div>

            {/* Advanced Command Bar */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 mb-10 shadow-sm flex flex-col xl:flex-row gap-6 items-center">
                {/* Global Search */}
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search incident ID, category, or description..."
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-50 transition-all"
                    />
                </div>

                <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                    {/* Multi-Filter Dropdowns */}
                    <div className="relative flex-1 md:flex-none">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none w-full md:w-44 px-6 py-4 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 cursor-pointer focus:ring-4 focus:ring-indigo-50 transition-all pr-12"
                        >
                            <option value="ALL">All Status</option>
                            <option value="OPEN">Open Reports</option>
                            <option value="IN_PROGRESS">Active Fixing</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Archived</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="relative flex-1 md:flex-none">
                        <select 
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="appearance-none w-full md:w-44 px-6 py-4 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 cursor-pointer focus:ring-4 focus:ring-indigo-50 transition-all pr-12"
                        >
                            <option value="ALL">All Priorities</option>
                            <option value="HIGH">High Priority</option>
                            <option value="MEDIUM">Medium Level</option>
                            <option value="LOW">Low Level</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Reset Button */}
                    <button 
                        onClick={handleClearFilters}
                        disabled={statusFilter === 'ALL' && priorityFilter === 'ALL' && !searchQuery}
                        className="flex-1 md:flex-none flex items-center justify-center p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group"
                        title="Clear all filters"
                    >
                        <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Global Ticket Grid */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTickets.map((tkt) => (
                        <div key={tkt.id} className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both" style={{ animationDelay: `${tickets.indexOf(tkt) * 50}ms` }}>
                            <TicketCard 
                                ticket={tkt} 
                                onClick={() => openTicket(tkt.id)} 
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminTickets;
