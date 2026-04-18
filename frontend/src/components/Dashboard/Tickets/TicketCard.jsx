import React from 'react';
import { MapPin, User, Building2, Box, ChevronRight } from 'lucide-react';

// Category enum → display label mapping
const categoryLabels = {
    'ELECTRICAL': 'Electrical & Lighting',
    'IT_NETWORK': 'IT & Network Support',
    'PROJECTOR_AV': 'Projector & AV Equipment',
    'FURNITURE': 'Furniture & Fixtures',
    'PLUMBING': 'Plumbing & Water',
    'AC_VENTILATION': 'AC & Ventilation',
    'CLEANING': 'Cleaning & Janitorial',
    'SAFETY_SECURITY': 'Safety & Security',
    'LAB_EQUIPMENT': 'Lab Equipment',
    'OTHER': 'Other'
};

// Status enum → display label and config
const statusConfig = {
    'OPEN': { label: 'Open', color: 'bg-blue-50 text-blue-700 border-blue-200', dotColor: 'bg-blue-500' },
    'IN_PROGRESS': { label: 'In Progress', color: 'bg-amber-50 text-amber-700 border-amber-200', dotColor: 'bg-amber-500' },
    'RESOLVED': { label: 'Resolved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dotColor: 'bg-emerald-500' },
    'CLOSED': { label: 'Closed', color: 'bg-slate-100 text-slate-600 border-slate-200', dotColor: 'bg-slate-400' },
    'REJECTED': { label: 'Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200', dotColor: 'bg-rose-500' }
};

// Priority badge color styles
const priorityStyles = {
    'HIGH': 'bg-rose-50 text-rose-700 border-rose-200',
    'MEDIUM': 'bg-amber-50 text-amber-700 border-amber-200',
    'LOW': 'bg-sky-50 text-sky-700 border-sky-200'
};

const priorityIcons = {
    'HIGH': '🔴',
    'MEDIUM': '🟡',
    'LOW': '🟢'
};

/**
 * Formats a date string into a human-readable relative time.
 */
const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

/**
 * Reusable TicketCard component.
 */
const TicketCard = ({ ticket, onClick }) => {
    const status = statusConfig[ticket.status] || statusConfig['OPEN'];
    const isResolved = ticket.status === 'RESOLVED' || ticket.status === 'CLOSED';
    const isRejected = ticket.status === 'REJECTED';
    const ticketNumber = ticket.ticketId || (ticket.id ? ticket.id.substring(0, 8).toUpperCase() : 'NEW');

    return (
        <div
            onClick={onClick}
            className="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 hover:-translate-y-1.5 hover:scale-[1.01] transition-all duration-300 ease-out cursor-pointer overflow-hidden active:scale-[0.98]"
        >
            {/* Status Accent Bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5 ${isResolved ? 'bg-emerald-500' : isRejected ? 'bg-rose-500' : 'bg-blue-500'}`} />

            <div className="p-5">
                {/* Header: ID + Priority */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 group-hover:bg-white transition-colors">
                        {ticketNumber}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide border shadow-sm ${priorityStyles[ticket.priority] || priorityStyles['LOW']}`}>
                        <span>{priorityIcons[ticket.priority] || '🟢'}</span>
                        {ticket.priority}
                    </span>
                </div>

                {/* Main Info: Category + Location */}
                <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                            {categoryLabels[ticket.category] || ticket.category}
                        </h4>
                        <ChevronRight className="w-4 h-4 text-blue-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    <div className="flex items-center flex-wrap gap-y-1 gap-x-3 text-[11px] text-slate-500 font-medium">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 group-hover:text-blue-400 transition-colors" />
                            {ticket.resourceName || 'Unknown Site'}
                        </div>
                        <span className="text-slate-200">|</span>
                        <div className="flex items-center gap-1">
                            <Box className="w-3 h-3 text-slate-400 group-hover:text-blue-400 transition-colors" />
                            {ticket.resourceType ? ticket.resourceType.replace(/_/g, ' ') : 'General'}
                        </div>
                        <span className="text-slate-200">|</span>
                        <div className="flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-slate-400 group-hover:text-blue-400 transition-colors" />
                            {ticket.department ? ticket.department.replace(/_/g, ' ') : 'General'}
                        </div>
                    </div>
                </div>

                {/* Description - Compact */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4 group-hover:text-slate-700 transition-colors">
                    {ticket.description}
                </p>

                {/* Meta: Assignee + Date */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-50 group-hover:border-slate-100 transition-colors">
                    <div className="flex items-center gap-2">
                        {ticket.assignedToName ? (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold border border-blue-100 shadow-sm group-hover:bg-blue-100/50 transition-colors">
                                <User className="w-2.5 h-2.5" />
                                {ticket.assignedToName.split(' ')[0]}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${status.dotColor} group-hover:scale-125 transition-transform`} />
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.color}`}>
                                    {status.label}
                                </span>
                            </div>
                        )}
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-500 transition-colors">
                        {formatDate(ticket.createdAt)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TicketCard;