import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Save, Loader2, AlertCircle, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CreateResource = ({ onResourceCreated }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: '',
        capacity: '',
        department: '',
        availabilityStartTime: '08:00:00',
        availabilityEndTime: '18:00:00',
        status: '',
        bookable: true
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.type) {
            newErrors.type = 'Resource type is required';
        }

        if (!formData.department) {
            newErrors.department = 'Department is required';
        }

        if (!formData.status) {
            newErrors.status = 'Status is required';
        }

        if (!formData.capacity) {
            newErrors.capacity = 'Capacity is required';
        } else if (parseInt(formData.capacity) <= 0) {
            newErrors.capacity = 'Capacity must be a positive number';
        }

        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
        let startTimeValid = true;
        let endTimeValid = true;

        if (!timeRegex.test(formData.availabilityStartTime)) {
            newErrors.availabilityStartTime = 'Invalid format (HH:MM:SS)';
            startTimeValid = false;
        }
        if (!timeRegex.test(formData.availabilityEndTime)) {
            newErrors.availabilityEndTime = 'Invalid format (HH:MM:SS)';
            endTimeValid = false;
        }

        // Chronological validation if both formats are correct
        if (startTimeValid && endTimeValid) {
            if (formData.availabilityStartTime >= formData.availabilityEndTime) {
                newErrors.availabilityEndTime = 'End time must be after start time';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the validation errors');
            return;
        }

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
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.type ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                            >
                                <option value="">Select Type</option>
                                <option value="LECTURE_HALL">Lecture Hall</option>
                                <option value="LAB">Lab</option>
                                <option value="MEETING_ROOM">Meeting Room</option>
                                <option value="AUDITORIUM">Auditorium</option>
                                <option value="STUDY_ROOM">Study Room</option>
                                <option value="GROUND">Ground</option>
                                <option value="EQUIPMENT">Equipment</option>
                            </select>
                            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                        </div>

                        {/* Capacity */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity *</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                placeholder="0"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.capacity ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                            />
                            {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
                        </div>

                        {/* Department */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department *</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.department ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                            >
                                <option value="">Select Department</option>
                                <option value="FACULTY_OF_COMPUTING">Computing</option>
                                <option value="FACULTY_OF_ENGINEERING">Engineering</option>
                                <option value="FACULTY_OF_BUSINESS">Business</option>
                                <option value="FACULTY_OF_HUMANITIES">Humanities</option>
                                <option value="FACULTY_OF_SCIENCE">Science</option>
                                <option value="COMMON_AREA">Common Area</option>
                            </select>
                            {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                        </div>

                        {/* Status */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status *</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.status ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                            >
                                <option value="">Select Status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="OUT_OF_SERVICE">Out of Service</option>
                            </select>
                            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                        </div>

                        {/* Availability Start */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available From</label>
                            <input
                                type="text"
                                name="availabilityStartTime"
                                value={formData.availabilityStartTime}
                                onChange={handleChange}
                                placeholder="08:00:00"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.availabilityStartTime ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                            />
                            {errors.availabilityStartTime && <p className="text-red-500 text-xs mt-1">{errors.availabilityStartTime}</p>}
                        </div>

                        {/* Availability End */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Until</label>
                            <input
                                type="text"
                                name="availabilityEndTime"
                                value={formData.availabilityEndTime}
                                onChange={handleChange}
                                placeholder="18:00:00"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.availabilityEndTime ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                            />
                            {errors.availabilityEndTime && <p className="text-red-500 text-xs mt-1">{errors.availabilityEndTime}</p>}
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