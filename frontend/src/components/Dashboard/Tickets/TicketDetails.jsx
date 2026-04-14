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
    Loader2,
    MoreVertical,
    Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import { showConfirmToast } from '../../../utils/confirmToast';

const TicketDetails = ({ ticketId, onClose, onUpdate }) => {
    const { user } = useContext(AuthContext);
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [activeMenuId, setActiveMenuId] = useState(null);
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

    const handleDeleteComment = (commentId) => {
        showConfirmToast({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to remove this update? This action cannot be undone.',
            confirmText: 'Delete Forever',
            cancelText: 'Keep It',
            onConfirm: async () => {
                try {
                    await api.delete(`/comments/${commentId}`);
                    setComments(prev => prev.filter(c => c.id !== commentId));
                    toast.success('Comment Deleted Successfully');
                } catch (err) {
                    toast.error('Failed to remove update');
                }
            }
        });
    };

    const handleEditInitiate = (comment) => {
        setEditingCommentId(comment.id);
        setEditContent(comment.content);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditContent('');
    };

    const handleUpdateComment = async (commentId) => {
        if (!editContent.trim()) return;
        try {
            await api.put(`/comments/${commentId}`, { content: editContent });
            setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: editContent } : c));
            setEditingCommentId(null);
            setEditContent('');
            toast.success('Comment updated');
        } catch (err) {
            toast.error('Failed to update comment');
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

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const formatCommentDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + 
               date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

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

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                
                {/* Main Content Column */}
                <div className="lg:col-span-3 space-y-8">
                    
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
                        <div className={`leading-relaxed font-medium text-sm whitespace-pre-wrap p-6 rounded-2xl border ${
                            ticket.resolutionNotes 
                            ? 'text-slate-600 bg-emerald-50/30 border-emerald-100/50' 
                            : 'text-slate-400 bg-slate-50 border-slate-100/50 italic'
                        }`}>
                            {ticket.resolutionNotes || "No resolution details available yet. This section will be updated after the issue is resolved."}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-2 space-y-6">
                    
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

                    {/* Lead Technician Standalone Card */}
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center space-x-5 group hover:border-indigo-200 transition-colors duration-300">
                        <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
                            <div className="w-full h-full bg-white rounded-[1.4rem] flex items-center justify-center">
                                <User className="text-indigo-600 w-6 h-6" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 block pb-0.5">Primary Resolver</span>
                            <span className="text-slate-800 font-black text-sm uppercase tracking-wider">{ticket.assignedToName || "Awaiting Assignment"}</span>
                        </div>
                    </div>

                    {/* Activity & Comment Box */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col max-h-[700px]">
                        <div className="p-8 pb-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Activity Feed</h4>
                        </div>

                        {/* Chat Feed Area */}
                        <div className="h-[350px] overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent hover:scrollbar-thumb-indigo-100 transition-colors">
                            {comments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="p-4 bg-slate-50 rounded-full mb-4">
                                        <MessageCircle className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight leading-relaxed"> No updates yet.<br/>Be the first to comment.</p>
                                </div>
                            ) : (
                                comments.map((comment, index) => (
                                    <div key={comment.id || index} className={`flex flex-col ${comment.userId === user?.id ? 'items-end' : 'items-start'} group animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                                        <div className="flex items-center space-x-3 mb-1.5 px-1 relative">
                                            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">{comment.authorName}</span>
                                            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter whitespace-nowrap">{formatCommentDate(comment.createdAt)}</span>
                                            
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
                                                                        handleEditInitiate(comment);
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
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    className="w-full bg-white border border-indigo-200 rounded-xl p-4 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 min-h-[80px] resize-none"
                                                />
                                                <div className="flex justify-end space-x-2 mt-3">
                                                    <button 
                                                        onClick={handleCancelEdit}
                                                        className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button 
                                                        onClick={() => handleUpdateComment(comment.id)}
                                                        className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100"
                                                    >
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`p-4 rounded-2xl text-sm max-w-[85%] shadow-sm border ${
                                                comment.userId === user?.id 
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
                            <form onSubmit={handleAddComment} className="relative">
                                <textarea 
                                    placeholder="Add a comment..." 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-6 text-sm text-slate-700 placeholder-slate-400 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-200 transition-all outline-none resize-none"
                                    rows={3}
                                />
                                <button 
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="mt-4 w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-2xl flex items-center justify-center space-x-3 text-white shadow-xl shadow-indigo-100"
                                >
                                    <span className="text-xs font-black uppercase tracking-widest">Add Comment</span>
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TicketDetails;
