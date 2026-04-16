import React from 'react';
import { 
    Calendar, 
    Plus 
} from 'lucide-react';

const Bookings = () => {
    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">My Bookings</h2>
                    <p className="text-slate-500 mt-1">Manage and track your facility reservations.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-blue-200 transition-all active:scale-95">
                    <Plus className="w-5 h-5 mr-2" />
                    New Reservation
                </button>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Resource</th>
                            <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
                            <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {[
                            { resource: 'Study Room 204', icon: Calendar, time: 'April 15, 10:00 AM', status: 'Confirmed', color: 'bg-green-100 text-green-700' },
                            { resource: 'Main Library Desk 12', icon: Calendar, time: 'April 18, 02:30 PM', status: 'Pending', color: 'bg-amber-100 text-amber-700' }
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mr-3 group-hover:scale-110 transition-transform">
                                            <row.icon size={18} />
                                        </div>
                                        <span className="font-bold text-slate-700 tracking-tight">{row.resource}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-sm text-slate-500 font-medium">{row.time}</td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${row.color}`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <button className="text-slate-400 hover:text-blue-600 font-bold text-xs uppercase transition-colors">Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Bookings;
