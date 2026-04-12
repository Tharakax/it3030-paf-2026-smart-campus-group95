import React from 'react';

export const StatusBadge = ({ status }) => {
    const config = {
        OPEN: 'bg-blue-100 text-blue-700 border-blue-200',
        IN_PROGRESS: 'bg-orange-100 text-orange-700 border-orange-200',
        RESOLVED: 'bg-green-100 text-green-700 border-green-200',
        CLOSED: 'bg-slate-100 text-slate-700 border-slate-200',
        REJECTED: 'bg-red-100 text-red-700 border-red-200',
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
