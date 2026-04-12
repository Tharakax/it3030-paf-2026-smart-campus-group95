import React from 'react';
import { Calendar, MapPin, MessageSquare, User, ArrowRight } from 'lucide-react';
import { StatusBadge, PriorityBadge } from './IncidentBadges';

const IncidentCard = ({ incident, onClick }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div 
            onClick={() => onClick(incident.id)}
            className="group bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-100 transition-all duration-300 cursor-pointer relative overflow-hidden hover:-translate-y-1"
        >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-blue-500" />
            </div>

            <div className="flex justify-between items-start mb-4">
                <StatusBadge status={incident.status} />
                <PriorityBadge priority={incident.priority} />
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {incident.category.replace('_', ' ')}
            </h3>
            
            <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                {incident.description}
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex items-center text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 mr-2" />
                    <span className="truncate">Resource: {incident.resourceId || 'N/A'}</span>
                </div>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-slate-400">
                        <User className="w-3.5 h-3.5 mr-2" />
                        <span>{incident.createdByName || 'Unknown User'}</span>
                    </div>
                    
                    <div className="flex items-center text-[10px] font-medium text-slate-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(incident.createdAt)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncidentCard;
