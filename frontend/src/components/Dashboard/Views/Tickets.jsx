import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    AlertCircle, 
    CheckCircle2,
    Calendar,
    Search,
    Filter,
    Loader2
} from 'lucide-react';
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

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    
    const closeTicketDetails = () => setSelectedTicketId(null);

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
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center">
                        Support Tickets
                        <span className="ml-3 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg border border-blue-100">
                            {tickets.length} Active
                        </span>
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

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search tickets by ID or title..."
                        className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-4 focus:ring-blue-50 transition-all"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center px-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center px-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
                    <p className="text-slate-400 font-medium text-sm">Loading tickets...</p>
                </div>
            ) : tickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-100">
                    <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold text-lg">No tickets yet</p>
                    <p className="text-slate-400 text-sm mt-1">Click "Open New Ticket" to report an incident.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.map((tkt) => (
                        <TicketCard key={tkt.id} ticket={tkt} onClick={() => setSelectedTicketId(tkt.id)} />
                    ))}
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

            {/* Ticket Details Modal */}
            <Modal
                isOpen={!!selectedTicketId}
                onClose={closeTicketDetails}
                title="Incident Details"
            >
                {selectedTicketId && (
                    <TicketDetails 
                        ticketId={selectedTicketId} 
                        onClose={closeTicketDetails}
                        onUpdate={fetchTickets}
                    />
                )}
            </Modal>
        </div>
    );
};

export default Tickets;
