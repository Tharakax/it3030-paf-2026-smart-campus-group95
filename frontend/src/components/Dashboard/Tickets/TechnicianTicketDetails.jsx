import React, { useState, useEffect, useContext, useRef } from 'react';
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
    Box,
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
    const scrollContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    };

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

    useEffect(() => {
        if (comments.length > 0) {
            scrollToBottom();
        }
    }, [comments]);

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
                    {/* Primary Details Copied from Admin */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/30 rounded-bl-[5rem] -mr-20 -mt-20 -z-0" />

                        {/* Status & ID Badge Relocated */}
                        <div className="absolute top-10 right-10 flex items-center space-x-2 z-20">
                            <span className="text-[10px] font-black uppercase text-indigo-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-xl border border-indigo-100 shadow-sm">
                                REF: {ticket.ticketId || (ticket.id ? ticket.id.substring(0, 8).toUpperCase() : 'NEW')}
                            </span>
                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border shadow-sm ${
                                ticket.status === 'OPEN' ? 'bg-indigo-600 text-white border-indigo-500' :
                                ticket.status === 'IN_PROGRESS' ? 'bg-violet-600 text-white border-violet-500' :
                                ticket.status === 'RESOLVED' ? 'bg-emerald-600 text-white border-emerald-500' :
                                ticket.status === 'REJECTED' ? 'bg-rose-600 text-white border-rose-500' :
                                'bg-slate-700 text-white border-slate-600'
                            }`}>
                                {ticket.status.replace('_', ' ')}
                            </span>
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-8 pr-40 uppercase">
                                {ticket.category} ISSUE
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-6">
                                {/* Row 1: Time & Priority */}
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50/50 flex items-center justify-center mr-4">
                                        <Calendar className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Reported On</p>
                                        <p className="text-sm font-bold text-slate-700 leading-none">
                                            {new Date(ticket.createdAt).toLocaleDateString()} · {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mr-4 ${
                                        ticket.priority === 'HIGH' ? 'bg-red-50' :
                                        ticket.priority === 'MEDIUM' ? 'bg-amber-50' : 'bg-sky-50'
                                    }`}>
                                        <Tag className={`w-5 h-5 ${
                                            ticket.priority === 'HIGH' ? 'text-red-600' :
                                            ticket.priority === 'MEDIUM' ? 'text-amber-600' : 'text-sky-600'
                                        }`} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Priority Flag</p>
                                        <p className={`text-sm font-black uppercase tracking-tight leading-none ${
                                            ticket.priority === 'HIGH' ? 'text-red-600' :
                                            ticket.priority === 'MEDIUM' ? 'text-amber-600' : 'text-sky-600'
                                        }`}>{ticket.priority}</p>
                                    </div>
                                </div>

                                {/* Row 2: Department & Resource */}
                                <div className="flex items-center border-t border-slate-50 pt-6 md:border-none md:pt-0">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50/50 flex items-center justify-center mr-4">
                                        <Building2 className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Department</p>
                                        <p className="text-sm font-bold text-slate-700 leading-none">
                                            {ticket.department
                                                ? ticket.department.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
                                                : 'General'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center border-t border-slate-50 pt-6 md:border-none md:pt-0">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50/50 flex items-center justify-center mr-4">
                                        <Box className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Resource Name</p>
                                        <p className="text-sm font-bold text-slate-700 leading-none">{ticket.resourceName || 'Campus General'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100/50">
                                <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1">Issue Description</p>
                                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                    {ticket.description}
                                </p>
                            </div>

                            {ticket.status === 'REJECTED' && ticket.rejectionReason && (
                                <div className="mt-6 p-8 bg-rose-50 rounded-[2.2rem] border border-rose-100 flex items-start">
                                    <ShieldAlert className="w-6 h-6 text-rose-500 mr-4 mt-1" />
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-rose-600 tracking-widest mb-1">Rejection Reason</p>
                                        <p className="text-sm font-bold text-rose-800 leading-relaxed">{ticket.rejectionReason}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap items-end justify-between mt-10">
                                {ticket.imageUrls && ticket.imageUrls.length > 0 && (
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-4">Evidence & Documentation</p>
                                        <div className="flex flex-wrap gap-4">
                                            {ticket.imageUrls.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedPreviewImage(img)}
                                                    className="relative group overflow-hidden rounded-2xl border-2 border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`Evidence ${idx + 1}`}
                                                        className="w-24 h-24 object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Activity className="w-5 h-5 text-indigo-600 drop-shadow-sm" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Relocated Action Buttons */}
                                <div className="flex items-center space-x-3 ml-auto pt-4">
                                    {isUnassigned && !actionLoading && (
                                        <button 
                                            onClick={handleTakeAssignment}
                                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center justify-center space-x-3 group"
                                        >
                                            <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-black uppercase tracking-widest">Take Assignment</span>
                                        </button>
                                    )}

                                    {canResolve && !isResolving && (
                                        <button 
                                            onClick={() => setIsResolving(true)}
                                            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl transition-all shadow-xl shadow-emerald-100 flex items-center justify-center space-x-3 group animate-in slide-in-from-right-4"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span className="text-xs font-black uppercase tracking-widest">Resolve Incident</span>
                                        </button>
                                    )}
                                </div>
                            </div>
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
                    {/* Secondary Information & Security Notices */}
                    {(!isAssignedToMe && ticket.assignedTo) || (isAssignedToMe && ticket.status === 'RESOLVED') ? (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm animate-in fade-in duration-500">
                            {!isAssignedToMe && ticket.assignedTo && (
                                <div className="text-center">
                                    <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Access Restricted</p>
                                    <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-tighter line-clamp-1">Assigned to: {ticket.assignedToName}</p>
                                </div>
                            )}

                            {isAssignedToMe && ticket.status === 'RESOLVED' && (
                                <div className="text-center">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                    <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Task Completed</p>
                                    <p className="text-[11px] font-medium text-slate-500 mt-1 italic">The system is now awaiting admin closure.</p>
                                </div>
                            )}
                        </div>
                    ) : null}
                    {/* Comments Section - Exact Admin Port */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col max-h-[600px]">
                        <div className="p-8 pb-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 px-1 border-b border-slate-50 pb-2">Comments</h4>
                        </div>
                        <div 
                            ref={scrollContainerRef}
                            className="h-[250px] overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent hover:scrollbar-thumb-indigo-100 transition-colors"
                        >
                            {comments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="p-4 bg-slate-50 rounded-full mb-4">
                                        <MessageCircle className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight leading-relaxed"> No updates yet.<br />Be the first to comment.</p>
                                </div>
                            ) : (
                                comments.map((comment, index) => (
                                    <div key={comment.id || index} className={`flex flex-col ${comment.userId === user?.id ? 'items-end' : 'items-start'} group animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                                        <div className={`flex items-center space-x-2 mb-2 px-1 relative w-full ${comment.userId === user?.id ? 'justify-end' : 'justify-start'}`}>
                                            <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter flex items-center">
                                                {comment.userId === user?.id ? 'You' : comment.authorName}
                                            </span>
                                            {comment.authorRole && comment.userId !== user?.id ? (
                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border shadow-sm ${comment.authorRole === 'ADMIN' ? 'bg-indigo-500 text-white border-indigo-400' :
                                                        comment.authorRole === 'TECHNICIAN' ? 'bg-amber-500 text-white border-amber-400' :
                                                            'bg-slate-400 text-white border-slate-300'
                                                    }`}>
                                                    {comment.authorRole === 'USER' ? 'User' : comment.authorRole}
                                                </span>
                                            ) : comment.userId !== user?.id && (
                                                <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 uppercase tracking-widest border border-slate-200">
                                                    Member
                                                </span>
                                            )}
                                            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter whitespace-nowrap opacity-60 flex items-center">
                                                <span className="mx-1.5 text-slate-300">·</span>
                                                {formatCommentDate(comment.createdAt)}
                                            </span>

                                            {comment.userId === user?.id && editingCommentId !== comment.id && (
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveMenuId(activeMenuId === comment.id ? null : comment.id);
                                                        }}
                                                        className="p-1 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-slate-50"
                                                    >
                                                        <MoreVertical className="w-3.5 h-3.5" />
                                                    </button>

                                                    {activeMenuId === comment.id && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-10"
                                                                onClick={() => setActiveMenuId(null)}
                                                            />
                                                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingCommentId(comment.id);
                                                                        setEditingCommentContent(comment.content);
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className="w-full px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center space-x-2"
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
                                            <div className="w-full bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 animate-in zoom-in-95 duration-200">
                                                <textarea
                                                    value={editingCommentContent}
                                                    onChange={(e) => setEditingCommentContent(e.target.value)}
                                                    maxLength={50}
                                                    className="w-full bg-white border border-indigo-200 rounded-xl p-4 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 min-h-[60px] resize-none"
                                                />
                                                <div className="flex justify-between items-center mt-3">
                                                    <span className="text-[10px] font-bold text-slate-400">{editingCommentContent.length}/50</span>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => setEditingCommentId(null)}
                                                            className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditComment(comment.id)}
                                                            className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100"
                                                        >
                                                            Save Changes
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`p-4 rounded-2xl text-sm max-w-[85%] shadow-sm border ${comment.userId === user?.id
                                                    ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none'
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
                            {['CLOSED', 'REJECTED'].includes(ticket.status) ? (
                                <div className="py-4 px-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center space-x-3 group animate-in fade-in duration-500">
                                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                        <X className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        Thread Archived · Ticket {ticket.status}
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleAddComment} className="relative">
                                    <div className="relative">
                                        <textarea
                                            placeholder="Add a comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            maxLength={50}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-200 transition-all outline-none resize-none"
                                            rows={2}
                                        />
                                        <span className="absolute right-4 top-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                            {newComment.length}/50
                                        </span>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim()}
                                        className="mt-4 w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-2xl flex items-center justify-center space-x-3 text-white shadow-xl shadow-indigo-100"
                                    >
                                        <span className="text-xs font-black uppercase tracking-widest">Add Comment</span>
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            )}
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

            {/* Resolution Form Modal */}
            <Modal 
                isOpen={isResolving} 
                onClose={() => setIsResolving(false)} 
                title="Finalize Incident Resolution"
            >
                <div className="space-y-6 pt-2">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start space-x-3 mb-2">
                        <ShieldAlert className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-tight leading-relaxed">
                            Protocol: Please provide a technical summary of the identifies issue and the corrective actions taken. This will be logged in the permanent audit trail.
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 px-1">Primary Issue Identified</p>
                        <textarea 
                            placeholder="What was the diagnostic result? (e.g. Loose wiring in main DB)"
                            value={issueIdentified}
                            onChange={(e) => setIssueIdentified(e.target.value)}
                            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-200 transition-all h-32 resize-none"
                        />
                    </div>

                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 px-1">Corrective Action Taken</p>
                        <textarea 
                            placeholder="What steps were taken to resolve? (e.g. Re-tightened all connections)"
                            value={actionTaken}
                            onChange={(e) => setActionTaken(e.target.value)}
                            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-200 transition-all h-32 resize-none"
                        />
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button 
                            onClick={() => setIsResolving(false)}
                            className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => handleStatusUpdate('RESOLVED')}
                            disabled={!issueIdentified.trim() || !actionTaken.trim() || actionLoading}
                            className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 disabled:opacity-30 disabled:shadow-none hover:bg-emerald-700 transition-all flex items-center justify-center"
                        >
                            {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authorize Resolution'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TechnicianTicketDetails;
