import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ResourceCatalogue = ({ onAddResourceClick, onEditResourceClick, onRowClick }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
        type: '',
        department: '',
        status: '',
        bookable: ''
    });

    const fetchResources = async () => {
        setLoading(true);
        try {
            // Construct query parameters
            const params = new URLSearchParams();
            if (filters.type) params.append('type', filters.type);
            if (filters.department) params.append('department', filters.department);
            if (filters.status) params.append('status', filters.status);
            if (filters.bookable !== '') {
                params.append('bookable', filters.bookable === 'true');
            }

            const response = await axiosInstance.get(`/resources?${params.toString()}`);
            setResources(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching resources:', err);
            setError('Failed to load resources. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [filters]);

    const handleDelete = async (e, id, name) => {
        e.stopPropagation();
        const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
        if (!confirmDelete) return;

        try {
            await axiosInstance.delete(`/resources/${id}`);
            toast.success('Resource deleted successfully');
            fetchResources();
        } catch (err) {
            console.error('Error deleting resource:', err);
            toast.error(err.response?.data?.message || 'Failed to delete resource');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            type: '',
            department: '',
            status: '',
            bookable: ''
        });
    };

    if (error) return (
        <div className="container mx-auto p-4 text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <button 
                onClick={fetchResources}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Facilities & Assets Catalogue</h1>
                    <p className="text-sm text-gray-500">View and manage campus resources and equipment.</p>
                </div>
                
                <div className="flex items-center space-x-3">
                    {user?.role === 'ADMIN' && (
                        <button 
                            onClick={() => onAddResourceClick ? onAddResourceClick() : navigate('/resources/create')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center font-semibold shadow-md shadow-blue-500/20"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Resource
                        </button>
                    )}
                    <button 
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium px-2 py-1 hover:bg-blue-50 rounded"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Type</label>
                    <select 
                        name="type" 
                        value={filters.type} 
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition"
                    >
                        <option value="">All Types</option>
                        <option value="LECTURE_HALL">Lecture Hall</option>
                        <option value="LAB">Lab</option>
                        <option value="MEETING_ROOM">Meeting Room</option>
                        <option value="AUDITORIUM">Auditorium</option>
                        <option value="STUDY_ROOM">Study Room</option>
                        <option value="GROUND">Ground</option>
                        <option value="EQUIPMENT">Equipment</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Department</label>
                    <select 
                        name="department" 
                        value={filters.department} 
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition"
                    >
                        <option value="">All Departments</option>
                        <option value="FACULTY_OF_COMPUTING">Computing</option>
                        <option value="FACULTY_OF_ENGINEERING">Engineering</option>
                        <option value="FACULTY_OF_BUSINESS">Business</option>
                        <option value="FACULTY_OF_HUMANITIES">Humanities</option>
                        <option value="FACULTY_OF_SCIENCE">Science</option>
                        <option value="COMMON_AREA">Common Area</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
                    <select 
                        name="status" 
                        value={filters.status} 
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition"
                    >
                        <option value="">All Statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="OUT_OF_SERVICE">Out of Service</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Bookable</label>
                    <select 
                        name="bookable" 
                        value={filters.bookable} 
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition"
                    >
                        <option value="">All</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
            </div>
            
            {loading ? (
                <div className="py-20 text-center">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-gray-500">Updating catalogue...</p>
                </div>
            ) : resources.length === 0 ? (
                <div className="text-center bg-gray-100 p-8 rounded shadow-inner">
                    <p className="text-gray-600">
                        {Object.values(filters).some(v => v !== '') 
                            ? "No resources match the selected filters." 
                            : "No resources available in the catalogue at the moment."}
                    </p>
                    {Object.values(filters).some(v => v !== '') && (
                        <button 
                            onClick={clearFilters}
                            className="mt-4 text-sm text-blue-600 hover:underline"
                        >
                            Reset filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Resource Code</th>
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Type</th>
                                <th className="py-3 px-6 text-left">Department</th>
                                <th className="py-3 px-6 text-left">Capacity</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                <th className="py-3 px-6 text-left">Bookable</th>
                                {user?.role === 'ADMIN' && <th className="py-3 px-6 text-center">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {resources.map((resource) => (
                                <tr 
                                    key={resource.id} 
                                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => onRowClick ? onRowClick(resource.id) : navigate(`/resources/${resource.id}`)}
                                >
                                    <td className="py-3 px-6 text-left whitespace-nowrap">{resource.resourceCode}</td>
                                    <td className="py-3 px-6 text-left font-medium text-blue-600 hover:underline">{resource.name}</td>
                                    <td className="py-3 px-6 text-left">{resource.type.replace(/_/g, ' ')}</td>
                                    <td className="py-3 px-6 text-left">{resource.department || 'N/A'}</td>
                                    <td className="py-3 px-6 text-left">{resource.capacity}</td>
                                    <td className="py-3 px-6 text-left">
                                        <span className={`py-1 px-3 rounded-full text-xs ${resource.status === 'ACTIVE' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                            {resource.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 text-left">
                                        {resource.bookable ? '✅ Yes' : '❌ No'}
                                    </td>
                                    {user?.role === 'ADMIN' && (
                                        <td className="py-3 px-6 text-center">
                                            <div className="flex item-center justify-center space-x-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onEditResourceClick) {
                                                            onEditResourceClick(resource.id);
                                                        } else {
                                                            navigate(`/resources/${resource.id}/edit`);
                                                        }
                                                    }}
                                                    className="w-4 mr-2 transform hover:text-blue-500 hover:scale-110 transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(e, resource.id, resource.name)}
                                                    className="w-4 mr-2 transform hover:text-red-500 hover:scale-110 transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ResourceCatalogue;
