import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Building2, Shield, Info, Box, Edit, Trash2 } from 'lucide-react';
import axiosInstance from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ResourceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResource = async () => {
            try {
                //const response = await axiosInstance.get(`/api/resources/${id}`);
                const response = await axiosInstance.get(`/resources/${id}`);
                setResource(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching resource details:', err);
                setError('Could not find the requested resource.');
            } finally {
                setLoading(false);
            }
        };

        fetchResource();
    }, [id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${resource.name}"? This action cannot be undone.`);
        if (!confirmDelete) return;

        setDeleting(true);
        try {
            await axiosInstance.delete(`/resources/${id}`);
            toast.success('Resource deleted successfully');
            navigate('/resources');
        } catch (err) {
            console.error('Error deleting resource:', err);
            const errorMessage = err.response?.data?.message || 'Failed to delete the resource. Please try again.';
            toast.error(errorMessage);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-500 font-medium">Loading details...</p>
            </div>
        );
    }

    if (error || !resource) {
        return (
            <div className="container mx-auto p-6 text-center">
                <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100 max-w-lg mx-auto">
                    <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold">{error || 'Resource not found'}</p>
                    <button 
                        onClick={() => navigate('/resources')}
                        className="mt-6 flex items-center justify-center py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition mx-auto"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Catalogue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            {/* Navigation */}
            <div className="flex justify-between items-center mb-6">
                <button 
                    onClick={() => navigate('/resources')}
                    className="flex items-center text-slate-500 hover:text-blue-600 transition font-medium"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Catalogue
                </button>

                {user?.role === 'ADMIN' && (
                    <div className="flex items-center space-x-3">
                        <button 
                            onClick={() => navigate(`/resources/${id}/edit`)}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-md shadow-blue-500/20"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Resource
                        </button>
                        <button 
                            onClick={handleDelete}
                            disabled={deleting}
                            className={`flex items-center px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition font-semibold ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Header Section */}
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase tracking-wider">
                                {resource.resourceCode}
                            </span>
                            <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase tracking-wider ${
                                resource.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {resource.status.replace(/_/g, ' ')}
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-800">{resource.name}</h1>
                    </div>
                    <div className="flex items-center px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-sm font-semibold text-slate-500 mr-2">Bookable:</span>
                        {resource.bookable ? (
                            <span className="text-green-600 font-bold flex items-center">
                                <Shield className="w-4 h-4 mr-1" /> Yes
                            </span>
                        ) : (
                            <span className="text-red-500 font-bold">No</span>
                        )}
                    </div>
                </div>

                <div className="p-8">
                    {/* Description */}
                    <div className="mb-10">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Description</h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            {resource.description || 'No description provided for this resource.'}
                        </p>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Core Info */}
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="p-2 bg-indigo-50 rounded-lg mr-4">
                                    <Box className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Resource Type</p>
                                    <p className="font-semibold text-slate-700">{resource.type.replace(/_/g, ' ')}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="p-2 bg-orange-50 rounded-lg mr-4">
                                    <Building2 className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Department</p>
                                    <p className="font-semibold text-slate-700">{resource.department?.replace(/_/g, ' ') || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="p-2 bg-teal-50 rounded-lg mr-4">
                                    <Users className="w-5 h-5 text-teal-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Capacity</p>
                                    <p className="font-semibold text-slate-700">{resource.capacity} People</p>
                                </div>
                            </div>
                        </div>

                        {/* Availability Info */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <div className="flex items-center mb-4">
                                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                                <h3 className="font-bold text-slate-800">Operational Hours</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                                    <span className="text-slate-500 text-sm">Opens at:</span>
                                    <span className="font-bold text-slate-700 text-lg">{resource.availabilityStartTime}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2">
                                    <span className="text-slate-500 text-sm">Closes at:</span>
                                    <span className="font-bold text-slate-700 text-lg">{resource.availabilityEndTime}</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <p className="text-xs text-slate-400 italic font-medium">
                                        * Operating hours are subject to change during university holidays.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceDetails;
