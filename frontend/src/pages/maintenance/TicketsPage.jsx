import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import incidentService from '../../api/maintenance/incidentService';
import IncidentCard from '../../components/maintenance/IncidentCard';
import IncidentForm from '../../components/maintenance/IncidentForm';
import { Plus, Filter, Search, Loader2, LayoutGrid, List as ListIcon, AlertCircle, ChevronDown } from 'lucide-react';

const TicketsPage = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [tickets, filter, searchTerm]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const data = await incidentService.getAllTickets();
            setTickets(data);
        } catch (err) {
            console.error("Failed to fetch tickets", err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = tickets;

        if (filter !== 'ALL') {
            result = result.filter(t => t.status === filter);
        }

        if (searchTerm) {
            result = result.filter(t =>
                t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredTickets(result);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                                Maintenance <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent underline decoration-blue-200 decoration-4">Hub</span>
                            </h1>
                            <p className="text-slate-500 mt-2 font-medium">Manage and track campus infrastructure incidents.</p>
                        </div>

                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all active:scale-95 group"
                        >
                            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                            Report Incident
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, category or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium shadow-sm"
                        />
                    </div>

                    <div className="relative">
                        <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-3.5 shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}>
                            <Filter className="w-4 h-4 mr-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            <span className="text-sm font-bold text-slate-700 min-w-[100px]">
                                {filter.replace('_', ' ')}
                            </span>
                            <ChevronDown className={`w-4 h-4 ml-8 text-slate-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {isFilterOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                                <div className="absolute top-full mt-3 left-0 w-64 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-2xl shadow-blue-500/15 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="p-2 space-y-1">
                                        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'].map((f) => (
                                            <button
                                                key={f}
                                                onClick={() => { setFilter(f); setIsFilterOpen(false); }}
                                                className={`w-full text-left px-4 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-between ${filter === f
                                                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-3'
                                                    : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-l-4 border-transparent'
                                                    }`}
                                            >
                                                {f.replace('_', ' ')}
                                                {filter === f && <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-transparent text-slate-400 hover:bg-slate-50'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-transparent text-slate-400 hover:bg-slate-50'}`}
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-slate-500 font-medium animate-pulse">Syncing tickets...</p>
                    </div>
                ) : filteredTickets.length > 0 ? (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                        {filteredTickets.map(ticket => (
                            <IncidentCard
                                key={ticket.id}
                                incident={ticket}
                                onClick={(id) => window.location.href = `/tickets/${id}`}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="bg-slate-50 p-6 rounded-full mb-4">
                            <AlertCircle className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">No tickets found</h3>
                        <p className="text-slate-400 max-w-xs text-center mt-2">Try adjusting your filters or report a new incident if something is broken.</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <IncidentForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={fetchTickets}
            />
        </div>
    );
};

export default TicketsPage;
