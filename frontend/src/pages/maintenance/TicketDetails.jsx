import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import incidentService from '../../api/maintenance/incidentService';
import { StatusBadge, PriorityBadge } from '../../components/maintenance/IncidentBadges';
import IncidentComments from '../../components/maintenance/IncidentComments';
import {
    ArrowLeft, Calendar, User, MapPin, Phone,
    CheckCircle2, Play, XCircle, AlertTriangle,
    Clock, Tag, Building2, UserPlus, FileText, Camera, ExternalLink
} from 'lucide-react';

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [notes, setNotes] = useState('');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [targetStatus, setTargetStatus] = useState('');

    useEffect(() => {
        fetchTicket();
    }, [id]);

    const fetchTicket = async () => {
        try {
            const data = await incidentService.getTicketById(id);
            setTicket(data);
        } catch (err) {
            console.error("Failed to fetch", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        setActionLoading(true);
        try {
            await incidentService.updateTicketStatus(id, {
                status: targetStatus,
                notes: notes
            });
            await fetchTicket();
            setShowStatusModal(false);
            setNotes('');
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update status");
        } finally {
            setActionLoading(false);
        }
    };

    const handleAssignSelf = async () => {
        setActionLoading(true);
        try {
            await incidentService.assignTechnician(id, user.id);
            await fetchTicket();
        } catch (err) {
            alert("Failed to assign");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-400">Loading details...</div>;
    if (!ticket) return <div className="p-20 text-center text-red-500">Ticket not found.</div>;

    const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    const currentStatusIdx = statuses.indexOf(ticket.status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate('/tickets')}
                        className="flex items-center text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold bg-transparent border-none p-0"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to maintenance hub
                    </button>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Main Info Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Tag className="w-4 h-4 text-blue-500" />
                                        <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
                                            Case #{ticket.id.slice(-6)}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl font-extrabold text-slate-800 leading-tight">
                                        {ticket.category.replace('_', ' ')} Incident
                                    </h1>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <StatusBadge status={ticket.status} />
                                    <PriorityBadge priority={ticket.priority} />
                                </div>
                            </div>

                            {/* Workflow Stepper */}
                            <div className="flex items-center justify-between mb-10 px-4 relative">
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
                                {statuses.map((s, idx) => (
                                    <div key={s} className="relative z-10 flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${idx <= currentStatusIdx
                                            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-white text-white shadow-lg shadow-blue-500/30'
                                            : 'bg-white border-slate-100 text-slate-300'
                                            }`}>
                                            {idx < currentStatusIdx ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                                        </div>
                                        <span className={`text-[10px] font-bold mt-2 uppercase tracking-tight ${idx <= currentStatusIdx ? 'text-blue-600' : 'text-slate-400'}`}>
                                            {s.replace('_', ' ')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                                <p className="text-slate-700 leading-relaxed font-medium">
                                    {ticket.description}
                                </p>
                            </div>

                            {/* Evidence Gallery */}
                            {ticket.imageUrls && ticket.imageUrls.length > 0 && (
                                <div className="mb-10">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Camera className="w-4 h-4 text-slate-400" />
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                                            Visual Evidence
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {ticket.imageUrls.map((url, index) => (
                                            <div key={index} className="group relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                                                <img
                                                    src={url}
                                                    alt={`Evidence ${index + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
                                                    >
                                                        <ExternalLink className="w-5 h-5" />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Resource / Location</p>
                                        <p className="text-sm font-bold text-slate-700">{ticket.resourceId}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Contact Details</p>
                                        <p className="text-sm font-bold text-slate-700">{ticket.contactDetails}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <IncidentComments ticketId={ticket.id} currentUser={user} />
                        </div>
                    </div>

                    {/* Right Column: Actions & Metadata */}
                    <div className="space-y-6">
                        {/* Reporter Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Reporter Information</h4>
                            <div className="flex items-center space-x-3">
                                <img src={`https://ui-avatars.com/api/?name=${ticket.createdByName}&background=eff6ff&color=2563eb`} alt="Avatar" className="w-10 h-10 rounded-xl" />
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{ticket.createdByName}</p>
                                    <p className="text-xs text-slate-400">Reported on {new Date(ticket.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Assignee Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Assigned Technician</h4>
                            {ticket.assignedTo ? (
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-800">{ticket.assignedToName}</p>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-xs text-slate-400 italic mb-3">Unassigned</p>
                                    {(user.role === 'ADMIN' || user.role === 'TECHNICIAN') && (
                                        <button
                                            onClick={handleAssignSelf}
                                            disabled={actionLoading}
                                            className="w-full flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors border-none"
                                        >
                                            <UserPlus className="w-4 h-4 mr-2" /> {user.role === 'TECHNICIAN' ? 'Assign to Me' : 'Manage Assignment'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Available Actions</h4>

                            {ticket.status === 'OPEN' && (user.role === 'ADMIN' || user.role === 'TECHNICIAN') && (
                                <button
                                    onClick={() => { setTargetStatus('IN_PROGRESS'); setShowStatusModal(true); }}
                                    className="w-full flex items-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95 transition-all"
                                >
                                    <Play className="w-4 h-4 mr-3" /> Start Resolution
                                </button>
                            )}

                            {ticket.status === 'IN_PROGRESS' && (user.role === 'ADMIN' || user.role === 'TECHNICIAN') && (
                                <button
                                    onClick={() => { setTargetStatus('RESOLVED'); setShowStatusModal(true); }}
                                    className="w-full flex items-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-green-500/20 hover:shadow-green-500/40 active:scale-95 transition-all"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-3" /> Resolve Incident
                                </button>
                            )}

                            {ticket.status === 'RESOLVED' && (user.id === ticket.createdBy || user.role === 'ADMIN') && (
                                <button
                                    onClick={() => { setTargetStatus('CLOSED'); handleStatusUpdate(); }}
                                    className="w-full flex items-center px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white text-sm font-bold rounded-2xl shadow-lg shadow-slate-200 hover:shadow-slate-300 active:scale-95 transition-all"
                                >
                                    <XCircle className="w-4 h-4 mr-3" /> Close Ticket
                                </button>
                            )}

                            {user.role === 'ADMIN' && (ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS') && (
                                <button
                                    onClick={() => { setTargetStatus('REJECTED'); setShowStatusModal(true); }}
                                    className="w-full flex items-center px-4 py-3 border border-red-100 text-red-600 text-sm font-bold rounded-2xl hover:bg-red-50 transition-all"
                                >
                                    <AlertTriangle className="w-4 h-4 mr-3" /> Reject Case
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Status Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in transition-all">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-8 border border-white/20">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className={`p-3 rounded-2xl ${targetStatus === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                <FileText className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">
                                {targetStatus === 'REJECTED' ? 'Rejection Reason' : 'Resolution Notes'}
                            </h2>
                        </div>

                        <div className="mb-6">
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Internal Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Provide necessary details for this status change..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[120px] resize-none"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStatusUpdate}
                                disabled={actionLoading || !notes.trim()}
                                className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white shadow-xl transition-all active:scale-95 disabled:opacity-50 ${targetStatus === 'REJECTED' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 'bg-green-600 hover:bg-green-700 shadow-green-500/20'
                                    }`}
                            >
                                {actionLoading ? 'Updating...' : 'Confirm Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketDetails;
