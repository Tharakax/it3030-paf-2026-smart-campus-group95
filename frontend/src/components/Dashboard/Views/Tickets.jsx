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

    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
            {/* 1. Header Section (Hidden when viewing details) */}
            {!selectedTicketId && (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center">
                            My Tickets
                        </h2>
                        <p className="text-slate-500 mt-1 font-medium">Get assistance with campus services, technical issues, and facility maintenance.</p>
                    </div>
                    <button
                        onClick={handleOpenModal}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-3xl font-bold flex items-center shadow-xl shadow-indigo-100 transition-all active:scale-95 group"
                    >
                        <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                        Open New Ticket
                    </button>
                </div>
            )}

            {/* 2. Filters Bar (Hidden when viewing details) */}
            {!selectedTicketId && (
                <div className="bg-white p-4 rounded-3xl border border-slate-100 mb-8 flex flex-col xl:flex-row gap-4 items-center">
                    <div className="flex flex-wrap gap-2 w-full">
                        {/* Status Filter */}
                        <div className="relative flex-1 md:flex-none">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none w-full md:w-40 px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-600 cursor-pointer focus:ring-4 focus:ring-blue-50 transition-all pr-10"
                            >
                                <option value="ALL">All Status</option>
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Priority Filter */}
                        <div className="relative flex-1 md:flex-none">
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="appearance-none w-full md:w-36 px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-600 cursor-pointer focus:ring-4 focus:ring-blue-50 transition-all pr-10"
                            >
                                <option value="ALL">All Priority</option>
                                <option value="HIGH">High</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="LOW">Low</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Category Filter */}
                        <div className="relative flex-1 md:flex-none">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="appearance-none w-full md:w-44 px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-600 cursor-pointer focus:ring-4 focus:ring-blue-50 transition-all pr-10"
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
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Date From */}
                        <div className="flex-1 md:flex-none flex items-center bg-slate-50 rounded-2xl px-4 py-3 group focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                            <span className="text-[10px] font-black uppercase text-slate-400 mr-3">From</span>
                            <input
                                type="date"
                                value={dateFrom}
                                max={dateTo || today}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setDateFrom(val);
                                    if (dateTo && val > dateTo) setDateTo('');
                                }}
                                className="bg-transparent border-none p-0 text-sm font-bold text-slate-600 focus:ring-0 cursor-pointer"
                            />
                        </div>

                        {/* Date To */}
                        <div className="flex-1 md:flex-none flex items-center bg-slate-50 rounded-2xl px-4 py-3 group focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                            <span className="text-[10px] font-black uppercase text-slate-400 mr-3">To</span>
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
                                className="bg-transparent border-none p-0 text-sm font-bold text-slate-600 focus:ring-0 cursor-pointer"
                            />
                        </div>

                        {/* Clear Filters */}
                        <button
                            onClick={handleClearFilters}
                            disabled={statusFilter === 'ALL' && priorityFilter === 'ALL' && categoryFilter === 'ALL' && !dateFrom && !dateTo}
                            className="flex-1 md:flex-none xl:ml-auto flex items-center justify-center px-6 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Clear Filters
                        </button>
                    </div>
                </div>
            )}

            {/* 3. Render View (List or Detail) */}
            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-[3rem] border border-slate-100 shadow-sm animate-in fade-in duration-700">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin" />
                        <Loader2 className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <div className="mt-8 text-center space-y-2">
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Synchronizing Tickets</h3>
                        <p className="text-sm text-slate-400 font-medium">Connecting to Servers...</p>
                    </div>
                </div>
            ) : selectedTicketId ? (
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
