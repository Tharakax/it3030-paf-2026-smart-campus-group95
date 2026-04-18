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

// Status enum → display label mapping
const statusLabels = {
    'OPEN': 'Open',
    'IN_PROGRESS': 'In Progress',
    'RESOLVED': 'Resolved',
    'CLOSED': 'Closed',
    'REJECTED': 'Rejected'
};

// Priority badge color styles
const priorityStyles = {
    'HIGH': 'bg-red-50 text-red-500 border-red-100',
    'MEDIUM': 'bg-amber-50 text-amber-500 border-amber-100',
    'LOW': 'bg-sky-50 text-sky-500 border-sky-100'
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
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
};

/**
 * Reusable TicketCard component.
 * 
 * Props:
 *  - ticket: { id, priority, category, description, status, createdAt }
 *  - onClick: optional click handler
 */
const TicketCard = ({ ticket, onClick }) => {
    const displayStatus = statusLabels[ticket.status] || ticket.status;
    const isResolved = ticket.status === 'RESOLVED' || ticket.status === 'CLOSED';
    const isRejected = ticket.status === 'REJECTED';

    const glassStyle = {
        background: 'rgba(255,255,255,.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,0,0,.05)',
        borderRadius: 32,
        boxShadow: '0 8px 24px rgba(0,0,0,.02)'
    };

    return (
        <div
            onClick={onClick}
            style={glassStyle}
            className="bg-white/80 p-8 border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group cursor-pointer relative overflow-hidden active:scale-[0.98] hover:-translate-y-1"
        >
            {/* Status Accent Bar */}
            <div className={`absolute top-0 left-0 w-full h-1.5 transition-all duration-500 group-hover:h-2 ${isResolved ? 'bg-emerald-400'
                    : isRejected ? 'bg-rose-400'
                        : 'bg-blue-500'
                }`} />

            {/* Header: ID + Priority Badge */}
            <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black font-mono text-slate-400 bg-slate-50/50 px-3 py-1.5 rounded-xl tracking-[0.15em] border border-slate-100/50 group-hover:bg-white transition-colors">
                    #{ticket.ticketId || (ticket.id ? ticket.id.substring(0, 8).toUpperCase() : 'NEW')}
                </span>
                <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${priorityStyles[ticket.priority] || priorityStyles['LOW']
                    }`}>
                    {ticket.priority}
                </span>
            </div>

            {/* Body: Category + Description */}
            <div className="mb-8">
                <div className="flex items-center space-x-2 mb-2">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                        {categoryLabels[ticket.category] || ticket.category}
                    </p>
                    {ticket.resourceType && (
                        <>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] leading-none">
                                {ticket.resourceType.replace(/_/g, ' ')}
                            </p>
                        </>
                    )}
                </div>
                <h4 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">
                    {ticket.description.length > 40 ? ticket.description.substring(0, 40) + '...' : ticket.description}
                </h4>
            </div>

            {/* Footer: Status + Date */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-50">
                <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isResolved ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                            : isRejected ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                                : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse'
                        }`} />
                    <span className="text-sm font-bold text-slate-500">{displayStatus}</span>
                </div>
                <span className="text-xs text-slate-400 font-bold">{formatDate(ticket.createdAt)}</span>
            </div>
        </div>
    );
};

export default TicketCard;
