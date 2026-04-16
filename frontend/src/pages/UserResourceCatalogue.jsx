import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { Building2, Users, MapPin, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';

const UserResourceCatalogue = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
        type: '',
        department: '',
        bookable: ''
    });

    const [searchTerm, setSearchTerm] = useState('');

    const fetchResources = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.type) params.append('type', filters.type);
            if (filters.department) params.append('department', filters.department);
            if (filters.bookable !== '') params.append('bookable', filters.bookable === 'true');
            params.append('status', 'ACTIVE'); // Users usually only see active resources

            const response = await axiosInstance.get(`/resources?${params.toString()}`);
            setResources(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching resources:', err);
            setError('Failed to load campus facilities. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({ type: '', department: '', bookable: '' });
        setSearchTerm('');
    };

    const filteredResources = resources.filter(res => 
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        res.resourceCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error) return (
        <div className="container mx-auto p-8 text-center bg-white rounded-2xl shadow-sm border mt-10">
            <div className="text-rose-500 mb-4 font-medium">{error}</div>
            <button onClick={fetchResources} className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-200">
                Retry
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200 pt-10 pb-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4 text-center">Campus Facilities</h1>
                    <p className="text-slate-500 text-center max-w-2xl mx-auto font-medium mb-10 text-lg leading-relaxed">
                        Explore lecture halls, laboratories, study areas, and equipment available across campus for your academic needs.
                    </p>
                    
                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            type="text"
                            placeholder="Search by name or code (e.g. L001)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8">
                {/* Filter Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-wrap items-center gap-4 mb-10">
                    <div className="flex items-center text-slate-400 mr-2 border-r pr-4 border-slate-100">
                        <Filter className="w-4 h-4 mr-2" />
                        <span className="text-xs font-black uppercase tracking-widest">Filters</span>
                    </div>

                    <select name="type" value={filters.type} onChange={handleFilterChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 outline-none hover:border-blue-500 transition-colors cursor-pointer">
                        <option value="">All Types</option>
                        <option value="LECTURE_HALL">Lecture Halls</option>
                        <option value="LAB">Laboratories</option>
                        <option value="MEETING_ROOM">Meeting Rooms</option>
                        <option value="AUDITORIUM">Auditoriums</option>
                        <option value="STUDY_ROOM">Study Rooms</option>
                        <option value="GROUND">Grounds</option>
                        <option value="EQUIPMENT">Equipment</option>
                    </select>

                    <select name="department" value={filters.department} onChange={handleFilterChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 outline-none hover:border-blue-500 transition-colors cursor-pointer">
                        <option value="">All Departments</option>
                        <option value="FACULTY_OF_COMPUTING">Computing</option>
                        <option value="FACULTY_OF_ENGINEERING">Engineering</option>
                        <option value="FACULTY_OF_BUSINESS">Business</option>
                        <option value="FACULTY_OF_HUMANITIES">Humanities</option>
                        <option value="FACULTY_OF_SCIENCE">Science</option>
                        <option value="COMMON_AREA">Common Area</option>
                    </select>

                    <select name="bookable" value={filters.bookable} onChange={handleFilterChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 outline-none hover:border-blue-500 transition-colors cursor-pointer">
                        <option value="">Any Status</option>
                        <option value="true">Bookable</option>
                        <option value="false">Fixed/View Only</option>
                    </select>

                    <button onClick={clearFilters} className="ml-auto text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors px-4">
                        Reset All
                    </button>
                </div>
                
                {loading ? (
                    <div className="py-20 text-center">
                        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                        <p className="text-slate-400 font-bold italic tracking-tighter">Scanning campus...</p>
                    </div>
                ) : filteredResources.length === 0 ? (
                    <div className="text-center bg-white border border-slate-100 p-16 rounded-3xl shadow-sm">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No facilities found</h3>
                        <p className="text-slate-400 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredResources.map((resource) => (
                            <div 
                                key={resource.id} 
                                onClick={() => navigate(`/resources/${resource.id}`)}
                                className="group bg-white rounded-4xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col"
                            >
                                <div className="p-6 grow">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-500 transition-colors duration-500">
                                            <Building2 className="w-7 h-7" />
                                        </div>
                                        <div className="bg-slate-50 px-3 py-1 rounded text-[10px] font-black tracking-widest text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-500">
                                            {resource.resourceCode}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors duration-300 mb-2 leading-tight">
                                        {resource.name}
                                    </h3>
                                    
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">
                                        {resource.type.replace(/_/g, ' ')}
                                    </p>

                                    <div className="space-y-3 pt-6 border-t border-slate-50">
                                        <div className="flex items-center text-slate-500 font-semibold text-sm">
                                            <MapPin className="w-4 h-4 mr-3 text-slate-300 group-hover:text-blue-400 transition-colors" />
                                            <span className="truncate">{resource.department?.replace(/_/g, ' ') || 'General Campus'}</span>
                                        </div>
                                        <div className="flex items-center text-slate-500 font-semibold text-sm">
                                            <Users className="w-4 h-4 mr-3 text-slate-300 group-hover:text-blue-400 transition-colors" />
                                            <span>Capacity: <strong className="text-slate-800 ml-1">{resource.capacity || 'N/A'}</strong></span>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-5 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center group-hover:bg-blue-50/30 transition-colors duration-500">
                                    {resource.bookable ? (
                                        <span className="flex items-center text-xs font-black text-emerald-600 uppercase tracking-widest">
                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Bookable
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest">
                                            <XCircle className="w-4 h-4 mr-2" /> View Only
                                        </span>
                                    )}
                                    <span className="text-blue-600 font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                        Details →
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserResourceCatalogue;
