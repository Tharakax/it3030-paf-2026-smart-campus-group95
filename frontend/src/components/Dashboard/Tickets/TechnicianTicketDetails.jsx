import React, { useState, useEffect, useContext } from 'react';
import { 
    ArrowLeft, 
    Calendar, 
    Tag, 
    User, 
    Building2, 
    Clock, 
    Loader2, 
    CheckCircle2, 
    AlertCircle, 
    ShieldAlert, 
    Activity, 
    Send, 
    MoreVertical, 
    Edit2, 
    Trash2, 
    UserPlus,
    X,
    MessageCircle,
    Wrench,
    MapPin,
    Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import Modal from '../../Common/Modal';

const TechnicianTicketDetails = ({ ticketId, onClose, onUpdate }) => {
    const { user } = useContext(AuthContext);
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [selectedPreviewImage, setSelectedPreviewImage] = useState(null);

    // Resolution state
    const [isResolving, setIsResolving] = useState(false);
    const [issueIdentified, setIssueIdentified] = useState('');
    const [actionTaken, setActionTaken] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchTicketDetails = async () => {
        try {
            const [ticketRes, commentsRes] = await Promise.all([
                api.get(`/tickets/${ticketId}`),
                api.get(`/tickets/${ticketId}/comments`)
            ]);
            setTicket(ticketRes.data);
            setComments(commentsRes.data);
        } catch (err) {
            toast.error('Failed to load incident details.');
            onClose();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTicketDetails();
    }, [ticketId]);

    const handleStatusUpdate = async (newStatus, notes = '') => {
        setActionLoading(true);
        try {
            const payload = { 
                status: newStatus, 
                notes: notes,
                resolutionNotes: newStatus === 'RESOLVED' ? {
                    issueIdentified,
                    actionTaken,
                    resolvedAt: new Date().toISOString()
                } : null
            };
            await api.put(`/tickets/${ticketId}/status`, payload);
            toast.success(`Success: Ticket marked as ${newStatus.replace('_', ' ')}`);
            fetchTicketDetails();
            onUpdate();
            setIsResolving(false);
            setIssueIdentified('');
            setActionTaken('');
        } catch (err) {
            toast.error('Failed to update ticket status.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleTakeAssignment = async () => {
        setActionLoading(true);
        try {
            await api.put(`/tickets/${ticketId}/assign`, { technicianId: user.id });
            // Automatically move to IN_PROGRESS upon taking assignment
            await api.put(`/tickets/${ticketId}/status`, { 
                status: 'IN_PROGRESS', 
                notes: `Technician ${user.name} took the assignment.` 
            });
            toast.success('You have been assigned to this ticket.');
            fetchTicketDetails();
            onUpdate();
        } catch (err) {
            toast.error('Failed to take assignment.');
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
            fetchTicketDetails(); // Refresh comments
        } catch (err) {
            toast.error('Failed to add update.');
        }
    };

    const handleEditComment = async (commentId) => {
        if (!editingCommentContent.trim()) return;
        try {
            await api.put(`/comments/${commentId}`, { content: editingCommentContent });
            setEditingCommentId(null);
            fetchTicketDetails();
        } catch (err) {
            toast.error('Failed to update comment.');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this update?')) return;
        try {
            await api.delete(`/comments/${commentId}`);
            fetchTicketDetails();
        } catch (err) {
            toast.error('Failed to delete comment.');
        }
    };

    const formatCommentDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + 
               date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-6 drop-shadow-xl shadow-blue-100" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Incident Assets...</p>
            </div>
        );
    }

    const isAssignedToMe = ticket.assignedTo === user?.id;
    const canResolve = isAssignedToMe && ticket.status === 'IN_PROGRESS';
    const isUnassigned = !ticket.assignedTo && ticket.status === 'OPEN';

    return (
        <div className="max-w-7xl mx-auto pb-12 font-sans">
            {/* Header & Back Action */}
            <div className="flex items-center justify-between mb-8 group">
                <button 
                    onClick={onClose}
                    className="flex items-center px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Hub
                </button>
                <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">
                        REF: {ticket.ticketId || (ticket.id ? ticket.id.substring(0, 8).toUpperCase() : 'NEW')}
                    </span>
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                        ticket.status === 'OPEN' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        ticket.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        ticket.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        ticket.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                        {ticket.status.replace('_', ' ')}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Primary Incident Details */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[5rem] -mr-16 -mt-16 -z-0" />
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-6 uppercase">
                                {ticket.category} Incident
                            </h2>
                            
                            <div className="flex flex-wrap gap-6 mb-10">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center mr-3">
                                        <Calendar className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Reported On</p>
                                        <p className="text-xs font-bold text-slate-700">{new Date(ticket.createdAt).toLocaleDateString()} {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center mr-3">
                                        <Building2 className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Origin Department</p>
                                        <p className="text-xs font-bold text-slate-700">{ticket.department || 'General Campus'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-2xl bg-fuchsia-50 flex items-center justify-center mr-3 font-semibold text-fuchsia-600">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Resource Name</p>
                                        <p className="text-xs font-bold text-slate-700">{ticket.resourceName || 'Campus General'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center mr-3">
                                        <Tag className={`w-5 h-5 ${
                                            ticket.priority === 'HIGH' ? 'text-rose-500' :
                                            ticket.priority === 'MEDIUM' ? 'text-amber-500' : 'text-sky-500'
                                        }`} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Priority Level</p>
                                        <p className={`text-xs font-black uppercase tracking-tight ${
                                            ticket.priority === 'HIGH' ? 'text-rose-600' :
                                            ticket.priority === 'MEDIUM' ? 'text-amber-600' : 'text-sky-600'
                                        }`}>{ticket.priority}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100/50">
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3">Field Report Details</p>
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    {ticket.description}
                                </p>
                            </div>

                            {ticket.imageUrls && ticket.imageUrls.length > 0 && (
                                <div className="mt-10">
                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-4">Evidence Gallery</p>
                                    <div className="flex flex-wrap gap-4">
                                        {ticket.imageUrls.map((img, idx) => (
                                            <button 
                                                key={idx} 
                                                onClick={() => setSelectedPreviewImage(img)}
                                                className="relative group overflow-hidden rounded-2xl border-2 border-slate-100 hover:border-blue-200 transition-all focus:outline-none"
                                            >
                                                <img src={img} alt="Evidence" className="w-24 h-24 object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Activity className="w-5 h-5 text-blue-600" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resolution Section (Always Visible) */}
                    <div className={`bg-white p-10 rounded-[2.5rem] border shadow-sm transition-all mb-8 ${ticket.resolutionNotes ? 'border-emerald-100 shadow-emerald-50' : 'border-slate-100'}`}>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className={`p-2.5 rounded-xl ${ticket.resolutionNotes ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                                {ticket.resolutionNotes ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                    <Clock className="w-5 h-5 text-slate-400" />
                                )}
                            </div>
                            <h3 className={`text-lg font-black uppercase tracking-wider ${ticket.resolutionNotes ? 'text-slate-800' : 'text-slate-400'}`}>
                                Resolution & Technical Report
                            </h3>
                        </div>
                        <div className={`space-y-4 p-6 rounded-2xl border ${
                            ticket.resolutionNotes 
                            ? 'bg-emerald-50/30 border-emerald-100/50' 
                            : 'bg-slate-50 border-slate-100/50 italic'
                        }`}>
                            {ticket.resolutionNotes? (
                                typeof ticket.resolutionNotes === 'object' ? (
                                    <>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Issue Identified</p>
                                            <p className="text-slate-700 font-medium text-sm">{ticket.resolutionNotes.issueIdentified || "Technical Root Cause Identified"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Action Taken</p>
                                            <p className="text-slate-700 font-medium text-sm">{ticket.resolutionNotes.actionTaken || "Repair protocol executed"}</p>
                                        </div>
                                        {ticket.resolutionNotes.resolvedAt && (
                                            <div className="pt-2 border-t border-emerald-100/50 flex justify-between items-center">
                                                <p className="text-[9px] font-bold text-emerald-500 uppercase">Resolved On</p>
                                                <p className="text-[10px] font-bold text-slate-400 font-mono">
                                                    {new Date(ticket.resolutionNotes.resolvedAt).toLocaleDateString()} {new Date(ticket.resolutionNotes.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-slate-700 font-medium text-sm whitespace-pre-wrap">{ticket.resolutionNotes}</p>
                                )
                            ) : (
                                <p className="text-slate-400 text-sm">No resolution details available yet. Provide notes upon resolving the incident.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column (Technician Actions) */}
                <div className="space-y-8">
                    {/* Management Panel */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6">Technician Protocol</p>
                        
                        <div className="space-y-4">
                            {isUnassigned && (
                                <button 
                                    onClick={handleTakeAssignment}
                                    disabled={actionLoading}
                                    className="w-full p-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all shadow-xl shadow-blue-100 flex items-center justify-center space-x-3 group"
                                >
                                    <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-black uppercase tracking-widest">Take Assignment</span>
                                </button>
                            )}

                            {canResolve && !isResolving && (
                                <button 
                                    onClick={() => setIsResolving(true)}
                                    className="w-full p-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl transition-all shadow-xl shadow-emerald-100 flex items-center justify-center space-x-3 group"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="text-xs font-black uppercase tracking-widest">Resolve Incident</span>
                                </button>
                            )}

                            {isResolving && (
                                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[2rem] animate-in slide-in-from-top-4 duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Resolution Notes</p>
                                        <button onClick={() => setIsResolving(false)}><X className="w-4 h-4 text-emerald-300" /></button>
                                    </div>
                                    <div className="space-y-4 mb-4">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-2">Issue Identified</p>
                                            <textarea 
                                                placeholder="What was the root cause?"
                                                value={issueIdentified}
                                                onChange={(e) => setIssueIdentified(e.target.value)}
                                                className="w-full p-4 bg-white border border-emerald-100 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-100 h-24 resize-none"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-2">Action Taken</p>
                                            <textarea 
                                                placeholder="How did you fix it?"
                                                value={actionTaken}
                                                onChange={(e) => setActionTaken(e.target.value)}
                                                className="w-full p-4 bg-white border border-emerald-100 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-100 h-24 resize-none"
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleStatusUpdate('RESOLVED')}
                                        disabled={!issueIdentified.trim() || !actionTaken.trim() || actionLoading}
                                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 disabled:opacity-30 disabled:shadow-none hover:bg-emerald-700 transition-all flex items-center justify-center"
                                    >
                                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Finalize Resolution'}
                                    </button>
                                </div>
                            )}

                            {!isAssignedToMe && ticket.assignedTo && (
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
                                    <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Access Restricted</p>
                                    <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">Assigned to: {ticket.assignedToName}</p>
                                </div>
                            )}

                            {isAssignedToMe && ticket.status === 'RESOLVED' && (
                                <div className="p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100 text-center">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                    <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Task Completed</p>
                                    <p className="text-[11px] font-medium text-slate-500 mt-1 italic">Great work! The system is now awaiting admin closure.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col max-h-[600px]">
                        <div className="p-8 pb-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Active Discussion</h4>
                        </div>
                        <div className="h-[300px] overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            {comments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <MessageCircle className="w-6 h-6 text-slate-200 mb-3" />
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No updates in history</p>
                                </div>
                            ) : (
                                comments.map((comment, index) => (
                                    <div key={comment.id || index} className={`flex flex-col ${comment.userId === user?.id ? 'items-end' : 'items-start'} group animate-in fade-in slide-in-from-bottom-2`}>
                                        <div className="flex items-center space-x-3 mb-1.5 px-1 relative">
                                            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">{comment.userId === user?.id ? 'You' : comment.authorName}</span>
                                            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter whitespace-nowrap">{formatCommentDate(comment.createdAt)}</span>
                                            
                                            {comment.userId === user?.id && editingCommentId !== comment.id && (
                                                <div className="relative">
                                                    <button 
                                                        onClick={() => setActiveMenuId(activeMenuId === comment.id ? null : comment.id)}
                                                        className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <MoreVertical className="w-3.5 h-3.5" />
                                                    </button>
                                                    {activeMenuId === comment.id && (
                                                        <>
                                                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                                                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 animate-in zoom-in-95 duration-200">
                                                                <button 
                                                                    onClick={() => {
                                                                        setEditingCommentId(comment.id);
                                                                        setEditingCommentContent(comment.content);
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className="w-full px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2"
                                                                >
                                                                    <Wrench className="w-3 h-3" />
                                                                    <span>Edit</span>
                                                                </button>
                                                                <button 
                                                                    onClick={() => {
                                                                        handleDeleteComment(comment.id);
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className="w-full px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                    <span>Delete</span>
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {editingCommentId === comment.id ? (
                                            <div className="w-full bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                                <textarea 
                                                    value={editingCommentContent}
                                                    onChange={(e) => setEditingCommentContent(e.target.value)}
                                                    maxLength={50}
                                                    className="w-full bg-white border border-blue-200 rounded-xl p-4 text-sm text-slate-700 outline-none h-20 resize-none"
                                                />
                                                <div className="flex justify-between items-center mt-3">
                                                    <span className="text-[10px] font-bold text-slate-400">{editingCommentContent.length}/50</span>
                                                    <div className="flex space-x-2">
                                                        <button onClick={() => setEditingCommentId(null)} className="px-3 py-1.5 text-[10px] font-black text-slate-400">Cancel</button>
                                                        <button onClick={() => handleEditComment(comment.id)} className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Save</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`p-4 rounded-2xl text-sm max-w-[85%] shadow-sm border ${
                                                comment.userId === user?.id 
                                                ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' 
                                                : 'bg-slate-50 text-slate-700 border-slate-100 rounded-tl-none'
                                            }`}>
                                                {comment.content}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-6 pt-4 bg-white/80 backdrop-blur-md border-t border-slate-50">
                            <form onSubmit={handleAddComment} className="relative">
                                <div className="relative">
                                    <textarea 
                                        placeholder="Add a technical update..." 
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        maxLength={50}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none h-20 resize-none"
                                    />
                                    <span className="absolute right-4 top-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">{newComment.length}/50</span>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="mt-4 w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center space-x-3 shadow-lg shadow-blue-100 disabled:opacity-50"
                                >
                                    <span className="text-xs font-black uppercase tracking-widest">Update Thread</span>
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            <Modal isOpen={!!selectedPreviewImage} onClose={() => setSelectedPreviewImage(null)} title="Asset Documentation">
                <div className="flex flex-col items-center">
                    <img src={selectedPreviewImage} alt="Large Evidence" className="w-full rounded-2xl shadow-xl" />
                    <div className="mt-6 flex justify-between w-full items-center">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Field Asset Archive</p>
                        <a href={selectedPreviewImage} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase text-blue-600 underline">Open Original HUB</a>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TechnicianTicketDetails;
