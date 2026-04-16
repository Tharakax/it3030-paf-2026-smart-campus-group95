import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Save, Loader2, AlertCircle, ImagePlus, X, Upload, ImageIcon, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import MediaUpload from '../utils/supabaseClient';

const EditResource = ({ resourceId, onResourceUpdated }) => {
    const { id: paramId } = useParams();
    const id = resourceId || paramId;
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        resourceCode: '',
        name: '',
        description: '',
        type: '',
        capacity: '',
        department: '',
        availabilityStartTime: '',
        availabilityEndTime: '',
        status: '',
        bookable: true,
        imageUrls: []
    });

    const [imageUrlInput, setImageUrlInput] = useState('');

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const publicUrl = await MediaUpload(file);
            setFormData(prev => ({
                ...prev,
                imageUrls: [...prev.imageUrls, publicUrl]
            }));
            toast.success('Image uploaded successfully!');
        } catch (err) {
            console.error('Upload failed:', err);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const addImageUrl = () => {
        if (!imageUrlInput.trim()) return;
        setFormData(prev => ({
            ...prev,
            imageUrls: [...prev.imageUrls, imageUrlInput.trim()]
        }));
        setImageUrlInput('');
    };

    const removeImageUrl = (index) => {
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index)
        }));
    };

    const handleAddImage = () => {
        addImageUrl();
    };

    const handleRemoveImage = (index) => {
        removeImageUrl(index);
    };

    useEffect(() => {
        const fetchResource = async () => {
            try {
                const response = await axiosInstance.get(`/resources/${id}`);
                const data = response.data;
                setFormData({
                    resourceCode: data.resourceCode || '',
                    name: data.name || '',
                    description: data.description || '',
                    type: data.type || 'LECTURE_HALL',
                    capacity: data.capacity || '',
                    department: data.department || '',
                    availabilityStartTime: data.availabilityStartTime || '08:00:00',
                    availabilityEndTime: data.availabilityEndTime || '18:00:00',
                    status: data.status || 'ACTIVE',
                    bookable: data.bookable ?? true,
                    imageUrls: data.imageUrls || []
                });
                setError(null);
            } catch (err) {
                console.error('Error fetching resource details:', err);
                setError('Failed to load resource data.');
                toast.error('Failed to load resource data.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchResource();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                capacity: parseInt(formData.capacity, 10),
                department: formData.department === '' ? null : formData.department
            };

            await axiosInstance.put(`/resources/${id}`, payload);
            toast.success('Resource updated successfully!');
            if (onResourceUpdated) {
                onResourceUpdated();
            } else {
                navigate(`/resources/${id}`);
            }
        } catch (err) {
            console.error('Error updating resource:', err);
            const backendError = err.response?.data?.message || 'Failed to update resource.';
            setError(backendError);
            toast.error(backendError);
        } finally {
            setSubmitting(false);
        }
    };

    if (user?.role !== 'ADMIN') {
        return (
            <div className="container mx-auto p-6 text-center">
                <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100 max-w-lg mx-auto">
                    <p className="text-lg font-semibold">Access Denied</p>
                    <p>Only administrators can access this page.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading resource data...</p>
            </div>
        );
    }

    return (
        <div className={`container mx-auto p-4 max-w-2xl ${onResourceUpdated ? 'px-0 py-0' : ''}`}>
            {!onResourceUpdated && (
                <button 
                    onClick={() => navigate(`/resources/${id}`)}
                    className="mb-6 flex items-center text-slate-500 hover:text-blue-600 transition font-medium"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Details
                </button>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {!onResourceUpdated && (
                    <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
                        <h1 className="text-2xl font-bold text-slate-800">Edit Resource</h1>
                        <p className="text-slate-500 text-sm">Update details for {formData.resourceCode} - {formData.name}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resource Code</label>
                            <input
                                readOnly
                                name="resourceCode"
                                value={formData.resourceCode}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed outline-none font-mono"
                                title="Resource Code cannot be changed"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Name *</label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>

                        {/* <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Type *</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            >
                                <option value="LECTURE_HALL">Lecture Hall</option>
                                <option value="LAB">Lab</option>
                                <option value="MEETING_ROOM">Meeting Room</option>
                                <option value="AUDITORIUM">Auditorium</option>
                                <option value="STUDY_ROOM">Study Room</option>
                                <option value="GROUND">Ground</option>
                                <option value="EQUIPMENT">Equipment</option>
                            </select>
                        </div> */}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity *</label>
                            <input
                                required
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            >
                                <option value="">Shared (No Department)</option>
                                <option value="FACULTY_OF_COMPUTING">Computing</option>
                                <option value="FACULTY_OF_ENGINEERING">Engineering</option>
                                <option value="FACULTY_OF_BUSINESS">Business</option>
                                <option value="FACULTY_OF_HUMANITIES">Humanities</option>
                                <option value="FACULTY_OF_SCIENCE">Science</option>
                                <option value="COMMON_AREA">Common Area</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="OUT_OF_SERVICE">Out of Service</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available From</label>
                            <input
                                required
                                type="text"
                                name="availabilityStartTime"
                                value={formData.availabilityStartTime}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Until</label>
                            <input
                                required
                                type="text"
                                name="availabilityEndTime"
                                value={formData.availabilityEndTime}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        ></textarea>
                    </div>

                    <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-lg">
                        <input
                            type="checkbox"
                            id="bookable"
                            name="bookable"
                            checked={formData.bookable}
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="bookable" className="text-sm font-semibold text-slate-700 cursor-pointer">
                            Available for Public Booking
                        </label>
                    </div>

                    {/* Image Management Section */}
                    <div className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                                <ImageIcon className="w-4 h-4 mr-2 text-blue-500" />
                                Resource Images
                            </label>
                            <span className="text-xs text-slate-400 font-medium">{formData.imageUrls.length} images added</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* File Upload */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Upload From Computer</label>
                                <div 
                                    onClick={() => !uploading && fileInputRef.current?.click()}
                                    className={`relative cursor-pointer group flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-xl transition-all duration-300 ${uploading ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'}`}
                                >
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="hidden" 
                                        accept="image/*"
                                    />
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 text-blue-500 animate-spin mb-1" />
                                            <span className="text-[11px] font-medium text-slate-500 text-center">Cloud Syncing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-2 rounded-full bg-slate-50 group-hover:bg-blue-100 transition-colors mb-1">
                                                <Upload className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-600 group-hover:text-blue-700">Browse Photos</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* External URL */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">External URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        placeholder="Paste image URL..."
                                        value={imageUrlInput}
                                        onChange={(e) => setImageUrlInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm bg-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={addImageUrl}
                                        className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition flex items-center"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-400 italic">Adds link without uploading</p>
                            </div>
                        </div>

                        {formData.imageUrls.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {formData.imageUrls.map((url, index) => (
                                    <div key={index} className="group relative aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                        <img
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://blue-realistic-lemur-444.mypinata.cloud/ipfs/bafkreieat76mqk7shizue7a7c7m3vshov5k5ywyv2onhnuve4pwn5lyq2e';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => removeImageUrl(index)}
                                                className="p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition shadow-lg scale-90 group-hover:scale-100"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm font-bold">
                                            #{index + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-6 border-2 border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
                                <ImageIcon className="w-6 h-6 mb-2 opacity-20" />
                                <p className="text-[11px] font-medium italic">No media attached to this resource.</p>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditResource;
