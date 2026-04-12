import React, { useState } from 'react';
import { X, Send, AlertCircle, MapPin, Phone, Info } from 'lucide-react';
import incidentService from '../../api/maintenance/incidentService';
import MediaUpload from '../../utils/supabaseClient';
import toast from 'react-hot-toast';
import { Camera, Trash2 } from 'lucide-react';

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
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploadingImages, setUploadingImages] = useState(false);

    const categories = [
        'ELECTRICAL', 'IT_NETWORK', 'PROJECTOR_AV', 'FURNITURE',
        'PLUMBING', 'AC_VENTILATION', 'CLEANING', 'SAFETY_SECURITY',
        'LAB_EQUIPMENT', 'OTHER'
    ];

    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (selectedFiles.length + files.length > 3) {
            toast.error("You can only upload up to 3 images");
            return;
        }

        const newFiles = [...selectedFiles, ...files];
        setSelectedFiles(newFiles);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeFile = (index) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setUploadingImages(true);

        try {
            // 1. Upload images to Supabase
            let imageUrls = [];
            if (selectedFiles.length > 0) {
                const uploadPromises = selectedFiles.map(file => MediaUpload(file));
                imageUrls = await Promise.all(uploadPromises);
            }

            // 2. Submit ticket with image URLs
            await incidentService.createTicket({
                ...formData,
                imageUrls: imageUrls
            });

            toast.success('Incident reported successfully!');
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                resourceId: '',
                category: 'ELECTRICAL',
                description: '',
                priority: 'MEDIUM',
                contactDetails: ''
            });
            setSelectedFiles([]);
            setPreviews([]);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to submit incident');
            toast.error(err.response?.data?.message || 'Failed to submit incident');
        } finally {
            setLoading(false);
            setUploadingImages(false);
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
                    <button onClick={onClose} className="p-2 bg-transparent hover:bg-white/10 border-none rounded-full transition-colors text-white">
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
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
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
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
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
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[120px] resize-none"
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
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${formData.priority === p
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-500/30'
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
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center">
                            <Camera className="w-3 h-3 mr-1" /> Visual Evidence (Max 3)
                        </label>

                        <div className="grid grid-cols-3 gap-4">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}

                            {selectedFiles.length < 3 && (
                                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
                                    <Camera className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-1" />
                                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-500">ADD PHOTO</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Submit Footer */}
                    <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 bg-transparent hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95 transition-all disabled:opacity-50"
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
