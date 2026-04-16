import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Save, Loader2, AlertCircle, Info, ImagePlus, X, Upload, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import MediaUpload from '../utils/supabaseClient';

const CreateResource = ({ onResourceCreated }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'LECTURE_HALL',
        capacity: '',
        department: '',
        availabilityStartTime: '08:00:00',
        availabilityEndTime: '18:00:00',
        status: 'ACTIVE',
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

    const handleAddImage = () => {
        if (!imageUrlInput.trim()) return;
        setFormData(prev => ({
            ...prev,
            imageUrls: [...prev.imageUrls, imageUrlInput.trim()]
        }));
        setImageUrlInput('');
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index)
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Transform capacity to number
            const payload = {
                ...formData,
                capacity: parseInt(formData.capacity, 10),
                department: formData.department === '' ? null : formData.department
            };

            await axiosInstance.post('/resources', payload);
            toast.success('Resource created successfully! Code generated automatically.');
            if (onResourceCreated) {
                onResourceCreated();
            } else {
                navigate('/resources');
            }
        } catch (err) {
            console.error('Error creating resource:', err);
            const backendError = err.response?.data?.message || 'Failed to create resource. Please check the input.';
            setError(backendError);
            toast.error(backendError);
        } finally {
            setLoading(false);
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

    return (
        <div className={`container mx-auto p-4 max-w-2xl ${onResourceCreated ? 'px-0 py-0' : ''}`}>
            {/* Navigation */}
            {!onResourceCreated && (
                <button 
                    onClick={() => navigate('/resources')}
                    className="mb-6 flex items-center text-slate-500 hover:text-blue-600 transition font-medium"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Catalogue
                </button>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {!onResourceCreated && (
                    <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
                        <h1 className="text-2xl font-bold text-slate-800">Create New Resource</h1>
                        <p className="text-slate-500 text-sm">Add a new facility or asset to the campus catalogue.</p>
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
                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Name *</label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Main Hall"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>

                        {/* Type */}
                        <div className="space-y-1">
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
                        </div>

                        {/* Capacity */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity *</label>
                            <input
                                required
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>

                        {/* Department */}
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

                        {/* Status */}
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

                        {/* Availability Start */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available From</label>
                            <input
                                required
                                type="text"
                                name="availabilityStartTime"
                                value={formData.availabilityStartTime}
                                onChange={handleChange}
                                placeholder="08:00:00"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>

                        {/* Availability End */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Until</label>
                            <input
                                required
                                type="text"
                                name="availabilityEndTime"
                                value={formData.availabilityEndTime}
                                onChange={handleChange}
                                placeholder="18:00:00"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>

                        {/* Auto-Code Notice */}
                        <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg border border-blue-100 md:col-span-2">
                            <Info size={16} className="text-blue-600" />
                            <p className="text-xs text-blue-700 font-medium italic">
                                Resource Code will be generated automatically based on the selected type after creation (e.g., {
                                    formData.type === 'LECTURE_HALL' ? 'LH' : 
                                    formData.type === 'LAB' ? 'LAB' : 
                                    formData.type === 'MEETING_ROOM' ? 'MR' : 
                                    formData.type === 'AUDITORIUM' ? 'AUD' : 
                                    formData.type === 'STUDY_ROOM' ? 'SR' : 
                                    formData.type === 'GROUND' ? 'GRD' : 'EQ'
                                }-XXX).
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Brief details about the resource..."
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        ></textarea>
                    </div>

                    {/* Bookable */}
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
                    {/* Image Management */}
                    <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Resource Images</label>
                            <span className="text-[10px] text-slate-400 font-bold bg-white px-2 py-0.5 rounded-full border border-slate-100 uppercase tracking-tighter">
                                {formData.imageUrls.length} Added
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Option 1: Upload File */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Upload From Computer</label>
                                <div 
                                    onClick={() => !uploading && fileInputRef.current?.click()}
                                    className={`relative cursor-pointer group flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-xl transition-all duration-300 ${uploading ? 'bg-slate-100 border-slate-200 cursor-not-allowed' : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'}`}
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
                                            <span className="text-[11px] font-medium text-slate-500">Uploading to Cloud...</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-2 rounded-full bg-slate-50 group-hover:bg-blue-100 transition-colors mb-1">
                                                <Upload className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-600 group-hover:text-blue-700">Click to Select Photo</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Option 2: External URL */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Add External URL</label>
                                <div className="flex flex-col gap-2">
                                    <div className="relative group">
                                        <input
                                            type="url"
                                            value={imageUrlInput}
                                            onChange={(e) => setImageUrlInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                                            placeholder="Paste image link here"
                                            className="w-full pl-4 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-[13px] bg-white group-hover:border-slate-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddImage}
                                            disabled={!imageUrlInput.trim()}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-all disabled:opacity-0 disabled:scale-95 flex items-center shadow-lg shadow-black/10"
                                        >
                                            <ImagePlus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <p className="text-[10px] px-1 text-slate-400 italic">Example: https://photos.glance.com/hall-405.jpg</p>
                                </div>
                            </div>
                        </div>

                        {formData.imageUrls.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                                {formData.imageUrls.map((url, index) => (
                                    <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-white group shadow-sm hover:shadow-md transition-shadow">
                                        <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 p-1 bg-white/90 text-rose-500 hover:bg-rose-500 hover:text-white rounded-full shadow-lg transition-all scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100"
                                        >
                                            <X size={14} />
                                        </button>
                                        <div className="absolute bottom-1 left-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-4 h-4 rounded bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold">
                                                {index + 1}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {!formData.imageUrls.length && !uploading && (
                            <div className="py-4 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-white/50">
                                <p className="text-[11px] font-medium text-slate-400 text-center px-4 italic leading-relaxed">
                                    No photos added. High-quality visuals increase booking rates.<br/>
                                    <span className="text-[9px] uppercase tracking-wide opacity-70">Supports JPG, PNG & WEBP</span>
                                </p>
                            </div>
                        )}
                    </div>
                    {/* Submit Section */}
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Create Resource
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateResource;
