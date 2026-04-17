import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { 
    PlusCircle, Edit2, Trash2, Building2, Users, MapPin, 
    CheckCircle2, XCircle, Search, Filter, ChevronDown, X,
    Activity, AlertCircle, Clock, Calendar, Tag 
} from 'lucide-react';
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

    // Stats for the modern summary bar (UI only, no logic change)
    const stats = useMemo(() => ({
        total: resources.length,
        active: resources.filter(r => r.status === 'ACTIVE').length,
        outOfService: resources.filter(r => r.status === 'OUT_OF_SERVICE').length,
        bookable: resources.filter(r => r.bookable).length,
    }), [resources]);

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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                        Facilities Management
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Administrative control panel for campus resources
                    </p>
                </div>
            </div>

            {/* Modern Stats Hub (inspired by AdminTickets) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-3xl border border-slate-100 bg-white shadow-sm flex items-center space-x-4">
                    <div className="p-2.5 rounded-2xl bg-indigo-50">
                        <Building2 className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Total Resources</p>
                        <p className="text-xl font-black text-slate-800">{stats.total}</p>
                    </div>
                </div>
                <div className="p-4 rounded-3xl border border-slate-100 bg-white shadow-sm flex items-center space-x-4">
                    <div className="p-2.5 rounded-2xl bg-emerald-50">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Active</p>
                        <p className="text-xl font-black text-slate-800">{stats.active}</p>
                    </div>
                </div>
                <div className="p-4 rounded-3xl border border-slate-100 bg-white shadow-sm flex items-center space-x-4">
                    <div className="p-2.5 rounded-2xl bg-rose-50">
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Out of Service</p>
                        <p className="text-xl font-black text-slate-800">{stats.outOfService}</p>
                    </div>
                </div>
                <div className="p-4 rounded-3xl border border-slate-100 bg-white shadow-sm flex items-center space-x-4">
                    <div className="p-2.5 rounded-2xl bg-blue-50">
                        <Calendar className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Bookable</p>
                        <p className="text-xl font-black text-slate-800">{stats.bookable}</p>
                    </div>
                </div>
            </div>

            {/* Advanced Command Bar (matching AdminTickets) */}
            <div className="bg-white p-3 rounded-2xl border border-slate-100 mb-6 shadow-sm flex flex-col xl:flex-row gap-4 items-center">
                {/* Global Search */}
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or resource code..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 rounded-lg text-sm font-bold text-slate-700 placeholder:text-slate-300 transition-all outline-none"
                    />
                </div>

                <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                    {/* Type Filter */}
                    <div className="relative flex-1 md:flex-none md:w-40">
                        <select
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                            className="appearance-none w-full px-4 py-2 bg-slate-50 border-none rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 cursor-pointer focus:ring-2 focus:ring-indigo-50 transition-all pr-10"
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
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Department Filter */}
                    <div className="relative flex-1 md:flex-none md:w-48">
                        <select
                            name="department"
                            value={filters.department}
                            onChange={handleFilterChange}
                            className="appearance-none w-full px-4 py-2 bg-slate-50 border-none rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 cursor-pointer focus:ring-2 focus:ring-indigo-50 transition-all pr-10"
                        >
                            <option value="">All Departments</option>
                            <option value="FACULTY_OF_COMPUTING">Computing</option>
                            <option value="FACULTY_OF_ENGINEERING">Engineering</option>
                            <option value="FACULTY_OF_BUSINESS">Business</option>
                            <option value="FACULTY_OF_HUMANITIES">Humanities</option>
                            <option value="FACULTY_OF_SCIENCE">Science</option>
                            <option value="COMMON_AREA">Common Area</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Status Filter */}
                    <div className="relative flex-1 md:flex-none md:w-40">
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="appearance-none w-full px-4 py-2 bg-slate-50 border-none rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 cursor-pointer focus:ring-2 focus:ring-indigo-50 transition-all pr-10"
                        >
                            <option value="">All Statuses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="OUT_OF_SERVICE">Out of Service</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Bookable Filter */}
                    <div className="relative flex-1 md:flex-none md:w-36">
                        <select
                            name="bookable"
                            value={filters.bookable}
                            onChange={handleFilterChange}
                            className="appearance-none w-full px-4 py-2 bg-slate-50 border-none rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 cursor-pointer focus:ring-2 focus:ring-indigo-50 transition-all pr-10"
                        >
                            <option value="">All Bookable</option>
                            <option value="true">Bookable Only</option>
                            <option value="false">Non-Bookable</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={clearFilters}
                        disabled={!searchTerm && filters.type === '' && filters.department === '' && filters.status === '' && filters.bookable === ''}
                        className="md:flex-none flex items-center justify-center px-6 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group border border-rose-100"
                        title="Clear all filters"
                    >
                        <X className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Reset</span>
                    </button>
                </div>
            </div>

            {/* Add Resource Button (moved to right of command bar for better UX) */}
            {user?.role === 'ADMIN' && (
                <div className="flex justify-end mb-4">
                    <button 
                        onClick={() => onAddResourceClick ? onAddResourceClick() : navigate('/resources/create')}
                        className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition flex items-center font-bold shadow-lg shadow-indigo-200 text-sm"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Resource
                    </button>
                </div>
            )}

            {/* Resources Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-6"></div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading resources...</p>
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm animate-in zoom-in-95 duration-500">
                    <p className="text-slate-800 font-black text-xl tracking-tight uppercase">No resources found</p>
                    <p className="text-slate-400 text-sm mt-2 max-w-xs text-center leading-relaxed">
                        {searchTerm || Object.values(filters).some(v => v !== '') 
                            ? "Adjust your filters or search criteria" 
                            : "Click 'Add Resource' to create one"}
                    </p>
                    <button
                        onClick={clearFilters}
                        className="mt-8 text-indigo-600 font-black uppercase text-[10px] tracking-widest hover:text-indigo-700 underline underline-offset-8"
                    >
                        Reset All Filters
                    </button>
                </div>
            ) : (
                <div className="overflow-hidden bg-white rounded-[2rem] border border-slate-100 shadow-sm animate-in fade-in duration-700">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Resource</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden lg:table-cell">Department</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Capacity</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Bookable</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredResources.map((resource, index) => (
                                <tr
                                    key={resource.id}
                                    className={`
                                        transition-all duration-200 group
                                        ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}
                                        hover:bg-indigo-50/50
                                    `}
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center">
                                            <div className="ml-0">
                                                <div className="text-sm font-black text-slate-900 group-hover:text-indigo-600">{resource.name}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{resource.resourceCode}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                                        {resource.type.replace(/_/g, ' ')}
                                    </td>
                                    <td className="px-6 py-5 hidden lg:table-cell text-sm font-semibold text-slate-700">
                                        {resource.department?.replace(/_/g, ' ') || '—'}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="text-sm font-black text-slate-800">{resource.capacity || '0'}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1.5 rounded-xl text-sm font-bold uppercase tracking-tighter inline-flex items-center ${
                                            resource.status === 'ACTIVE' 
                                                ? 'bg-emerald-50 text-emerald-600' 
                                                : 'bg-rose-50 text-rose-600'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                resource.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'
                                            }`} />
                                            {resource.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        {resource.bookable ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEditResourceClick ? onEditResourceClick(resource.id) : navigate(`/resources/${resource.id}/edit`);
                                                }}
                                                className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-100/50 hover:border-indigo-200/50 shadow-sm hover:shadow-indigo-100/50 bg-white"
                                                title="Edit Resource"
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, resource.id, resource.name)}
                                                className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-slate-100/50 hover:border-rose-200/50 shadow-sm hover:shadow-rose-100/50 bg-white"
                                                title="Delete Resource"
                                            >
                                                <Trash2 size={15} />
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