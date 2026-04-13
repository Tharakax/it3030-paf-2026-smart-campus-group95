import React from 'react';
import { 
    Plus, 
    AlertCircle, 
    CheckCircle2 
} from 'lucide-react';

const Tickets = () => {
    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Support Tickets</h2>
                    <p className="text-slate-500 mt-1">Get help with campus services and IT.</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-indigo-200 transition-all active:scale-95">
                    <Plus className="w-5 h-5 mr-2" />
                    Open New Ticket
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { id: 'TKT-7821', title: 'WiFi Connectivity in Block C', priority: 'High', status: 'In Progress', date: '2 days ago' },
                    { id: 'TKT-7845', title: 'Library Card Not Working', priority: 'Medium', status: 'Resolved', date: '5 days ago' }
                ].map((tkt, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-[10px] font-black font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded tracking-widest">{tkt.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                tkt.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'
                            }`}>{tkt.priority} Priority</span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-indigo-600 transition-colors">{tkt.title}</h4>
                        <div className="flex items-center justify-between mt-8">
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${tkt.status === 'Resolved' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`} />
                                <span className="text-sm font-bold text-slate-500">{tkt.status}</span>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">{tkt.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tickets;
