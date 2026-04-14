import React, { useState, useEffect, useContext } from 'react';
import { 
    X, AlertCircle, CheckCircle2, MessageSquare, Send, User, 
    Calendar, Wrench, Edit2, Trash2, Loader2, Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import Modal from '../../Common/Modal';

// Status styling mapping
const statusStyles = {
    'OPEN': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'IN_PROGRESS': 'bg-blue-50 text-blue-700 border-blue-200',
    'RESOLVED': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'CLOSED': 'bg-slate-50 text-slate-700 border-slate-200',
    'REJECTED': 'bg-red-50 text-red-700 border-red-200'
};

const TicketDetails = ({ ticketId, onClose, onUpdate }) => {
    const { user } = useContext(AuthContext);
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    
    // Tech assignment state
    const [technicians, setTechnicians] = useState([]);
    const [selectedTech, setSelectedTech] = useState('');
    
    // Status update state
    const [statusNotes, setStatusNotes] = useState('');
    
    // Comments state
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState('');
    
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (ticketId) {
            fetchTicketDetails();
            fetchComments();
            if (user?.role === 'ADMIN') {
                fetchTechnicians();
            }
        }
    }, [ticketId]);

    const fetchTicketDetails = async () => {
        try {
            const res = await api.get(`/tickets/${ticketId}`);
            setTicket(res.data);
            setSelectedTech(res.data.assignedTo || '');
        } catch (err) {
            toast.error('Failed to load ticket details');
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

    const fetchTechnicians = async () => {
        try {
            const res = await api.get('/users/technicians');
            setTechnicians(res.data);
        } catch (err) {
            console.error('Failed to load technicians', err);
        }
    };

    // --- ACTIONS ---

    const handleAssign = async () => {
        if (!selectedTech) return toast.error('Select a technician first');
        setActionLoading(true);
        try {
            await api.put(`/tickets/${ticketId}/assign`, { technicianId: selectedTech });
            toast.success('Technician assigned');
            fetchTicketDetails();
            onUpdate();
        } catch (err) {
            toast.error('Assignment failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if ((newStatus === 'REJECTED' || newStatus === 'RESOLVED') && !statusNotes.trim()) {
            return toast.error(`Please provide notes for marking as ${newStatus}`);
        }
        
        setActionLoading(true);
        try {
            await api.put(`/tickets/${ticketId}/status`, { status: newStatus, notes: statusNotes });
            toast.success(`Ticket marked as ${newStatus}`);
            setStatusNotes('');
            fetchTicketDetails();
            onUpdate();
        } catch (err) {
            toast.error('Failed to update status');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await api.post(`/tickets/${ticketId}/comments`, { content: newComment });
            setNewComment('');
            fetchComments();
        } catch (err) {
            toast.error('Failed to add comment');
        }
    };

    const handleUpdateComment = async (id) => {
        if (!editContent.trim()) return;
        try {
            await api.put(`/comments/${id}`, { content: editContent });
            setEditingComment(null);
            fetchComments();
        } catch (err) {
            toast.error('Failed to update comment');
        }
    };

    const handleDeleteComment = async (id) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await api.delete(`/comments/${id}`);
            fetchComments();
        } catch (err) {
            toast.error('Failed to delete comment');
        }
    };

    if (loading || !ticket) {
        return (
            <div className="p-12 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                <p className="text-slate-400 font-bold">Loading records...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[85vh] bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-start shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-black font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                            {ticket.id.substring(0, 8).toUpperCase()}
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${statusStyles[ticket.status]}`}>
                            {ticket.status}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{ticket.category} Issue</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={20} className="text-slate-400" />
                </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Details Card */}
                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                    <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-slate-100">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Reported By</p>
                            <p className="text-sm font-bold text-slate-700 flex items-center">
                                <User size={14} className="mr-2 text-slate-400" /> {ticket.createdByName}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                            <p className="text-sm font-medium text-slate-600">{ticket.contactDetails || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</p>
                        <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                            {ticket.description}
                        </p>
                    </div>

                    {/* Images */}
                    {ticket.imageUrls && ticket.imageUrls.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Attachments</p>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {ticket.imageUrls.map((url, i) => (
                                    <a key={i} href={url} target="_blank" rel="noreferrer" className="flex-shrink-0">
                                        <img src={url} alt="Attachment" className="h-24 w-24 object-cover rounded-2xl border border-slate-200 hover:opacity-80 transition-opacity" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Resolution / Rejection Alert */}
                {ticket.status === 'RESOLVED' && ticket.resolutionNotes && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-[2rem] p-6 flex gap-4">
                        <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-emerald-800 mb-1">Resolution Notes</h4>
                            <p className="text-sm text-emerald-700">{ticket.resolutionNotes}</p>
                        </div>
                    </div>
                )}

                {ticket.status === 'REJECTED' && ticket.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-[2rem] p-6 flex gap-4">
                        <AlertCircle className="text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-red-800 mb-1">Rejection Reason</h4>
                            <p className="text-sm text-red-700">{ticket.rejectionReason}</p>
                        </div>
                    </div>
                )}

                {/* ACTION PANELS (Role Based) */}
                {ticket.status !== 'CLOSED' && ticket.status !== 'REJECTED' && (
                    <div className="space-y-4">
                        {/* ADMIN PANEL */}
                        {user.role === 'ADMIN' && (
                            <div className="bg-white rounded-[2rem] border border-blue-100 p-6 shadow-sm shadow-blue-50">
                                <h3 className="font-black text-slate-800 mb-4 flex items-center">
                                    <Wrench size={16} className="mr-2 text-blue-500" /> Admin Controls
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <select 
                                            value={selectedTech}
                                            onChange={(e) => setSelectedTech(e.target.value)}
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-100"
                                        >
                                            <option value="">Select Technician...</option>
                                            {technicians.map(t => (
                                                <option key={t.id} value={t.id}>{t.name} ({t.specialization || 'General'})</option>
                                            ))}
                                        </select>
                                        <button 
                                            onClick={handleAssign}
                                            disabled={actionLoading}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                                        >
                                            Assign
                                        </button>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <input 
                                            type="text" 
                                            placeholder="Notes (Required for Rejection)" 
                                            value={statusNotes}
                                            onChange={(e) => setStatusNotes(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium mb-3"
                                        />
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => handleStatusUpdate('REJECTED')}
                                                disabled={actionLoading}
                                                className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
                                            >
                                                Reject Ticket
                                            </button>
                                            <button 
                                                onClick={() => handleStatusUpdate('CLOSED')}
                                                disabled={actionLoading}
                                                className="flex-1 bg-slate-800 text-white hover:bg-slate-900 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
                                            >
                                                Close Ticket
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TECHNICIAN PANEL */}
                        {user.role === 'TECHNICIAN' && user.id === ticket.assignedTo && (
                            <div className="bg-white rounded-[2rem] border border-blue-100 p-6 shadow-sm shadow-blue-50">
                                <h3 className="font-black text-slate-800 mb-4 flex items-center">
                                    <Wrench size={16} className="mr-2 text-blue-500" /> Technician Controls
                                </h3>
                                
                                {ticket.status === 'OPEN' && (
                                    <button 
                                        onClick={() => handleStatusUpdate('IN_PROGRESS')}
                                        disabled={actionLoading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all"
                                    >
                                        Start Work (Mark In-Progress)
                                    </button>
                                )}

                                {ticket.status === 'IN_PROGRESS' && (
                                    <div className="space-y-3">
                                        <textarea
                                            placeholder="Enter resolution notes... (Required)"
                                            value={statusNotes}
                                            onChange={(e) => setStatusNotes(e.target.value)}
                                            rows={3}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-100"
                                        />
                                        <button 
                                            onClick={() => handleStatusUpdate('RESOLVED')}
                                            disabled={actionLoading}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all"
                                        >
                                            Mark as Resolved
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Comments Section */}
                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-6 flex items-center">
                        <MessageSquare size={16} className="mr-2 text-slate-400" /> Discussion
                    </h3>
                    
                    <div className="space-y-5 mb-6">
                        {comments.length === 0 ? (
                            <p className="text-center text-sm text-slate-400 font-medium italic py-4">No comments yet</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} className={`flex gap-3 ${comment.userId === user.id ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                        <span className="text-blue-600 font-bold text-xs">{comment.authorName.charAt(0)}</span>
                                    </div>
                                    <div className={`flex flex-col ${comment.userId === user.id ? 'items-end' : 'items-start'} max-w-[80%]`}>
                                        <span className="text-[10px] font-bold text-slate-400 mb-1 mx-1">
                                            {comment.authorName} • {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                        
                                        {editingComment === comment.id ? (
                                            <div className="bg-slate-50 p-3 rounded-2xl border border-blue-200 w-full shrink-0">
                                                <textarea 
                                                    value={editContent}
                                                    onChange={e => setEditContent(e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-sm mb-2"
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setEditingComment(null)} className="text-xs font-bold text-slate-500 px-3 py-1">Cancel</button>
                                                    <button onClick={() => handleUpdateComment(comment.id)} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">Save</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="group relative">
                                                <div className={`p-4 rounded-2xl text-sm ${
                                                    comment.userId === user.id 
                                                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                                                        : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-sm'
                                                }`}>
                                                    {comment.content}
                                                </div>
                                                
                                                {/* Ownership controls */}
                                                {comment.userId === user.id && (
                                                    <div className={`absolute top-0 ${comment.userId === user.id ? 'right-full mr-2' : 'left-full ml-2'} opacity-0 group-hover:opacity-100 transition-opacity flex gap-1`}>
                                                        <button 
                                                            onClick={() => { setEditingComment(comment.id); setEditContent(comment.content); }}
                                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                                                        >
                                                            <Edit2 size={12} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <form onSubmit={handleAddComment} className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Add a comment..." 
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                        <button type="submit" disabled={!newComment.trim()} className="bg-slate-800 text-white p-3 rounded-2xl hover:bg-slate-900 disabled:opacity-50 transition-colors">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails;
