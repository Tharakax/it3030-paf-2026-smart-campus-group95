import React from 'react';

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
 * 
 * Props:
 *  - ticket: { id, priority, category, description, status, createdAt, resourceType, ticketId }
 *  - onClick: optional click handler
 */
const TicketCard = ({ ticket, onClick }) => {
    const status = statusConfig[ticket.status] || statusConfig['OPEN'];
    const isResolved = ticket.status === 'RESOLVED' || ticket.status === 'CLOSED';
    const isRejected = ticket.status === 'REJECTED';
    const ticketNumber = ticket.ticketId || (ticket.id ? ticket.id.substring(0, 8).toUpperCase() : 'NEW');

    return (
        <div
            onClick={onClick}
            className="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer overflow-hidden"
        >
            {/* Status Accent Bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${isResolved ? 'bg-emerald-500' : isRejected ? 'bg-rose-500' : 'bg-blue-500'}`} />

            <div className="p-5">
                {/* Header: ID + Priority */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                        {ticketNumber}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide border ${priorityStyles[ticket.priority] || priorityStyles['LOW']}`}>
                        <span>{priorityIcons[ticket.priority] || '🟢'}</span>
                        {ticket.priority}
                    </span>
                </div>

                {/* Category Badge */}
                <div className="mb-3">
                    <span className="inline-block px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                        {categoryLabels[ticket.category] || ticket.category}
                    </span>
                    {ticket.resourceType && (
                        <>
                            <span className="mx-1.5 text-slate-300">•</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                                {ticket.resourceType.replace(/_/g, ' ')}
                            </span>
                        </>
                    )}
                </div>

                {/* Description */}
                <p className="text-sm font-medium text-slate-700 leading-relaxed line-clamp-2 mb-4">
                    {ticket.description.length > 80 ? ticket.description.substring(0, 80) + '...' : ticket.description}
                </p>

                {/* Footer: Status + Date */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}>
                            {status.label}
                        </span>
                    </div>
                    <span className="text-xs text-slate-400">
                        {formatDate(ticket.createdAt)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TicketCard;