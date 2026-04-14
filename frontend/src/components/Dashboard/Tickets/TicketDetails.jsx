import React, { useState, useEffect, useContext } from 'react';
import { 
    X, 
    ArrowLeft, 
    Clock, 
    MapPin, 
    AlertCircle, 
    CheckCircle2, 
    User, 
    Send, 
    Wrench, 
    ShieldAlert, 
    MessageCircle,
    FileText,
    History,
    Calendar,
    ChevronRight,
    Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';

const TicketDetails = ({ ticketId, onClose, onUpdate }) => {
    const { user } = useContext(AuthContext);
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (ticketId) {
            fetchTicketDetails();
            fetchComments();
        }
    }, [ticketId]);

    const fetchTicketDetails = async () => {
        try {
            const res = await api.get(`/tickets/${ticketId}`);
            setTicket(res.data);
        } catch (err) {
            toast.error('Failed to load incident details');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await api.get(`/tickets/${ticketId}/comments`);
            setComments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await api.post(`/tickets/${ticketId}/comments`, { content: newComment });
            setNewComment('');
            fetchComments();
            toast.success('Comment added');
        } catch (err) {
            toast.error('Failed to post comment');
        }
    };

    if (loading || !ticket) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-6 opacity-20" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Analyzing Incident Logs...</p>
            </div>
        );
    }

    // Stepper logic
    const statusSteps = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    const currentStepIndex = statusSteps.indexOf(ticket.status);
    const isRejected = ticket.status === 'REJECTED';

    return (
        <div className="p-8 md:p-4 text-slate-600 min-h-screen">
            
            {/* Header: Navigation & Status Pin */}
            <div className="flex justify-between items-center mb-12">
                <button 
                    onClick={onClose}
                    className="flex items-center space-x-3 text-slate-400 hover:text-slate-600 transition-colors group"
                >
                    <div className="p-3 bg-white rounded-2xl group-hover:bg-slate-100 transition-all border border-slate-100 shadow-sm">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-xs">Back to Reports</span>
                </button>

                <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Stage</p>
                        <p className="text-sm font-black text-slate-700 tracking-tight">
                            {ticket.status === 'IN_PROGRESS' ? 'Under Repair' : ticket.status === 'OPEN' ? 'Reviewing' : 'Completed'}
                        </p>
                    </div>
                    <div className={`pl-8 pr-12 py-5 rounded-[2rem] text-[13px] font-black uppercase tracking-[0.3em] border-y border-r transition-all duration-500 flex items-center space-x-5 shadow-lg ${
                        ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'text-emerald-700 bg-emerald-50/90 border-emerald-200 border-l-[8px] border-l-emerald-500 shadow-emerald-200/40' :
                        ticket.status === 'REJECTED' ? 'text-rose-700 bg-rose-50/80 border-rose-200 border-l-[8px] border-l-rose-500 shadow-rose-200/40' :
                        ticket.status === 'IN_PROGRESS' ? 'text-violet-700 bg-violet-50/80 border-violet-200 border-l-[8px] border-l-violet-500 shadow-violet-200/40' :
                        'text-indigo-700 bg-indigo-50/80 border-indigo-200 border-l-[8px] border-l-indigo-500 shadow-indigo-200/40'
                    }`}>
                        <div className={`w-3.5 h-3.5 rounded-full animate-ping absolute -ml-1 ${
                            ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'bg-emerald-400' :
                            ticket.status === 'REJECTED' ? 'bg-rose-400' :
                            ticket.status === 'IN_PROGRESS' ? 'bg-violet-400' :
                            'bg-indigo-400'
                        }`} />
                        <div className={`w-3 h-3 rounded-full relative ${
                            ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'bg-emerald-500' :
                            ticket.status === 'REJECTED' ? 'bg-rose-500' :
                            'bg-current'
                        }`} />
                        <span>{ticket.status.replace('_', ' ')}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Hero Title Area */}
                    <div className="relative p-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="bg-white p-10 rounded-[2.4rem]">
                            <span className="text-indigo-500 font-mono text-xs font-bold tracking-widest block mb-3 opacity-60">#{ticket.id.substring(0, 8).toUpperCase()}</span>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase mb-8">{ticket.category.replace('_', ' ')} ISSUE</h1>

                            {/* Stepper Implementation */}
                            {!isRejected && (
                                <div className="relative pt-10 mb-6 px-4">
                                    <div className="absolute top-[3.25rem] left-8 right-8 h-1 bg-slate-100 rounded-full" />
                                    <div className="absolute top-[3.25rem] left-8 h-1 bg-indigo-600 transition-all duration-1000 rounded-full" 
                                         style={{ width: `calc(${(currentStepIndex / (statusSteps.length - 1)) * 100}% - 4rem)` }} 
                                    />
                                    
                                    <div className="relative flex justify-between items-center">
                                        {statusSteps.map((step, idx) => {
                                            const isActive = idx <= currentStepIndex;
                                            const isCurrent = idx === currentStepIndex;
                                            return (
                                                <div key={idx} className="flex flex-col items-center">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 z-10 ${
                                                        isCurrent ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.3)]' :
                                                        isActive ? 'bg-emerald-500 border-emerald-400' : 
                                                        'bg-white border-slate-200'
                                                    }`}>
                                                        {isActive ? <CheckCircle2 className="w-5 h-5 text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />}
                                                    </div>
                                                    <span className={`mt-4 text-[10px] font-black uppercase tracking-tighter transition-colors ${
                                                        isActive ? 'text-slate-800' : 'text-slate-400'
                                                    }`}>
                                                        {step.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {isRejected && (
                                <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex items-center space-x-4 mb-8">
                                    <ShieldAlert className="text-rose-500 w-8 h-8" />
                                    <div>
                                        <h4 className="font-black text-rose-500 uppercase tracking-widest text-xs">Report Rejected</h4>
                                        <p className="text-sm text-slate-500 mt-1">{ticket.rejectionReason || "This report does not align with our campus guidelines."}</p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-12">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center">
                                    <FileText className="w-4 h-4 mr-2 text-indigo-500" /> Incident Description
                                </h3>
                                <div className="text-slate-700 leading-relaxed text-lg bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50">
                                    {ticket.description}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resolution Section (Visible only if Resolved) */}
                    {(ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') && ticket.resolutionNotes && (
                        <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-100 shadow-sm transition-all">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2.5 bg-emerald-50 rounded-xl">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                </div>
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider">Resolution & Technical Report</h3>
                            </div>
                            <div className="text-slate-600 leading-relaxed font-medium text-sm whitespace-pre-wrap bg-slate-50 p-6 rounded-2xl border border-slate-100/50">
                                {ticket.resolutionNotes}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    
                    {/* Quick Info Card */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 px-1">Quick Info</h4>
                        
                        <div className="space-y-8">
                            <div className="flex items-start space-x-5">
                                <div className={`p-3 rounded-2xl border ${
                                    ticket.priority === 'HIGH' ? 'bg-red-50 border-red-100 text-red-500' :
                                    ticket.priority === 'MEDIUM' ? 'bg-amber-50 border-amber-100 text-amber-500' :
                                    'bg-sky-50 border-sky-100 text-sky-500'
                                }`}>
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400 block">Priority</span>
                                    <span className={`font-black uppercase text-sm tracking-wider ${
                                        ticket.priority === 'HIGH' ? 'text-red-600' :
                                        ticket.priority === 'MEDIUM' ? 'text-amber-600' :
                                        'text-sky-600'
                                    }`}>{ticket.priority}</span>
                                    <div className="h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                        <div className={`h-full transition-all duration-1000 ${
                                            ticket.priority === 'HIGH' ? 'w-full bg-red-500' : 
                                            ticket.priority === 'MEDIUM' ? 'w-2/3 bg-amber-500' : 
                                            'w-1/3 bg-sky-500'
                                        }`} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start space-x-5">
                                <div className="p-3 bg-fuchsia-50 rounded-2xl border border-fuchsia-100">
                                    <MapPin className="w-5 h-5 text-fuchsia-600" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400 block">Resource Name</span>
                                    <span className="text-slate-800 font-black text-sm">{ticket.resourceName || "Campus General"}</span>
                                </div>
                            </div>

                            <div className="flex items-start space-x-5">
                                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                                    <ShieldAlert className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400 block">Department / Faculty</span>
                                    <span className="text-slate-800 font-black text-sm uppercase">
                                        {ticket.department ? ticket.department.replace(/_/g, ' ') : "General Campus"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start space-x-5">
                                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <Calendar className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400 block">Reported On</span>
                                    <span className="text-slate-800 font-black text-sm">{new Date(ticket.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    <span className="block text-[10px] text-slate-400 mt-0.5 uppercase font-bold">{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity & Comment Box */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 blur-3xl rounded-full -mr-16 -mt-16" />
                        
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-100">
                                <div className="w-full h-full bg-white rounded-[0.9rem] flex items-center justify-center">
                                    <User className="text-indigo-600 w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <span className="text-slate-800 font-black text-xs uppercase block">{ticket.assignedToName || "Unassigned"}</span>
                                <span className="text-indigo-600 font-bold text-[9px] tracking-widest uppercase">Lead Technician</span>
                            </div>
                        </div>

                        <form onSubmit={handleAddComment} className="relative">
                            <textarea 
                                placeholder="Add a comment..." 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-6 text-sm text-slate-700 placeholder-slate-400 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-200 transition-all outline-none resize-none"
                                rows={4}
                            />
                            <button 
                                type="submit"
                                disabled={!newComment.trim()}
                                className="mt-4 w-full py-4 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-2xl flex items-center justify-center space-x-3 text-white shadow-xl shadow-slate-200"
                            >
                                <span className="text-xs font-black uppercase tracking-widest">Post Update</span>
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TicketDetails;
