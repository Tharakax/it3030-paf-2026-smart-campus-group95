import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Edit2, Trash2, Building2, Users, MapPin, CheckCircle2, XCircle, MoreVertical, Search } from 'lucide-react';
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

    const [searchTerm, setSearchTerm] = useState('');

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
        setSearchTerm('');
    };

    const filteredResources = resources.filter(res => 
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        res.resourceCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error) return (
        <div className="container mx-auto p-4 text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <button 
                onClick={fetchResources}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Facilities Management</h1>
                    <p className="text-sm text-slate-500 font-bold tracking-tighter uppercase">Administrative Control Panel</p>
                </div>
                
                <div className="flex items-center space-x-3">
                    {user?.role === 'ADMIN' && (
                        <button 
                            onClick={() => onAddResourceClick ? onAddResourceClick() : navigate('/resources/create')}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition flex items-center font-bold shadow-lg shadow-blue-500/20"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Resource
                        </button>
                    )}
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="grow relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                    />
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    <select 
                        name="type" 
                        value={filters.type} 
                        onChange={handleFilterChange}
                        className="p-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 outline-none focus:border-blue-500 transition-colors"
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

                    <select 
                        name="department" 
                        value={filters.department} 
                        onChange={handleFilterChange}
                        className="p-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 outline-none focus:border-blue-500 transition-colors"
                    >
                        <option value="">All Departments</option>
                        <option value="FACULTY_OF_COMPUTING">Computing</option>
                        <option value="FACULTY_OF_ENGINEERING">Engineering</option>
                        <option value="FACULTY_OF_BUSINESS">Business</option>
                        <option value="FACULTY_OF_HUMANITIES">Humanities</option>
                        <option value="FACULTY_OF_SCIENCE">Science</option>
                        <option value="COMMON_AREA">Common Area</option>
                    </select>

                    <select 
                        name="status" 
                        value={filters.status} 
                        onChange={handleFilterChange}
                        className="p-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 outline-none focus:border-blue-500 transition-colors"
                    >
                        <option value="">All Statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="OUT_OF_SERVICE">Out of Service</option>
                    </select>

                    <button 
                        onClick={clearFilters}
                        className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors px-3 py-2"
                    >
                        Reset
                    </button>
                </div>
            </div>
            
            {loading ? (
                <div className="py-20 text-center">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-slate-400 font-bold tracking-tighter">Updating catalogue...</p>
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="text-center bg-slate-50 border border-slate-100 p-12 rounded-3xl">
                    <p className="text-slate-400 font-black tracking-tighter uppercase mb-4">
                        {searchTerm || Object.values(filters).some(v => v !== '') 
                            ? "No matching facilities found" 
                            : "No resources registered in the system"}
                    </p>
                    <button onClick={clearFilters} className="text-sm font-bold text-blue-600 hover:underline">
                        Reset all filters
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Resource</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Department</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Capacity</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Bookable</th>
                                <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                            {filteredResources.map((resource) => (
                                <tr 
                                    key={resource.id} 
                                    className="hover:bg-blue-50/50 transition-colors group"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="shrink-0 h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-blue-500 transition-colors">
                                                <Building2 size={20} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-black text-slate-900 group-hover:text-blue-600">{resource.name}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{resource.resourceCode}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {resource.type.replace(/_/g, ' ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {resource.department?.replace(/_/g, ' ') || '—'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-slate-800">
                                        {resource.capacity || '0'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            resource.status === 'ACTIVE' 
                                                ? 'bg-emerald-100 text-emerald-700' 
                                                : 'bg-rose-100 text-rose-700'
                                        }`}>
                                            {resource.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {resource.bookable ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-slate-200 mx-auto" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEditResourceClick ? onEditResourceClick(resource.id) : navigate(`/resources/${resource.id}/edit`);
                                                }}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, resource.id, resource.name)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
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
