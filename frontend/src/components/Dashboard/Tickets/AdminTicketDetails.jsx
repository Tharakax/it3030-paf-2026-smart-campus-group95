import React, { useState, useEffect, useRef } from 'react';
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
    Mail,
    Phone,
    MoreVertical,
    Edit2,
    Trash2,
    UserPlus,
    X,
    MessageSquare,
    MessageCircle,
    Wrench,
    Box,
    Save,
    Lock,
    ShieldCheck,
    History,
    Flag,
    Briefcase,
    ExternalLink,
    CheckCheck,
    FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axiosConfig';
import { useAuth } from '../../../context/AuthContext';
import { showConfirmToast } from '../../../utils/confirmToast';
import Modal from '../../Common/Modal';

const AdminTicketDetails = ({ ticketId, onClose, onUpdate }) => {
    const { user } = useAuth();
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
    const [selectedPreviewImage, setSelectedPreviewImage] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
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

    const fetchTicketDetails = async () => {
        try {
            const [ticketRes, commentsRes, techsRes] = await Promise.all([
                api.get(`/tickets/${ticketId}`),
                api.get(`/tickets/${ticketId}/comments`),
                api.get('/users/technicians')
            ]);
            setTicket(ticketRes.data);
            setComments(commentsRes.data);
            setTechnicians(techsRes.data);
        } catch (err) {
            toast.error('Failed to load ticket details.');
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
            await api.put(`/tickets/${ticketId}/status`, { status: newStatus, notes });
            toast.success(`Status updated to ${newStatus}`);
            fetchTicketDetails();
            onUpdate();
            setIsRejecting(false);
            setRejectionReason('');
            setShowCloseModal(false);
        } catch (err) {
            toast.error('Failed to update status.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAssignTechnician = async () => {
        if (!selectedTechnicianId) return;

        const tech = technicians.find(t => t.id === selectedTechnicianId);

        showConfirmToast({
            title: 'Confirm Assignment',
            message: `Are you sure you want to assign ${tech?.name} to this incident? They will be notified to start the resolution process immediately.`,
            confirmText: 'Confirm Assignment',
            cancelText: 'Cancel',
            onConfirm: async () => {
                setActionLoading(true);
                try {
                    await api.put(`/tickets/${ticketId}/assign`, { technicianId: selectedTechnicianId });
                    toast.success(`Technician ${tech?.name} assigned successfully`);
                    fetchTicketDetails();
                    onUpdate();
                    setIsAssigning(false);
                    setSelectedTechnicianId('');
                } catch (err) {
                    toast.error('Assignment failed. Please try again.');
                } finally {
                    setActionLoading(false);
                }
            }
        });
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await api.post(`/tickets/${ticketId}/comments`, { content: newComment });
            setNewComment('');
            fetchTicketDetails();
            toast.success('Comment added successfully');
        } catch (err) {
            toast.error('Failed to add comment.');
        }
    };

    const handleEditComment = async (commentId) => {
        if (!editingCommentContent.trim()) return;
        try {
            await api.put(`/comments/${commentId}`, { content: editingCommentContent });
            setEditingCommentId(null);
            fetchTicketDetails();
            toast.success('Comment updated successfully');
        } catch (err) {
            toast.error('Failed to update comment.');
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
                    fetchTicketDetails();
                    toast.success('Comment deleted successfully');
                } catch (err) {
                    toast.error('Failed to delete comment.');
                }
            }
        });
    };

    const formatCommentDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' +
            date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const getStatusConfig = (status) => {
        const configs = {
            'OPEN': { label: 'Open', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: AlertCircle },
            'IN_PROGRESS': { label: 'In Progress', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
            'RESOLVED': { label: 'Resolved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
            'REJECTED': { label: 'Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: X },
            'CLOSED': { label: 'Closed', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: CheckCheck },
        };
        return configs[status] || configs['OPEN'];
    };

    const getPriorityConfig = (priority) => {
        const configs = {
            'HIGH': { label: 'High', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: Flag },
            'MEDIUM': { label: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Flag },
            'LOW': { label: 'Low', color: 'bg-sky-50 text-sky-700 border-sky-200', icon: Flag },
        };
        return configs[priority] || configs['MEDIUM'];
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-6" />
                <p className="text-slate-400 font-medium text-sm">Loading ticket details...</p>
            </div>
        );
    }

    const StatusIcon = getStatusConfig(ticket.status).icon;
    const PriorityIcon = getPriorityConfig(ticket.priority).icon;
    const canAssign = !ticket.assignedTo && !['CLOSED', 'REJECTED'].includes(ticket.status);
    const canReject = ticket.status === 'OPEN' && !isRejecting;
    const canClose = ticket.status === 'RESOLVED';
    const statusSteps = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    const currentStepIndex = statusSteps.indexOf(ticket.status);
    const isRejected = ticket.status === 'REJECTED';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={onClose}
                        className="group flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Management
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-500">
                            {ticket.ticketId || (ticket.id ? ticket.id.substring(0, 8).toUpperCase() : 'NEW')}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusConfig(ticket.status).color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {getStatusConfig(ticket.status).label}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Ticket Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                                            {ticket.category} Issue
                                        </h1>
                                    </div>
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getPriorityConfig(ticket.priority).color}`}>
                                        <PriorityIcon className="w-3.5 h-3.5" />
                                        {getPriorityConfig(ticket.priority).label} Priority
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Status Stepper */}
                                {!isRejected && (
                                    <div className="mb-8 px-4 py-6 bg-slate-50/50 rounded-xl">
                                        <div className="relative">
                                            <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2" />
                                            <div
                                                className="absolute top-4 left-0 h-0.5 bg-indigo-500 -translate-y-1/2 transition-all duration-500"
                                                style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                                            />
                                            <div className="relative flex justify-between">
                                                {statusSteps.map((step, idx) => {
                                                    const isActive = idx <= currentStepIndex;
                                                    const isCurrent = idx === currentStepIndex;
                                                    return (
                                                        <div key={step} className="flex flex-col items-center">
                                                            <div
                                                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all z-10
                                                                    ${isActive ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 bg-white'}
                                                                    ${isCurrent ? 'ring-4 ring-indigo-100' : ''}
                                                                `}
                                                            >
                                                                {isActive ? (
                                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                                ) : (
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                                )}
                                                            </div>
                                                            <span className={`text-[10px] font-semibold mt-2 ${isActive ? 'text-slate-700' : 'text-slate-400'}`}>
                                                                {step.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 rounded-xl">
                                            <User className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Reporter</p>
                                            <p className="text-sm font-semibold text-slate-700">{ticket.createdByName || 'Anonymous User'}</p>
                                            <p className="text-xs text-slate-500">{ticket.createdByEmail || 'No email provided'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 rounded-xl">
                                            <Phone className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Contact</p>
                                            <p className="text-sm font-semibold text-slate-700">{ticket.contactDetails || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 rounded-xl">
                                            <Calendar className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Reported On</p>
                                            <p className="text-sm font-semibold text-slate-700">
                                                {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 rounded-xl">
                                            <Building2 className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Department</p>
                                            <p className="text-sm font-semibold text-slate-700">
                                                {ticket.department
                                                    ? ticket.department.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
                                                    : 'General'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 rounded-xl">
                                            <Box className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Resource Type</p>
                                            <p className="text-sm font-semibold text-slate-700">
                                                {ticket.resourceType ? ticket.resourceType.replace(/_/g, ' ') : 'Uncategorized'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 rounded-xl">
                                            <Tag className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Resource Name</p>
                                            <p className="text-sm font-semibold text-slate-700">{ticket.resourceName || 'Campus General'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description Section (Synchronized Style) */}
                                <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5" />
                                        Description
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                                </div>

                                {/* Images */}
                                {ticket.imageUrls && ticket.imageUrls.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-slate-100">
                                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">Attachments</p>
                                        <div className="flex flex-wrap gap-3">
                                            {ticket.imageUrls.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedPreviewImage(img)}
                                                    className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all"
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`Evidence ${idx + 1}`}
                                                        className="w-20 h-20 object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <ExternalLink className="w-5 h-5 text-white" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Rejection Reason */}
                                {ticket.status === 'REJECTED' && ticket.rejectionReason && (
                                    <div className="mt-6 p-4 bg-rose-50 rounded-xl border border-rose-100">
                                        <div className="flex gap-3">
                                            <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
                                            <div>
                                                <p className="text-xs font-semibold text-rose-600 uppercase tracking-wide">Rejection Reason</p>
                                                <p className="text-sm text-rose-700 mt-0.5">{ticket.rejectionReason}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Resolution Section */}
                        {ticket.resolutionNotes && (
                            <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 bg-emerald-50/30 border-b border-emerald-100">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-emerald-700">Resolution Report</h3>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    {typeof ticket.resolutionNotes === 'object' ? (
                                        <>
                                            <div>
                                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Issue Identified</p>
                                                <p className="text-sm text-slate-700">{ticket.resolutionNotes.issueIdentified || "Not specified"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Action Taken</p>
                                                <p className="text-sm text-slate-700">{ticket.resolutionNotes.actionTaken || "Not specified"}</p>
                                            </div>
                                            {ticket.resolutionNotes.resolvedAt && (
                                                <div className="pt-3 border-t border-slate-100">
                                                    <p className="text-xs text-slate-400">
                                                        Resolved on {new Date(ticket.resolutionNotes.resolvedAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-sm text-slate-700">{ticket.resolutionNotes}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Management Panel */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                                <h3 className="text-sm font-semibold text-slate-700">Management</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Technician Assignment */}
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                        <UserPlus className="w-3.5 h-3.5" />
                                        Assignment
                                    </p>

                                    {ticket.assignedTo ? (
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-semibold text-indigo-600 shadow-sm">
                                                    {ticket.assignedToName?.substring(0, 1) || 'T'}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-slate-700">{ticket.assignedToName || 'Technician'}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {ticket.status === 'OPEN' ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-medium">
                                                                <Clock className="w-2.5 h-2.5" />
                                                                Pending Acceptance
                                                            </span>
                                                        ) : ticket.status === 'IN_PROGRESS' ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-medium">
                                                                <ShieldCheck className="w-2.5 h-2.5" />
                                                                Active
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-medium">
                                                                <CheckCircle2 className="w-2.5 h-2.5" />
                                                                Completed
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {ticket.status === 'OPEN' && (
                                                <button
                                                    onClick={() => setIsAssigning(true)}
                                                    className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                                                >
                                                    <Edit2 className="w-3 h-3" />
                                                    Reassign
                                                </button>
                                            )}
                                        </div>
                                    ) : canAssign ? (
                                        <button
                                            onClick={() => setIsAssigning(true)}
                                            className="w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all group"
                                        >
                                            <UserPlus className="w-8 h-8 text-slate-300 group-hover:text-indigo-400" />
                                            <span className="text-xs font-medium">Assign Technician</span>
                                        </button>
                                    ) : (
                                        <div className="p-4 bg-slate-50 rounded-xl text-center">
                                            <Lock className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                                            <p className="text-xs text-slate-400">Assignment locked</p>
                                        </div>
                                    )}

                                    {isAssigning && (
                                        <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-xs font-semibold text-indigo-700">Select Technician</p>
                                                <button onClick={() => setIsAssigning(false)} className="text-indigo-400 hover:text-indigo-600">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <select
                                                value={selectedTechnicianId}
                                                onChange={(e) => setSelectedTechnicianId(e.target.value)}
                                                className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 outline-none mb-3"
                                            >
                                                <option value="">Select a technician...</option>
                                                {technicians.map(tech => (
                                                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={handleAssignTechnician}
                                                disabled={!selectedTechnicianId || actionLoading}
                                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-all"
                                            >
                                                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : 'Confirm Assignment'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Status Actions */}
                                {(canReject || canClose || isRejecting) && (
                                    <div className="pt-2 border-t border-slate-100">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5" />
                                            Status Actions
                                        </p>

                                        {canReject && (
                                            <button
                                                onClick={() => setIsRejecting(true)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-sm font-medium transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                                Reject Ticket
                                            </button>
                                        )}

                                        {canClose && (
                                            <button
                                                onClick={() => setShowCloseModal(true)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm"
                                            >
                                                <CheckCheck className="w-4 h-4" />
                                                Close Ticket
                                            </button>
                                        )}

                                        {isRejecting && (
                                            <div className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-100">
                                                <p className="text-xs font-semibold text-rose-700 mb-2">Rejection Reason</p>
                                                <textarea
                                                    placeholder="Provide reason for rejection..."
                                                    value={rejectionReason}
                                                    onChange={(e) => setRejectionReason(e.target.value)}
                                                    className="w-full p-3 bg-white border border-rose-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 outline-none resize-none mb-3"
                                                    rows={3}
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setIsRejecting(false)}
                                                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate('REJECTED', rejectionReason)}
                                                        disabled={!rejectionReason.trim() || actionLoading}
                                                        className="flex-1 px-3 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold"
                                                    >
                                                        {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : 'Confirm Rejection'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[500px]">
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4 text-slate-500" />
                                    <h3 className="text-sm font-semibold text-slate-700">Activity Feed</h3>
                                    <span className="ml-auto text-xs text-slate-400">{comments.length} updates</span>
                                </div>
                            </div>

                            <div
                                ref={scrollContainerRef}
                                className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[300px]"
                            >
                                {comments.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="p-3 bg-slate-50 rounded-full w-fit mx-auto mb-3">
                                            <MessageCircle className="w-5 h-5 text-slate-300" />
                                        </div>
                                        <p className="text-sm text-slate-400">No comments yet</p>
                                        <p className="text-xs text-slate-300 mt-1">Be the first to add an update</p>
                                    </div>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment.id} className={`flex ${comment.userId === user?.id ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] ${comment.userId === user?.id ? 'order-2' : 'order-1'}`}>
                                                <div className={`flex items-center gap-2 mb-1 px-1 ${comment.userId === user?.id ? 'justify-end' : 'justify-start'}`}>
                                                    <span className="text-xs font-semibold text-slate-700">
                                                        {comment.userId === user?.id ? 'You' : comment.authorName}
                                                    </span>
                                                    {comment.authorRole && comment.userId !== user?.id && (
                                                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase ${comment.authorRole === 'ADMIN' ? 'bg-indigo-100 text-indigo-600' :
                                                            comment.authorRole === 'TECHNICIAN' ? 'bg-amber-100 text-amber-600' :
                                                                'bg-slate-100 text-slate-500'
                                                            }`}>
                                                            {comment.authorRole}
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] text-slate-400">{formatCommentDate(comment.createdAt)}</span>
                                                </div>
                                                {editingCommentId === comment.id ? (
                                                    <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                                                        <textarea
                                                            value={editingCommentContent}
                                                            onChange={(e) => setEditingCommentContent(e.target.value)}
                                                            maxLength={50}
                                                            className="w-full bg-white border border-indigo-200 rounded-lg p-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 outline-none resize-none"
                                                            rows={2}
                                                        />
                                                        <div className="flex justify-end gap-2 mt-2">
                                                            <button
                                                                onClick={() => setEditingCommentId(null)}
                                                                className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditComment(comment.id)}
                                                                className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-medium"
                                                            >
                                                                Save
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className={`p-3 rounded-xl text-sm shadow-sm ${comment.userId === user?.id
                                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                                        : 'bg-slate-100 text-slate-700 rounded-tl-none'
                                                        }`}>
                                                        {comment.content}
                                                    </div>
                                                )}
                                            </div>
                                            {comment.userId === user?.id && editingCommentId !== comment.id && (
                                                <div className="relative ml-2 order-1">
                                                    <button
                                                        onClick={() => setActiveMenuId(activeMenuId === comment.id ? null : comment.id)}
                                                        className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                    {activeMenuId === comment.id && (
                                                        <>
                                                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                                                            <div className="absolute right-0 mt-1 w-28 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-20">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingCommentId(comment.id);
                                                                        setEditingCommentContent(comment.content);
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className="w-full px-3 py-1.5 text-left text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
                                                                >
                                                                    <Edit2 className="w-3 h-3" />
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        handleDeleteComment(comment.id);
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className="w-full px-3 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-4 border-t border-slate-100 bg-white">
                                {['CLOSED', 'REJECTED'].includes(ticket.status) ? (
                                    <div className="py-3 px-4 bg-slate-50 rounded-xl text-center">
                                        <p className="text-xs text-slate-400">Comments are disabled for {ticket.status.toLowerCase()} tickets</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleAddComment} className="relative">
                                        <textarea
                                            placeholder="Add a comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            maxLength={50}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 outline-none resize-none"
                                            rows={2}
                                        />
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-[10px] text-slate-400">{newComment.length}/50</span>
                                            <button
                                                type="submit"
                                                disabled={!newComment.trim()}
                                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-xs font-medium transition-all"
                                            >
                                                <Send className="w-3.5 h-3.5" />
                                                Send
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Close Confirmation Modal */}
            <Modal isOpen={showCloseModal} onClose={() => setShowCloseModal(false)} title="Close Ticket">
                <div className="text-center">
                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">Close this ticket?</h4>
                    <p className="text-sm text-slate-500 mb-6">
                        Closing will archive this ticket. No further updates will be possible.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowCloseModal(false)}
                            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleStatusUpdate('CLOSED')}
                            disabled={actionLoading}
                            className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                        >
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Close Ticket"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Image Preview Modal */}
            <Modal isOpen={!!selectedPreviewImage} onClose={() => setSelectedPreviewImage(null)} title="Attachment Preview">
                <div className="flex flex-col items-center">
                    <img src={selectedPreviewImage} alt="Preview" className="max-w-full rounded-xl shadow-lg" />
                    <a
                        href={selectedPreviewImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                        Open in new tab <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
            </Modal>
        </div>
    );
};

export default AdminTicketDetails;