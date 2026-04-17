import React, { useState, useEffect, useContext, useRef } from 'react';
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
    Trash2,
    Camera,
    Box,
    Building2,
    Tag,
    Activity
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
    const [selectedImage, setSelectedImage] = useState(null);
    const scrollContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (comments.length > 0) {
            scrollToBottom();
        }
    }, [comments]);

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
        <>
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

                    <div className="flex items-center space-x-4 invisible md:visible">
                        {/* Placeholder or empty to keep layout balance, or just remove if not needed */}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                    {/* Main Content Column */}
                    <div className="lg:col-span-3 space-y-6">
                        

                        {/* Primary Detail Card (Admin Inspired Style) */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/30 rounded-bl-[5rem] -mr-20 -mt-20 -z-0" />

                            {/* Status & ID Badge Overlay */}
                            <div className="absolute top-10 right-10 flex items-center space-x-2 z-20">
                                <span className="text-[10px] font-black uppercase text-indigo-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-xl border border-indigo-100 shadow-sm">
                                    Id: {ticket.ticketId || (ticket.id ? ticket.id.substring(0, 8).toUpperCase() : 'NEW')}
                                </span>
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border shadow-sm ${ticket.status === 'OPEN' ? 'bg-indigo-600 text-white border-indigo-500' :
                                        ticket.status === 'IN_PROGRESS' ? 'bg-violet-600 text-white border-violet-500' :
                                            ticket.status === 'RESOLVED' ? 'bg-emerald-600 text-white border-emerald-500' :
                                                ticket.status === 'REJECTED' ? 'bg-rose-600 text-white border-rose-500' :
                                                    'bg-slate-700 text-white border-slate-600'
                                    }`}>
                                    {ticket.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-6 pr-40 uppercase">
                                    {ticket.category.replace('_', ' ')} ISSUE
                                </h2>

                                {/* Stepper Implementation Integrated */}
                                <div className="mb-10 py-6 border-b border-slate-50">
                                    {!isRejected && (
                                        <div className="relative px-2">
                                            <div className="absolute top-[1.25rem] left-6 right-6 h-1 bg-slate-100 rounded-full" />
                                            <div className="absolute top-[1.25rem] left-6 h-1 bg-indigo-600 transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                                                style={{ width: `calc(${(currentStepIndex / (statusSteps.length - 1)) * 100}% - 3rem)` }}
                                            />

                                            <div className="relative flex justify-between items-center">
                                                {statusSteps.map((step, idx) => {
                                                    const isActive = idx <= currentStepIndex;
                                                    const isCurrent = idx === currentStepIndex;
                                                    return (
                                                        <div key={idx} className="flex flex-col items-center">
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500 z-10 ${isCurrent ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_12px_rgba(79,70,229,0.4)]' :
                                                                isActive ? 'bg-emerald-500 border-emerald-400' :
                                                                    'bg-white border-slate-200'
                                                                }`}>
                                                                {isActive ? <CheckCircle2 className="w-3 h-3 text-white" /> : <div className="w-1 h-1 rounded-full bg-slate-100" />}
                                                            </div>
                                                            <span className={`mt-3 text-[8px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-slate-800' : 'text-slate-400'
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
                                        <div className="flex items-center space-x-3 px-5 py-2.5 bg-rose-50 border border-rose-100 rounded-2xl w-fit mx-auto">
                                            <ShieldAlert className="text-rose-500 w-4 h-4" />
                                            <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Protocol Terminated</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-10">
                                    {/* Column 1: Time & Priority */}
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
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mr-4 ${ticket.priority === 'HIGH' ? 'bg-rose-50' :
                                                ticket.priority === 'MEDIUM' ? 'bg-amber-50' : 'bg-sky-50'
                                            }`}>
                                            <Tag className={`w-5 h-5 ${ticket.priority === 'HIGH' ? 'text-rose-600' :
                                                    ticket.priority === 'MEDIUM' ? 'text-amber-600' : 'text-sky-600'
                                                }`} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Priority Flag</p>
                                            <p className={`text-sm font-black uppercase tracking-tight leading-none ${ticket.priority === 'HIGH' ? 'text-rose-600' :
                                                    ticket.priority === 'MEDIUM' ? 'text-amber-600' : 'text-sky-600'
                                                }`}>{ticket.priority}</p>
                                        </div>
                                    </div>

                                    {/* Column 2: Department & Resource Type */}
                                    <div className="flex items-center border-t border-slate-50 pt-6 md:border-none md:pt-0">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-50/50 flex items-center justify-center mr-4">
                                            <Building2 className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Department</p>
                                            <p className="text-sm font-bold text-slate-700 leading-none">
                                                {ticket.department
                                                    ? ticket.department.replace(/_/g, ' ')
                                                    : 'General Operations'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center border-t border-slate-50 pt-6 md:border-none md:pt-0">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-50/50 flex items-center justify-center mr-4">
                                            <Box className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Resource Type</p>
                                            <p className="text-sm font-bold text-slate-700 leading-none">
                                                {ticket.resourceType ? ticket.resourceType.replace(/_/g, ' ') : 'Infrastructure'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Resources Row */}
                                    <div className="flex items-center border-t border-slate-50 pt-6 md:col-span-2">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-50/50 flex items-center justify-center mr-4">
                                            <MapPin className="w-5 h-5 text-indigo-500" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Resource Description</p>
                                            <p className="text-sm font-black text-slate-800 leading-none uppercase tracking-tight">{ticket.resourceName || 'Common Infrastructure'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100/50 mb-10 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <FileText className="w-20 h-20" />
                                    </div>
                                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center relative z-10">
                                        <FileText className="w-3.5 h-3.5 mr-2" /> Incident Analysis
                                    </p>
                                    <p className="text-sm font-bold text-slate-700 leading-relaxed italic relative z-10">
                                        "{ticket.description}"
                                    </p>
                                </div>

                                {isRejected && ticket.rejectionReason && (
                                    <div className="mb-10 p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100 flex items-start animate-in fade-in slide-in-from-top-4 duration-500">
                                        <ShieldAlert className="w-6 h-6 text-rose-500 mr-5 mt-1" />
                                        <div>
                                            <p className="text-[9px] font-black uppercase text-rose-600 tracking-widest mb-1.5 text-center sm:text-left">Administrative Rejection Reason</p>
                                            <p className="text-sm font-bold text-rose-800 leading-relaxed">{ticket.rejectionReason}</p>
                                        </div>
                                    </div>
                                )}

                                {ticket.imageUrls && ticket.imageUrls.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-slate-50">
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-5 flex items-center">
                                            <Camera className="w-3.5 h-3.5 mr-2" /> Visual Assets & Evidence
                                        </p>
                                        <div className="flex flex-wrap gap-5">
                                            {ticket.imageUrls.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedImage(img)}
                                                    className="relative group overflow-hidden rounded-[1.8rem] border-2 border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`Evidence ${idx + 1}`}
                                                        className="w-28 h-28 object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Activity className="w-6 h-6 text-white drop-shadow-md animate-pulse" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Lead Technician Standalone Card */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center space-x-6 group hover:border-indigo-200 transition-colors duration-300">
                            <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
                                <div className="w-full h-full bg-white rounded-[1.4rem] flex items-center justify-center">
                                    <User className="text-indigo-600 w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 block pb-1">Technician</span>
                                {ticket.assignedToName ? (
                                    <span className="text-slate-800 font-black text-base uppercase tracking-tight">{ticket.assignedToName}</span>
                                ) : ticket.status === 'REJECTED' ? (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-slate-400 font-black text-sm uppercase tracking-wider">Not Assigned</span>
                                        <X className="w-3.5 h-3.5 text-slate-300" />
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-slate-800 font-black text-sm uppercase tracking-wider">Awaiting</span>
                                        <Loader2 className="w-3.5 h-3.5 text-slate-500 animate-spin" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Resolution Section (Always Visible) */}
                        <div className={`bg-white p-8 rounded-[2rem] border shadow-sm transition-all ${ticket.resolutionNotes ? 'border-emerald-100 shadow-emerald-50' : 'border-slate-100'}`}>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className={`p-2 rounded-lg ${ticket.resolutionNotes ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                                    {ticket.resolutionNotes ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    ) : (
                                        <Clock className="w-4 h-4 text-slate-400" />
                                    )}
                                </div>
                                <h3 className="text-base font-black uppercase tracking-wider text-slate-800">
                                    Technical Report
                                </h3>
                            </div>
                            <div className={`space-y-4 p-5 rounded-xl border ${ticket.resolutionNotes
                                ? 'bg-emerald-50/20 border-emerald-100/50'
                                : 'bg-slate-50 border-slate-100/50 italic'
                                }`}>
                                {ticket.resolutionNotes ? (
                                    <>
                                        <div>
                                            <p className="text-[9px] font-black uppercase text-emerald-600 mb-1">Issue Identified</p>
                                            <p className="text-slate-700 font-medium text-xs leading-relaxed">{ticket.resolutionNotes.issueIdentified}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase text-emerald-600 mb-1">Action Taken</p>
                                            <p className="text-slate-700 font-medium text-xs leading-relaxed">{ticket.resolutionNotes.actionTaken}</p>
                                        </div>
                                        <div className="pt-2 border-t border-emerald-100/50 flex justify-between items-center">
                                            <p className="text-[8px] font-black text-emerald-500 uppercase">Resolved On</p>
                                            <p className="text-[9px] font-bold text-slate-400 font-mono">
                                                {new Date(ticket.resolutionNotes.resolvedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-slate-400 text-xs">Awaiting technician finalization.</p>
                                )}
                            </div>
                        </div>
                        {/* Comments Section */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col max-h-[600px]">
                            <div className="p-8 pb-4">
                                <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-2 px-1">Comments</h4>
                            </div>

                            {/* Chat Feed Area */}
                            <div 
                                ref={scrollContainerRef}
                                className="h-[220px] overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent hover:scrollbar-thumb-indigo-100 transition-colors"
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
                                                    {comment.userId === user?.id ? 'You' : (comment.authorName ? comment.authorName.split(' ')[0] : 'User')}
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
                                                        maxLength={50}
                                                        className="w-full bg-white border border-indigo-200 rounded-xl p-4 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 min-h-[60px] resize-none"
                                                    />
                                                    <div className="flex justify-between items-center mt-3">
                                                        <span className="text-[10px] font-bold text-slate-400">{editContent.length}/50</span>
                                                        <div className="flex space-x-2">
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
                                    <div className="py-8 px-6 bg-slate-50/50 rounded-[2rem] border border-slate-100/50 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                                        <ShieldAlert className="w-10 h-10 text-slate-200 mb-3" />
                                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Thread Archived</p>
                                        <p className="text-[11px] font-bold text-slate-300 mt-2 italic px-4 leading-relaxed">
                                            This incident is finalized and the communication channel is now closed.
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
                                            className="mt-3 w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-2xl flex items-center justify-center space-x-3 text-white shadow-xl shadow-indigo-100"
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
            </div>

            {/* Premium Image Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors group"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                    </button>

                    <div
                        className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center animate-in zoom-in duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage}
                            alt="Evidence Detail"
                            className="max-w-full max-h-[90vh] object-contain rounded-3xl shadow-2xl border border-white/20"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default TicketDetails;
