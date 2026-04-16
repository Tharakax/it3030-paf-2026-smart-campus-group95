import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { Building2, Users, MapPin, CheckCircle2, XCircle, Search, Filter, SlidersHorizontal, ChevronRight, Compass } from 'lucide-react';

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

    // Helper function for type-based color coding (pure UI)
    const getTypeColor = (type) => {
        const types = {
            'LECTURE_HALL': 'from-blue-500/20 to-blue-600/10 text-blue-700 border-blue-200/50',
            'LAB': 'from-purple-500/20 to-purple-600/10 text-purple-700 border-purple-200/50',
            'MEETING_ROOM': 'from-emerald-500/20 to-emerald-600/10 text-emerald-700 border-emerald-200/50',
            'AUDITORIUM': 'from-rose-500/20 to-rose-600/10 text-rose-700 border-rose-200/50',
            'STUDY_ROOM': 'from-amber-500/20 to-amber-600/10 text-amber-700 border-amber-200/50',
            'GROUND': 'from-teal-500/20 to-teal-600/10 text-teal-700 border-teal-200/50',
            'EQUIPMENT': 'from-slate-500/20 to-slate-600/10 text-slate-700 border-slate-200/50'
        };
        return types[type] || 'from-gray-500/20 to-gray-600/10 text-gray-700 border-gray-200/50';
    };

    if (error) return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-50 flex items-center justify-center">
                    <XCircle className="w-10 h-10 text-rose-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Connection Error</h3>
                <p className="text-slate-500 mb-6">{error}</p>
                <button 
                    onClick={fetchResources} 
                    className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                    <Compass className="w-4 h-4" /> Retry Exploration
                </button>
            </div>
        </div>
    );

    // Skeleton Loader Component
    const SkeletonCard = () => (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 shadow-sm overflow-hidden animate-pulse">
            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl"></div>
                    <div className="w-16 h-6 bg-slate-100 rounded-full"></div>
                </div>
                <div className="h-7 bg-slate-100 rounded-lg mb-3 w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded-full mb-6 w-1/2"></div>
                <div className="space-y-3 pt-6 border-t border-slate-100">
                    <div className="h-4 bg-slate-100 rounded-full w-full"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-2/3"></div>
                </div>
            </div>
            <div className="px-6 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-between">
                <div className="h-4 bg-slate-100 rounded-full w-20"></div>
                <div className="h-4 bg-slate-100 rounded-full w-16"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30">
            {/* Modern Hero Section with Glassmorphism */}
            <div className="relative overflow-hidden bg-white/40 backdrop-blur-sm border-b border-white/50 shadow-sm">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                
                <div className="container mx-auto px-4 pt-12 pb-16 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">

                        <h1 className="text-4xl md:text-5xl font-black bg-linear-to-r from-slate-800 via-slate-800 to-blue-800 bg-clip-text text-transparent tracking-tight mb-1">
                            Campus Facilities
                        </h1>

                    </div>

                    {/* Enhanced Search Bar */}
                    <div className="max-w-2xl mx-auto mt-10 relative group">
                        <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg shadow-slate-200/50 group-hover:shadow-xl transition-all duration-300">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search by name or code (e.g. L001, Computer Lab)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-transparent rounded-2xl focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Floating Filter Bar - Modern & Interactive */}
                <div className="sticky top-4 z-20 mb-10">
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/60 p-3 flex flex-wrap items-center gap-3 transition-all duration-300">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50/80 rounded-xl">
                            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filters</span>
                        </div>

                        <select 
                            name="type" 
                            value={filters.type} 
                            onChange={handleFilterChange} 
                            className="flex-1 min-w-35 bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all cursor-pointer hover:bg-white"
                        >
                            <option value="">All Types</option>
                            <option value="LECTURE_HALL">📚 Lecture Halls</option>
                            <option value="LAB">🔬 Laboratories</option>
                            <option value="MEETING_ROOM">🤝 Meeting Rooms</option>
                            <option value="AUDITORIUM">🎭 Auditoriums</option>
                            <option value="STUDY_ROOM">📖 Study Rooms</option>
                            <option value="GROUND">⚽ Grounds</option>
                            <option value="EQUIPMENT">💻 Equipment</option>
                        </select>

                        <select 
                            name="department" 
                            value={filters.department} 
                            onChange={handleFilterChange} 
                            className="flex-1 min-w-35 bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all cursor-pointer hover:bg-white"
                        >
                            <option value="">All Departments</option>
                            <option value="FACULTY_OF_COMPUTING">💻 Computing</option>
                            <option value="FACULTY_OF_ENGINEERING">⚙️ Engineering</option>
                            <option value="FACULTY_OF_BUSINESS">📊 Business</option>
                            <option value="FACULTY_OF_HUMANITIES">🎨 Humanities</option>
                            <option value="FACULTY_OF_SCIENCE">🔬 Science</option>
                            <option value="COMMON_AREA">🏛️ Common Area</option>
                        </select>

                        <select 
                            name="bookable" 
                            value={filters.bookable} 
                            onChange={handleFilterChange} 
                            className="flex-1 min-w-32.5 bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all cursor-pointer hover:bg-white"
                        >
                            <option value="">Any Status</option>
                            <option value="true">✅ Bookable</option>
                            <option value="false">🔍 View Only</option>
                        </select>

                        <button 
                            onClick={clearFilters} 
                            className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-rose-500 bg-slate-50/80 hover:bg-rose-50 rounded-xl transition-all duration-300"
                        >
                            Reset All
                        </button>
                    </div>
                </div>

                {/* Results Counter */}
                {!loading && filteredResources.length > 0 && (
                    <div className="mb-6 flex justify-between items-center">
                        <div className="text-sm font-semibold text-slate-500 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50">
                            Found <span className="text-blue-600 text-lg font-black">{filteredResources.length}</span> facilities
                        </div>
                    </div>
                )}
                
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : filteredResources.length === 0 ? (
                    <div className="text-center bg-white/60 backdrop-blur-sm border border-white/50 p-16 rounded-3xl shadow-sm">
                        <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                            <Search className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-700 mb-2">No facilities found</h3>
                        <p className="text-slate-400 font-medium max-w-sm mx-auto">Try adjusting your search or filters to discover available campus resources.</p>
                        <button onClick={clearFilters} className="mt-6 text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors">
                            Clear all filters →
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredResources.map((resource, index) => (
                            <div 
                                key={resource.id} 
                                onClick={() => navigate(`/resources/${resource.id}`)}
                                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
                                style={{ animationDelay: `${index * 50}ms`, animation: 'fadeInUp 0.5s ease-out forwards' }}
                            >
                                {/* Animated gradient border on hover */}
                                <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:via-blue-500/5 group-hover:to-purple-500/10 transition-all duration-700 rounded-3xl pointer-events-none"></div>
                                
                                <div className="p-6 relative z-10">
                                    <div className="flex justify-between items-start mb-5">
                                        <div className={`p-3 rounded-2xl bg-linear-to-br ${getTypeColor(resource.type)} shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}>
                                            <Building2 className="w-6 h-6" />
                                        </div>
                                        <div className="bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-[11px] font-black tracking-wider text-slate-500 border border-white/50 shadow-sm group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                            {resource.resourceCode}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors duration-300 mb-2 line-clamp-1">
                                        {resource.name}
                                    </h3>
                                    
                                    <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100/80 text-xs font-bold text-slate-600 mb-4">
                                        {resource.type.replace(/_/g, ' ')}
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-slate-100/80">
                                        <div className="flex items-center text-slate-600 font-medium text-sm">
                                            <MapPin className="w-4 h-4 mr-3 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
                                            <span className="truncate">{resource.department?.replace(/_/g, ' ') || 'General Campus'}</span>
                                        </div>
                                        <div className="flex items-center text-slate-600 font-medium text-sm">
                                            <Users className="w-4 h-4 mr-3 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
                                            <span>Capacity: <strong className="text-slate-800 ml-1">{resource.capacity || 'N/A'}</strong></span>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100/80 flex justify-between items-center group-hover:bg-linear-to-r group-hover:from-blue-50/50 group-hover:to-transparent transition-all duration-500">
                                    {resource.bookable ? (
                                        <span className="flex items-center text-xs font-black text-emerald-600 uppercase tracking-wider gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Available for Booking
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-xs font-black text-slate-400 uppercase tracking-wider gap-1.5">
                                            <XCircle className="w-3.5 h-3.5" /> Reference Only
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1 text-blue-600 font-black text-xs uppercase tracking-wider group-hover:gap-2 transition-all duration-300">
                                        Details <ChevronRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add custom keyframe animation */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default UserResourceCatalogue;