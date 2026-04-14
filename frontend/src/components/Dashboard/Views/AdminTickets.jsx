import React, { useState, useEffect } from 'react';
import { AlertCircle, Search, Filter, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axiosConfig';
import TicketCard from '../Tickets/TicketCard';
import TicketDetails from '../Tickets/TicketDetails';
import Modal from '../../Common/Modal';

const AdminTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal state
    const [selectedTicketId, setSelectedTicketId] = useState(null);

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

    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'OPEN').length,
        inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        resolved: tickets.filter(t => t.status === 'RESOLVED').length
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Incident Management</h1>
                <p className="text-slate-500 mt-1 font-medium">Monitor and assign campus incidents globally.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Tickets</span>
                    <span className="text-3xl font-black text-slate-800">{stats.total}</span>
                </div>
                <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex flex-col">
                    <span className="text-indigo-500 text-xs font-bold uppercase tracking-widest mb-2">Open</span>
                    <span className="text-3xl font-black text-indigo-700">{stats.open}</span>
                </div>
                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex flex-col">
                    <span className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-2">In Progress</span>
                    <span className="text-3xl font-black text-blue-700">{stats.inProgress}</span>
                </div>
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex flex-col">
                    <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-2">Resolved</span>
                    <span className="text-3xl font-black text-emerald-700">{stats.resolved}</span>
                </div>
            </div>

            {/* Main Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                    <p className="text-slate-400 font-bold">Loading global tickets...</p>
                </div>
            ) : tickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-100">
                    <CheckCircle2 className="w-12 h-12 text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold text-lg">No active incidents</p>
                    <p className="text-slate-400 text-sm mt-1">Campus is running smoothly.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.map((tkt) => (
                        <TicketCard 
                            key={tkt.id} 
                            ticket={tkt} 
                            onClick={() => openTicket(tkt.id)} 
                        />
                    ))}
                </div>
            )}

            {/* Ticket Details Modal */}
            <Modal
                isOpen={!!selectedTicketId}
                onClose={closeTicket}
                title="Incident Details"
            >
                {selectedTicketId && (
                    <TicketDetails 
                        ticketId={selectedTicketId} 
                        onClose={closeTicket}
                        onUpdate={fetchTickets}
                    />
                )}
            </Modal>
        </div>
    );
};

export default AdminTickets;
