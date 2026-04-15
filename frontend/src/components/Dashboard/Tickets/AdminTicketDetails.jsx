import React, { useState, useEffect } from 'react';
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
    MessageSquare,
    Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axiosConfig';
import { useAuth } from '../../../context/AuthContext';
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
    const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
    const [selectedPreviewImage, setSelectedPreviewImage] = useState(null);

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
        try {
            await api.put(`/tickets/${ticketId}/status`, { status: newStatus, notes });
            toast.success(`Status updated to ${newStatus}`);
            fetchTicketDetails();
            onUpdate();
            setIsRejecting(false);
            setRejectionReason('');
        } catch (err) {
            toast.error('Failed to update status.');
        }
    };

    const handleAssignTechnician = async () => {
        if (!selectedTechnicianId) return;
        try {
            // Assign technician
            await api.put(`/tickets/${ticketId}/assign`, { technicianId: selectedTechnicianId });
            
            // Automatically update status to IN_PROGRESS as requested
            try {
                await api.put(`/tickets/${ticketId}/status`, { 
                    status: 'IN_PROGRESS', 
                    notes: 'Automatically updated upon technician assignment' 
                });
            } catch (statusErr) {
                console.error('Failed to auto-update status to IN_PROGRESS', statusErr);
            }

            toast.success('Technician assigned and status updated to In Progress');
            fetchTicketDetails();
            onUpdate();
            setIsAssigning(false);
        } catch (err) {
            toast.error('Failed to assign technician.');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await api.post(`/tickets/${ticketId}/comments`, { content: newComment });
            setNewComment('');
            fetchTicketDetails();
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
        } catch (err) {
            toast.error('Failed to update comment.');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        try {
            await api.delete(`/comments/${commentId}`);
            fetchTicketDetails();
        } catch (err) {
            toast.error('Failed to delete comment.');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-6 drop-shadow-xl shadow-indigo-200" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Accessing Secure Incident Log...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-12">
            {/* Header & Back Action */}
            <div className="flex items-center justify-between mb-8 group">
                <button 
                    onClick={onClose}
                    className="flex items-center px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Command Center
                </button>
                <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
                        REF: {ticket.id.substring(0, 8)}
                    </span>
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                        ticket.status === 'OPEN' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                        ticket.status === 'IN_PROGRESS' ? 'bg-violet-50 text-violet-600 border-violet-100' :
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
                    {/* Primary Details */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[5rem] -mr-16 -mt-16 -z-0" />
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-6">
                                {ticket.category}
                            </h2>
                            
                            <div className="flex flex-wrap gap-6 mb-10">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center mr-3">
                                        <Calendar className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Reported On</p>
                                        <p className="text-xs font-bold text-slate-700">{new Date(ticket.createdAt).toLocaleDateString()} {new Date(ticket.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center mr-3">
                                        <Building2 className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Origin Department</p>
                                        <p className="text-xs font-bold text-slate-700">{ticket.department || 'General'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center mr-3">
                                        <Tag className={`w-5 h-5 ${
                                            ticket.priority === 'HIGH' ? 'text-orange-400' :
                                            ticket.priority === 'MEDIUM' ? 'text-blue-400' : 'text-slate-400'
                                        }`} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Priority Flag</p>
                                        <p className={`text-xs font-black uppercase tracking-tight ${
                                            ticket.priority === 'HIGH' ? 'text-orange-600' :
                                            ticket.priority === 'MEDIUM' ? 'text-blue-600' : 'text-slate-600'
                                        }`}>{ticket.priority}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100/50">
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3">Issue Description</p>
                                <p className="text-slate-600 leading-relaxed font-medium">
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

                            {ticket.imageUrls && ticket.imageUrls.length > 0 && (
                                <div className="mt-10">
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
                        </div>
                    </div>

                    {/* Comments System */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-800 flex items-center">
                                <MessageSquare className="w-5 h-5 mr-3 text-indigo-500" />
                                Discussion Log
                                <span className="ml-3 px-2 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-lg uppercase tracking-widest">
                                    {comments.length}
                                </span>
                            </h3>
                        </div>

                        <div className="space-y-6 mb-10 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                            {comments.map((comment) => (
                                <div 
                                    key={comment.id} 
                                    className={`flex flex-col ${comment.userId === user.id ? 'items-end' : 'items-start'}`}
                                >
                                    <div className="flex items-center mb-1 px-1">
                                        <span className="text-[10px] font-black text-slate-400 tracking-tight uppercase">
                                            {comment.userId === user.id ? 'You' : comment.authorName}
                                        </span>
                                        <span className="mx-2 text-[10px] text-slate-300">•</span>
                                        <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">
                                            {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    
                                    <div className={`relative group max-w-[85%] p-4 rounded-2xl shadow-sm border transition-all ${
                                        comment.userId === user.id 
                                            ? 'bg-indigo-600 border-indigo-500 text-white rounded-tr-none' 
                                            : 'bg-white border-slate-100 text-slate-700 rounded-tl-none hover:border-slate-200'
                                    }`}>
                                        {editingCommentId === comment.id ? (
                                            <div className="space-y-3">
                                                <textarea 
                                                    value={editingCommentContent}
                                                    onChange={(e) => setEditingCommentContent(e.target.value)}
                                                    className="w-full bg-indigo-700/50 border border-white/20 rounded-xl p-2 text-white text-sm focus:ring-2 focus:ring-white/30 outline-none resize-none"
                                                    rows={2}
                                                />
                                                <div className="flex justify-end space-x-2">
                                                    <button 
                                                        onClick={() => setEditingCommentId(null)}
                                                        className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEditComment(comment.id)}
                                                        className="p-1.5 bg-white hover:bg-white text-indigo-600 rounded-lg transition-colors"
                                                    >
                                                        <CheckCircle2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm font-medium leading-relaxed">{comment.content}</p>
                                                
                                                {comment.userId === user.id && (
                                                    <div className="absolute top-1 -left-10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col space-y-1">
                                                        <button 
                                                            onClick={() => {
                                                                setEditingCommentId(comment.id);
                                                                setEditingCommentContent(comment.content);
                                                            }}
                                                            className="p-1.5 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-lg shadow-sm hover:shadow transition-all"
                                                        >
                                                            <Edit2 className="w-3 h-3" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            className="p-1.5 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 rounded-lg shadow-sm hover:shadow transition-all"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {comments.length === 0 && (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                        <MessageSquare className="w-8 h-8 text-slate-200" />
                                    </div>
                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">No Activity Records Yet</p>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleAddComment} className="relative group">
                            <textarea 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add an official comment or update..."
                                className="w-full pl-6 pr-20 py-5 bg-slate-50 border-none rounded-3xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-50 transition-all min-h-[100px] resize-none"
                            />
                            <button 
                                type="submit"
                                disabled={!newComment.trim()}
                                className="absolute right-4 bottom-4 p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-30 transition-all shadow-md group-hover:shadow-indigo-200"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar Column (Actions & Information) */}
                <div className="space-y-8">
                    {/* Management & Actions */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6">Management Panel</p>
                        
                        <div className="space-y-4">
                            {/* Technician Assignment */}
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-600 mb-3 flex items-center">
                                    <UserPlus className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                                    Security & Tech Assignment
                                </p>
                                
                                {ticket.assignedTo ? (
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center mr-3 font-black text-indigo-500 text-xs shadow-sm">
                                                {ticket.assignedToName?.substring(0, 1) || 'T'}
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Assigned Resolver</p>
                                                <p className="text-xs font-bold text-slate-700">{ticket.assignedToName || 'Technician'}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setIsAssigning(true)}
                                            className="p-1 px-3 bg-white text-slate-400 border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            Change
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setIsAssigning(true)}
                                        className="w-full flex items-center justify-center p-4 py-8 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all group"
                                    >
                                        <div className="text-center">
                                            <UserPlus className="w-6 h-6 mx-auto mb-2 text-slate-200 group-hover:text-indigo-300" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Assign Technician</span>
                                        </div>
                                    </button>
                                )}

                                {isAssigning && (
                                    <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl animate-in zoom-in-95 duration-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Choose Resolver</p>
                                            <button onClick={() => setIsAssigning(false)}><X className="w-3.5 h-3.5 text-indigo-400" /></button>
                                        </div>
                                        <select 
                                            value={selectedTechnicianId}
                                            onChange={(e) => setSelectedTechnicianId(e.target.value)}
                                            className="w-full bg-white border border-indigo-200 rounded-xl p-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200 mb-4 appearance-none appearance-custom"
                                        >
                                            <option value="">Select available staff...</option>
                                            {technicians.map(tech => (
                                                <option key={tech.id} value={tech.id}>{tech.name} ({tech.specialization || 'General'})</option>
                                            ))}
                                        </select>
                                        <button 
                                            onClick={handleAssignTechnician}
                                            disabled={!selectedTechnicianId}
                                            className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 disabled:opacity-30 disabled:shadow-none hover:bg-indigo-700 transition-all"
                                        >
                                            Confirm Assignment
                                        </button>
                                    </div>
                                )}
                            </div>

                            <hr className="border-slate-50 my-2" />

                            {/* Status Management */}
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-600 mb-3 flex items-center">
                                    <Clock className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                                    Status Override
                                </p>
                                
                                <div className="grid grid-cols-1 gap-2">
                                    {ticket.status === 'OPEN' && (
                                        <button 
                                            onClick={() => handleStatusUpdate('IN_PROGRESS')}
                                            className="w-full p-4 flex items-center justify-between bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-2xl transition-all group"
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-widest">Mark as Working</span>
                                            <Activity className="w-4 h-4" />
                                        </button>
                                    )}

                                    {['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(ticket.status) && !isRejecting && (
                                        <button 
                                            onClick={() => setIsRejecting(true)}
                                            className="w-full p-4 flex items-center justify-between bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl transition-all group"
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-widest">Reject & Close</span>
                                            <ShieldAlert className="w-4 h-4" />
                                        </button>
                                    )}

                                    {ticket.status === 'RESOLVED' && (
                                        <button 
                                            onClick={() => handleStatusUpdate('CLOSED')}
                                            className="w-full p-4 flex items-center justify-between bg-slate-800 text-white rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-slate-200"
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-widest">Close Incident</span>
                                            <ArrowLeft className="w-4 h-4 rotate-180" />
                                        </button>
                                    )}
                                </div>

                                {isRejecting && (
                                    <div className="mt-4 p-6 bg-rose-50 border border-rose-100 rounded-[2rem] animate-in slide-in-from-top-4 duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-[10px] font-black uppercase text-rose-600 tracking-widest">Rejection Protocol</p>
                                            <button onClick={() => setIsRejecting(false)}><X className="w-4 h-4 text-rose-300" /></button>
                                        </div>
                                        <textarea 
                                            placeholder="Provide technical reason for rejection..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            className="w-full p-4 bg-white border border-rose-100 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-rose-100 mb-4 h-24 resize-none"
                                        />
                                        <button 
                                            onClick={() => handleStatusUpdate('REJECTED', rejectionReason)}
                                            disabled={!rejectionReason.trim()}
                                            className="w-full py-3.5 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-rose-100 disabled:opacity-30 disabled:shadow-none hover:bg-rose-700 transition-all"
                                        >
                                            Confirm Rejection
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Image Preview Modal */}
            <Modal
                isOpen={!!selectedPreviewImage}
                onClose={() => setSelectedPreviewImage(null)}
                title="Evidence Preview"
            >
                <div className="flex flex-col items-center">
                    <img 
                        src={selectedPreviewImage} 
                        alt="Evidence Large Preview" 
                        className="w-full max-h-[70vh] object-contain rounded-2xl shadow-xl border border-slate-100" 
                    />
                    <div className="mt-6 flex justify-between w-full items-center">
                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest italic">Secure Incident Asset</p>
                        <a 
                            href={selectedPreviewImage} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
                        >
                            Open Original Hub
                        </a>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminTicketDetails;
