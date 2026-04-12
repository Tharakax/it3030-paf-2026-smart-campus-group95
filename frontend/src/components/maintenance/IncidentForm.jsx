import React, { useState } from 'react';
import { X, Send, AlertCircle, MapPin, Phone, Info } from 'lucide-react';
import incidentService from '../../api/maintenance/incidentService';

const IncidentForm = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        resourceId: '',
        category: 'ELECTRICAL',
        description: '',
        priority: 'MEDIUM',
        contactDetails: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const categories = [
        'ELECTRICAL', 'IT_NETWORK', 'PROJECTOR_AV', 'FURNITURE', 
        'PLUMBING', 'AC_VENTILATION', 'CLEANING', 'SAFETY_SECURITY', 
        'LAB_EQUIPMENT', 'OTHER'
    ];

    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await incidentService.createTicket(formData);
            onSuccess();
            onClose();
            setFormData({
                resourceId: '',
                category: 'ELECTRICAL',
                description: '',
                priority: 'MEDIUM',
                contactDetails: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit incident');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-white/20 scale-in-center transition-transform">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center text-white">
                    <div>
                        <h2 className="text-xl font-bold">Report New Incident</h2>
                        <p className="text-blue-100 text-xs mt-1">Our support team will look into this immediately.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="flex items-center p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                            <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Resource ID */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center">
                                <MapPin className="w-3 h-3 mr-1" /> Resource / Location
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. LAB-01, Room 204"
                                value={formData.resourceId}
                                onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center">
                                <Info className="w-3 h-3 mr-1" /> Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            >
                                {categories.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Issue Description</label>
                        <textarea
                            required
                            placeholder="Please provide details about the issue..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[120px] resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Priority */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Priority Level</label>
                            <div className="flex flex-wrap gap-2">
                                {priorities.map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priority: p })}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                                            formData.priority === p 
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30' 
                                            : 'bg-white text-slate-400 border-slate-200 hover:border-blue-300'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center">
                                <Phone className="w-3 h-3 mr-1" /> Contact Details
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="Phone or email for updates"
                                value={formData.contactDetails}
                                onChange={(e) => setFormData({ ...formData, contactDetails: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Submit Footer */}
                    <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-xl shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : (
                                <>
                                    <Send className="w-4 h-4 mr-2" /> Submit Ticket
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IncidentForm;
