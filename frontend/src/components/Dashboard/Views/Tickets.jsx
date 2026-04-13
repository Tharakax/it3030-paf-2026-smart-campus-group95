import React, { useState } from 'react';
import { 
    Plus, 
    AlertCircle, 
    CheckCircle2,
    Calendar,
    Search,
    Filter
} from 'lucide-react';
import Modal from '../../Common/Modal';
import TicketForm from '../Tickets/TicketForm';

const Tickets = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tickets, setTickets] = useState([
        { id: 'TKT-7821', title: 'WiFi Connectivity in Block C', priority: 'HIGH', status: 'In Progress', date: '2 days ago', category: 'IT & Network Support' },
        { id: 'TKT-7845', title: 'Library Card Not Working', priority: 'MEDIUM', status: 'Resolved', date: '5 days ago', category: 'IT & Network Support' },
        { id: 'TKT-7890', title: 'Broken Chair in Lab 03', priority: 'LOW', status: 'Pending', date: '1 day ago', category: 'Furniture & Fixtures' }
    ]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleFormSubmit = (data) => {
        const newTicket = {
            id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
            title: data.description.substring(0, 30) + (data.description.length > 30 ? '...' : ''),
            priority: data.priority,
            status: 'Pending',
            date: 'Just now',
            category: data.category
        };
        setTickets([newTicket, ...tickets]);
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

            {/* Tickets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tickets.map((tkt, i) => (
                    <div 
                        key={i} 
                        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                    >
                        {/* Status Accent */}
                        <div className={`absolute top-0 left-0 w-full h-1.5 ${
                            tkt.status === 'Resolved' ? 'bg-emerald-500' : 'bg-indigo-500'
                        }`} />

                        <div className="flex justify-between items-start mb-6">
                            <span className="text-[10px] font-black font-mono text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl tracking-widest border border-slate-100">{tkt.id}</span>
                            <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                                tkt.priority === 'HIGH' 
                                    ? 'bg-red-50 text-red-500 border-red-100' 
                                    : tkt.priority === 'MEDIUM' 
                                        ? 'bg-amber-50 text-amber-500 border-amber-100'
                                        : 'bg-emerald-50 text-emerald-500 border-emerald-100'
                            }`}>{tkt.priority} Priority</span>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-tighter mb-1 opacity-70">{tkt.category}</p>
                            <h4 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{tkt.title}</h4>
                        </div>

                        <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-50">
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${
                                    tkt.status === 'Resolved' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse'
                                }`} />
                                <span className="text-sm font-bold text-slate-500">{tkt.status}</span>
                            </div>
                            <span className="text-xs text-slate-400 font-bold">{tkt.date}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal & Form Integration */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Create Incident Ticket"
            >
                <TicketForm 
                    onSubmit={handleFormSubmit}
                    onClose={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default Tickets;
