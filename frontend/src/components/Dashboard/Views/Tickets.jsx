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
    ClipboardCheck,
    Ticket,
    Inbox,
    Clock,
    CheckCheck,
    SlidersHorizontal
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
    const [showFilters, setShowFilters] = useState(false);

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

    const hasActiveFilters = statusFilter !== 'ALL' || priorityFilter !== 'ALL' || categoryFilter !== 'ALL' || dateFrom || dateTo;

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

                const ticketDate = ticket.createdAt ? ticket.createdAt.split('T')[0] : '';
                const matchesDateFrom = !dateFrom || ticketDate >= dateFrom;
                const matchesDateTo = !dateTo || ticketDate <= dateTo;

                return matchesStatus && matchesPriority && matchesCategory && matchesDateFrom && matchesDateTo;
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [tickets, statusFilter, priorityFilter, categoryFilter, dateFrom, dateTo]);

    // Split filtered tickets into status-based pipeline sections
    const sections = useMemo(() => {
        const groups = {
            open: [],
            inProgress: [],
            resolved: [],
            closed: []
        };

        filteredTickets.forEach(tkt => {
            if (tkt.status === 'OPEN') {
                groups.open.push(tkt);
            } else if (tkt.status === 'IN_PROGRESS') {
                groups.inProgress.push(tkt);
            } else if (tkt.status === 'RESOLVED') {
                groups.resolved.push(tkt);
            } else {
                groups.closed.push(tkt);
            }
        });

        return groups;
    }, [filteredTickets]);

    const totalCount = filteredTickets.length;
    const openCount = sections.open.length;
    const inProgressCount = sections.inProgress.length;
    const resolvedCount = sections.resolved.length;

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'IN_PROGRESS': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'RESOLVED': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header Section - Hidden when viewing details */}
                {!selectedTicketId && (
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                                    Service Tickets
                                </h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    Track and manage your facility service requests
                                </p>
                            </div>
                            <button
                                onClick={handleOpenModal}
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                            >
                                <Plus className="w-4 h-4" />
                                New Ticket
                            </button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Total</p>
                                        <p className="text-2xl font-bold text-slate-800">{totalCount}</p>
                                    </div>
                                    <div className="p-2 bg-slate-100 rounded-lg">
                                        <Ticket className="w-5 h-5 text-slate-500" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Open</p>
                                        <p className="text-2xl font-bold text-blue-600">{openCount}</p>
                                    </div>
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Inbox className="w-5 h-5 text-blue-500" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">In Progress</p>
                                        <p className="text-2xl font-bold text-amber-600">{inProgressCount}</p>
                                    </div>
                                    <div className="p-2 bg-amber-50 rounded-lg">
                                        <Clock className="w-5 h-5 text-amber-500" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Resolved</p>
                                        <p className="text-2xl font-bold text-emerald-600">{resolvedCount}</p>
                                    </div>
                                    <div className="p-2 bg-emerald-50 rounded-lg">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters Bar - Hidden when viewing details */}
                {!selectedTicketId && (
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filters
                                {hasActiveFilters && (
                                    <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                                        Active
                                    </span>
                                )}
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                            {hasActiveFilters && (
                                <button
                                    onClick={handleClearFilters}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition-all border border-rose-100 shadow-sm"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    Clear all
                                </button>
                            )}
                        </div>

                        {showFilters && (
                            <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                    {/* Status Filter */}
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Status</label>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 outline-none"
                                        >
                                            <option value="ALL">All Status</option>
                                            <option value="OPEN">Open</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="RESOLVED">Resolved</option>
                                            <option value="CLOSED">Closed</option>
                                            <option value="REJECTED">Rejected</option>
                                        </select>
                                    </div>

                                    {/* Priority Filter */}
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Priority</label>
                                        <select
                                            value={priorityFilter}
                                            onChange={(e) => setPriorityFilter(e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 outline-none"
                                        >
                                            <option value="ALL">All Priorities</option>
                                            <option value="HIGH">High</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="LOW">Low</option>
                                        </select>
                                    </div>

                                    {/* Category Filter */}
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Category</label>
                                        <select
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 outline-none"
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
                                    </div>

                                    {/* Date From */}
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1.5">From Date</label>
                                        <input
                                            type="date"
                                            value={dateFrom}
                                            max={dateTo || today}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setDateFrom(val);
                                                if (dateTo && val > dateTo) setDateTo('');
                                            }}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 outline-none"
                                        />
                                    </div>

                                    {/* Date To */}
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1.5">To Date</label>
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
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Main Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm mt-6">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                        <p className="text-slate-500 font-medium">Loading tickets...</p>
                    </div>
                ) : selectedTicketId ? (
                    <TicketDetails
                        ticketId={selectedTicketId}
                        onClose={closeTicketDetails}
                        onUpdate={fetchTickets}
                    />
                ) : filteredTickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm mt-6">
                        <div className="p-4 bg-slate-100 rounded-full mb-4">
                            <Ticket className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-1">No tickets found</h3>
                        <p className="text-sm text-slate-400">
                            {hasActiveFilters ? 'Try adjusting your filters' : 'Create your first ticket to get started'}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="mt-6 px-6 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-semibold transition-all shadow-sm"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8 mt-6">
                        {/* Open Tickets Section */}
                        {sections.open.length > 0 && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-1.5 bg-blue-100 rounded-lg">
                                        <Inbox className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <h2 className="text-base font-semibold text-slate-700">Open Requests</h2>
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
                                        {sections.open.length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {sections.open.map((ticket) => (
                                        <TicketCard key={ticket.id} ticket={ticket} onClick={() => setSelectedTicketId(ticket.id)} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* In Progress Tickets Section */}
                        {sections.inProgress.length > 0 && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-1.5 bg-amber-100 rounded-lg">
                                        <Clock className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <h2 className="text-base font-semibold text-slate-700">In Progress</h2>
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
                                        {sections.inProgress.length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {sections.inProgress.map((ticket) => (
                                        <TicketCard key={ticket.id} ticket={ticket} onClick={() => setSelectedTicketId(ticket.id)} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Resolved Tickets Section */}
                        {sections.resolved.length > 0 && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <h2 className="text-base font-semibold text-slate-700">Resolved</h2>
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
                                        {sections.resolved.length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {sections.resolved.map((ticket) => (
                                        <TicketCard key={ticket.id} ticket={ticket} onClick={() => setSelectedTicketId(ticket.id)} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Closed Tickets Section */}
                        {sections.closed.length > 0 && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-1.5 bg-slate-100 rounded-lg">
                                        <CheckCheck className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <h2 className="text-base font-semibold text-slate-500">Closed</h2>
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-xs rounded-full">
                                        {sections.closed.length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 opacity-75 hover:opacity-100 transition-opacity">
                                    {sections.closed.map((ticket) => (
                                        <TicketCard key={ticket.id} ticket={ticket} onClick={() => setSelectedTicketId(ticket.id)} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Create Ticket Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title="Create Service Ticket"
                >
                    <TicketForm
                        onSubmit={handleFormSubmit}
                        onClose={handleCloseModal}
                        submitting={submitting}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default Tickets;