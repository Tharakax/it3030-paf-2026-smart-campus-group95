import React from 'react';

export const StatusBadge = ({ status }) => {
    const config = {
        OPEN: 'bg-blue-50 text-blue-600 border-blue-100',
        IN_PROGRESS: 'bg-amber-50 text-amber-600 border-amber-100',
        RESOLVED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        CLOSED: 'bg-slate-50 text-slate-600 border-slate-100',
        REJECTED: 'bg-red-50 text-red-600 border-red-100',
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${config[status] || config.OPEN}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

export const PriorityBadge = ({ priority }) => {
    const config = {
        LOW: 'text-slate-500 bg-slate-50',
        MEDIUM: 'text-emerald-600 bg-emerald-50',
        HIGH: 'text-orange-600 bg-orange-50',
        URGENT: 'text-red-600 bg-red-50 animate-pulse',
    };

    return (
        <span className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${config[priority] || config.LOW}`}>
            <span className="w-1 h-1 rounded-full bg-current"></span>
            <span>{priority}</span>
        </span>
    );
};
