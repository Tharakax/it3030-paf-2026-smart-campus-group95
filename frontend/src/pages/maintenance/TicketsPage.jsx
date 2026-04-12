import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import incidentService from '../../api/maintenance/incidentService';
import IncidentCard from '../../components/maintenance/IncidentCard';
import IncidentForm from '../../components/maintenance/IncidentForm';
import { Plus, Filter, Search, Loader2, LayoutGrid, List as ListIcon, AlertCircle } from 'lucide-react';

const TicketsPage = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');

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
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Maintenance <span className="text-blue-600">Hub</span></h1>
                            <p className="text-slate-500 mt-2 font-medium">Manage and track campus infrastructure incidents.</p>
                        </div>
                        
                        <button 
                            onClick={() => setIsFormOpen(true)}
                            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
                        >
                            <Plus className="w-5 h-5 mr-2" />
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
                            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium shadow-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                                    filter === f 
                                    ? 'bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200' 
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}
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
