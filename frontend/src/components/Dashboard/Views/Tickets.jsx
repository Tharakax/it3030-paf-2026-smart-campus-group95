import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    AlertCircle, 
    CheckCircle2,
    Calendar,
    Search,
    Filter,
    Loader2,
    ChevronDown,
    X,
    ArrowUpDown,
    AlertTriangle,
    Activity,
    History,
    ClipboardCheck
} from 'lucide-react';
 import { useMemo } from 'react';
import toast from 'react-hot-toast';
import Modal from '../../Common/Modal';
import TicketForm from '../Tickets/TicketForm';
import TicketCard from '../Tickets/TicketCard';
import TicketDetails from '../Tickets/TicketDetails';
import api from '../../../api/axiosConfig';

const Tickets = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    // Filtering & Sorting State
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    
    const closeTicketDetails = () => setSelectedTicketId(null);

    const handleClearFilters = () => {
        setStatusFilter('ALL');
        setPriorityFilter('ALL');
        setCategoryFilter('ALL');
        setDateFrom('');
        setDateTo('');
    };

    // Fetch tickets from backend on mount
    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await api.get('/tickets');
            setTickets(res.data);
        } catch (err) {
            console.error('Failed to fetch tickets:', err);
            toast.error('Failed to load tickets.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    // Memoized filtered and sorted tickets
    const filteredTickets = useMemo(() => {
        return tickets
            .filter(ticket => {
                const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
                const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter;
                const matchesCategory = categoryFilter === 'ALL' || ticket.category === categoryFilter;
                
                // Date filtering logic
                const ticketDate = ticket.createdAt ? ticket.createdAt.split('T')[0] : '';
                const matchesDateFrom = !dateFrom || ticketDate >= dateFrom;
                const matchesDateTo = !dateTo || ticketDate <= dateTo;

                return matchesStatus && matchesPriority && matchesCategory && matchesDateFrom && matchesDateTo;
            })
            .sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB - dateA; // Default to newest first
            });
    }, [tickets, statusFilter, priorityFilter, categoryFilter, dateFrom, dateTo]);
    
    // Split filtered tickets into status-based pipeline sections
    const sections = useMemo(() => {
        const groups = {
            new: [],
            active: [],
            history: []
        };

        filteredTickets.forEach(tkt => {
            if (tkt.status === 'OPEN') {
                groups.new.push(tkt);
            } else if (tkt.status === 'IN_PROGRESS') {
                groups.active.push(tkt);
            } else {
                groups.history.push(tkt);
            }
        });

        return groups;
    }, [filteredTickets]);

    // Submit ticket to backend: POST /api/tickets
    const handleFormSubmit = async (data) => {
        setSubmitting(true);
        try {
            const payload = {
                resourceId: data.resourceId,
                category: data.category,
                description: data.description,
                priority: data.priority,
                contactDetails: data.contactDetails,
                imageUrls: data.imageUrls || []
            };

            await api.post('/tickets', payload);
            toast.success('Incident ticket submitted successfully!');
            handleCloseModal();
            fetchTickets();
        } catch (err) {
            console.error('Failed to create ticket:', err);
            const message = err.response?.data?.message || err.response?.data?.error || 'Failed to submit ticket. Please try again.';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const glassStyle = {
        background: 'rgba(255,255,255,.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,0,0,.05)',
        borderRadius: 24,
        boxShadow: '0 8px 24px rgba(0,0,0,.02)'
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* 1. Header Section (Hidden when viewing details) */}
            {!selectedTicketId && (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(59,130,246,.08)', border: '1px solid rgba(59,130,246,.12)', marginBottom: 12 }}>
                            <Activity size={12} className="text-blue-600" />
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Incident Response</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight leading-tight flex items-center">
                            Support Tickets
                            <span className="ml-4 px-3 py-1 bg-white border border-slate-100 shadow-sm text-blue-600 text-[10px] font-black uppercase rounded-xl tracking-widest">
                                {filteredTickets.length} Found
                            </span>
                        </h2>
                        <p className="text-slate-500 mt-2 font-medium tracking-tight">Report campus issues or track your active service requests.</p>
                    </div>
                    <button 
                        onClick={handleOpenModal}
                        className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-5 rounded-3xl font-black text-lg tracking-tight flex items-center shadow-2xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95 group"
                    >
                        <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                        Open New Ticket
                    </button>
                </div>
            )}

            {/* 2. Filters Bar (Hidden when viewing details) */}
            {!selectedTicketId && (
                <div style={glassStyle} className="bg-white/70 p-5 border-slate-100 mb-12 flex flex-col xl:flex-row gap-5 items-center group/filters hover:border-blue-200 transition-colors duration-500">
                    <div className="flex flex-wrap gap-3 w-full">
                        {/* Status Filter */}
                        <div className="relative flex-1 md:flex-none group/select">
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none w-full md:w-44 px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-xs font-black text-slate-600 cursor-pointer focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all pr-12 uppercase tracking-widest"
                            >
                                <option value="ALL">All Status</option>
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">Active</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover/select:text-blue-500 transition-colors" />
                        </div>

                        {/* Priority Filter */}
                        <div className="relative flex-1 md:flex-none group/select">
                            <select 
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="appearance-none w-full md:w-40 px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-xs font-black text-slate-600 cursor-pointer focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all pr-12 uppercase tracking-widest"
                            >
                                <option value="ALL">Priority</option>
                                <option value="HIGH">High</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="LOW">Low</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover/select:text-blue-500 transition-colors" />
                        </div>

                        {/* Category Filter */}
                        <div className="relative flex-1 md:flex-none group/select">
                            <select 
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="appearance-none w-full md:w-48 px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-xs font-black text-slate-600 cursor-pointer focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all pr-12 uppercase tracking-widest"
                            >
                                <option value="ALL">All Categories</option>
                                <option value="ELECTRICAL">Electrical</option>
                                <option value="IT_NETWORK">IT & Network</option>
                                <option value="PROJECTOR_AV">AV & Projector</option>
                                <option value="FURNITURE">Furniture</option>
                                <option value="PLUMBING">Plumbing</option>
                                <option value="AC_VENTILATION">AC & Vent</option>
                                <option value="CLEANING">Cleaning</option>
                                <option value="SAFETY_SECURITY">Security</option>
                                <option value="LAB_EQUIPMENT">Lab Space</option>
                                <option value="OTHER">Other</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover/select:text-blue-500 transition-colors" />
                        </div>

                        {/* Date From */}
                        <div className="flex-1 md:flex-none flex items-center bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-3.5 group/date focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-500/20 transition-all">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mr-3">From</span>
                            <input 
                                type="date" 
                                value={dateFrom}
                                max={dateTo || today}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setDateFrom(val);
                                    if (dateTo && val > dateTo) setDateTo('');
                                }}
                                className="bg-transparent border-none p-0 text-xs font-black text-slate-600 focus:ring-0 cursor-pointer uppercase"
                            />
                        </div>

                        {/* Date To */}
                        <div className="flex-1 md:flex-none flex items-center bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-3.5 group/date focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-500/20 transition-all">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mr-3">To</span>
                            <input 
                                type="date" 
                                value={dateTo}
                                min={dateFrom}
                                max={today}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setDateTo(val);
                                    if (dateFrom && val < dateFrom) setDateFrom('');
                                }}
                                className="bg-transparent border-none p-0 text-xs font-black text-slate-600 focus:ring-0 cursor-pointer uppercase"
                            />
                        </div>

                        {/* Clear Filters */}
                        <button 
                            onClick={handleClearFilters}
                            disabled={statusFilter === 'ALL' && priorityFilter === 'ALL' && categoryFilter === 'ALL' && !dateFrom && !dateTo}
                            className="flex-1 md:flex-none xl:ml-auto flex items-center justify-center px-6 py-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-[11px] font-black text-rose-600 uppercase tracking-widest hover:bg-rose-100 transition-all disabled:opacity-0 disabled:pointer-events-none duration-500"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Reset Filters
                        </button>
                    </div>
                </div>
            )}

            {/* 3. Render View (List or Detail) */}
            {selectedTicketId ? (
                <TicketDetails 
                    ticketId={selectedTicketId} 
                    onClose={closeTicketDetails}
                    onUpdate={fetchTickets}
                />
            ) : (
                <div className="space-y-12">
                    {/* 1. New Requests Section */}
                    {sections.new.length > 0 && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                            <div className="flex items-center space-x-3 mb-6 px-4">
                                <div className="p-2.5 bg-blue-50 rounded-xl">
                                    <ClipboardCheck className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Reports</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Submitted and pending review ({sections.new.length})</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sections.new.map((tkt) => (
                                    <TicketCard key={tkt.id} ticket={tkt} onClick={() => setSelectedTicketId(tkt.id)} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 2. Active Progress Section */}
                    {sections.active.length > 0 && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-700 delay-150">
                            <div className="flex items-center space-x-3 mb-6 px-4">
                                <div className="p-2.5 bg-violet-50 rounded-xl">
                                    <Activity className="w-5 h-5 text-violet-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Actively Fixing</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Technicians are currently working on these ({sections.active.length})</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sections.active.map((tkt) => (
                                    <TicketCard key={tkt.id} ticket={tkt} onClick={() => setSelectedTicketId(tkt.id)} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 3. Completed History Section */}
                    {sections.history.length > 0 && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-700 delay-300">
                            <div className="flex items-center space-x-3 mb-6 px-4 pt-12 border-t border-slate-100">
                                <div className="p-2.5 bg-slate-50 rounded-xl">
                                    <History className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight opacity-60">Resolved & History</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Past incidents that have been handled ({sections.history.length})</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity">
                                {sections.history.map((tkt) => (
                                    <TicketCard key={tkt.id} ticket={tkt} onClick={() => setSelectedTicketId(tkt.id)} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modal & Form Integration */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Create Incident Ticket"
            >
                <TicketForm 
                    onSubmit={handleFormSubmit}
                    onClose={handleCloseModal}
                    submitting={submitting}
                />
            </Modal>
        </div>
    );
};

export default Tickets;
