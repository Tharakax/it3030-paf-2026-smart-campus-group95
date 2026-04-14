import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { AlertCircle, CheckCircle2, Loader2, PlayCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axiosConfig';
import TicketCard from '../Tickets/TicketCard';
import TicketDetails from '../Tickets/TicketDetails';
import Modal from '../../Common/Modal';

const TechnicianTasks = () => {
    const { user } = useContext(AuthContext);
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

    // Filter tickets
    const myActiveTasks = tickets.filter(t => 
        t.assignedTo === user.id && 
        t.status !== 'CLOSED' && 
        t.status !== 'REJECTED' &&
        t.status !== 'RESOLVED'
    );

    const pendingResolutionTasks = tickets.filter(t => 
        t.assignedTo === user.id && 
        t.status === 'RESOLVED'
    );

    const unassignedOpenTickets = tickets.filter(t => 
        !t.assignedTo && 
        t.status === 'OPEN'
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Maintenance Tasks</h1>
                <p className="text-slate-500 mt-1 font-medium">Manage your assigned incidents and view pending campus reports.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                    <p className="text-slate-400 font-bold">Loading tasks...</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* My Active Tasks Section */}
                    <div>
                        <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center">
                            <PlayCircle className="text-blue-600 w-6 h-6 mr-3" />
                            My Active Tasks
                            <span className="ml-3 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-black">
                                {myActiveTasks.length}
                            </span>
                        </h2>
                        
                        {myActiveTasks.length === 0 ? (
                            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center">
                                <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-bold">You have no active tasks.</p>
                                <p className="text-slate-400 text-sm mt-1">Check unassigned tickets below or wait for a new assignment.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myActiveTasks.map(tkt => (
                                    <TicketCard key={tkt.id} ticket={tkt} onClick={() => openTicket(tkt.id)} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pending Resolution (My Resolved Tasks waiting for close) */}
                    {pendingResolutionTasks.length > 0 && (
                        <div>
                            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center">
                                <CheckCircle2 className="text-emerald-500 w-6 h-6 mr-3" />
                                Resolved (Awaiting Closure)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingResolutionTasks.map(tkt => (
                                    <TicketCard key={tkt.id} ticket={tkt} onClick={() => openTicket(tkt.id)} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Unassigned Open Tickets Section */}
                    <div>
                        <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center">
                            <Clock className="text-amber-500 w-6 h-6 mr-3" />
                            Unassigned Global Reports
                            <span className="ml-3 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-black">
                                {unassignedOpenTickets.length}
                            </span>
                        </h2>
                        
                        {unassignedOpenTickets.length === 0 ? (
                            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center">
                                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-bold">No unassigned tickets found.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity">
                                {unassignedOpenTickets.map(tkt => (
                                    <TicketCard key={tkt.id} ticket={tkt} onClick={() => openTicket(tkt.id)} />
                                ))}
                            </div>
                        )}
                    </div>
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

export default TechnicianTasks;
