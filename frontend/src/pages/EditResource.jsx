import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const EditResource = ({ resourceId, onResourceUpdated }) => {
    const { id: paramId } = useParams();
    const id = resourceId || paramId;
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

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
        bookable: true
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
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
                    bookable: data.bookable ?? true
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

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity *</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.capacity ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                            />
                            {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
                        </div>

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

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available From</label>
                            <input
                                type="text"
                                name="availabilityStartTime"
                                value={formData.availabilityStartTime}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.availabilityStartTime ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                            />
                            {errors.availabilityStartTime && <p className="text-red-500 text-xs mt-1">{errors.availabilityStartTime}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Until</label>
                            <input
                                type="text"
                                name="availabilityEndTime"
                                value={formData.availabilityEndTime}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.availabilityEndTime ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                            />
                            {errors.availabilityEndTime && <p className="text-red-500 text-xs mt-1">{errors.availabilityEndTime}</p>}
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