import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { 
    Building2, 
    Users, 
    MapPin, 
    CheckCircle2, 
    XCircle, 
    Search, 
    Filter, 
    SlidersHorizontal, 
    ChevronRight, 
    Compass,
    Sparkles,
    LayoutGrid
} from 'lucide-react';

/* ─── Google Fonts injection ─────────────────────────────────── */
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
    'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600&display=swap';
if (!document.head.querySelector('[href*="Sora"]')) document.head.appendChild(fontLink);

/* ─── Inline styles (CSS-in-JS) ──────────────────────────────── */
const css = `
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
  @keyframes pulse-ring { 0%{transform:scale(.9);opacity:.8} 70%{transform:scale(1.3);opacity:0} 100%{opacity:0} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(.95)} }
  @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,40px) scale(.9)} 66%{transform:translate(20px,-20px) scale(1.05)} }
  @keyframes orb3 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,30px) scale(1.08)} 66%{transform:translate(-40px,-10px) scale(.92)} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  .resource-root *{box-sizing:border-box;font-family:'Outfit',sans-serif}
  .resource-root h1,.resource-root h2,.resource-root h3{font-family:'Sora',sans-serif}
  .anim-0{animation:fadeSlideUp .7s ease both}
  .anim-1{animation:fadeSlideUp .7s .15s ease both}
  .anim-2{animation:fadeSlideUp .7s .3s ease both}
  .resource-card{transition:transform .35s cubic-bezier(.34,1.56,.64,1),box-shadow .35s ease,border-color .35s ease; border-radius: 20px !important}
  .resource-card:hover{transform:translateY(-8px) scale(1.015);box-shadow:0 32px 64px rgba(0,0,0,.45),0 0 0 1px rgba(99,179,237,.35)!important;border-color:rgba(99,179,237,.35)!important}
  .filter-select{background:rgba(15,23,42,.55); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,.08); color:#e2e8f0; border-radius:12px}
  .filter-select:focus{border-color:rgba(99,179,237,.4); background:rgba(30,41,59,.8)}
`;

const UserResourceCatalogue = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Shared glassmorphism token
    const glass = {
        background: 'rgba(15,23,42,.55)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,.08)',
        borderRadius: 20
    };

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
            'LECTURE_HALL': 'from-blue-500 to-blue-600',
            'LAB': 'from-purple-500 to-purple-600',
            'MEETING_ROOM': 'from-emerald-500 to-emerald-600',
            'AUDITORIUM': 'from-rose-500 to-rose-600',
            'STUDY_ROOM': 'from-amber-500 to-amber-600',
            'GROUND': 'from-teal-500 to-teal-600',
            'EQUIPMENT': 'from-slate-500 to-slate-600'
        };
        return types[type] || 'from-gray-500 to-gray-600';
    };

    if (error) return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#050b1a' }}>
            <div style={glass} className="max-w-md w-full p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                    <XCircle className="w-10 h-10 text-rose-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-2">Connection Error</h3>
                <p className="text-slate-400 mb-6">{error}</p>
                <button 
                    onClick={fetchResources} 
                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all duration-300"
                >
                    <Compass className="w-4 h-4" /> Retry Exploration
                </button>
            </div>
        </div>
    );

    // Skeleton Loader Component
    const SkeletonCard = () => (
        <div style={glass} className="overflow-hidden animate-pulse">
            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl"></div>
                    <div className="w-16 h-6 bg-white/5 rounded-full"></div>
                </div>
                <div className="h-7 bg-white/5 rounded-lg mb-3 w-3/4"></div>
                <div className="h-4 bg-white/5 rounded-full mb-6 w-1/2"></div>
                <div className="space-y-3 pt-6 border-t border-white/5">
                    <div className="h-4 bg-white/5 rounded-full w-full"></div>
                    <div className="h-4 bg-white/5 rounded-full w-2/3"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="resource-root" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg,#050b1a 0%,#0a1628 40%,#0d1f3c 70%,#071020 100%)',
            position: 'relative',
            overflowX: 'hidden'
        }}>
            <style>{css}</style>

            {/* ── Animated Orbs ─────────────────────────────────── */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{
                    position: 'absolute', top: '8%', left: '5%',
                    width: 520, height: 520,
                    background: 'radial-gradient(circle,rgba(59,130,246,.18) 0%,transparent 70%)',
                    borderRadius: '50%', animation: 'orb1 18s ease-in-out infinite'
                }} />
                <div style={{
                    position: 'absolute', top: '30%', right: '3%',
                    width: 420, height: 420,
                    background: 'radial-gradient(circle,rgba(99,102,241,.16) 0%,transparent 70%)',
                    borderRadius: '50%', animation: 'orb2 22s ease-in-out infinite'
                }} />
                <div style={{
                    position: 'absolute', bottom: '10%', left: '35%',
                    width: 360, height: 360,
                    background: 'radial-gradient(circle,rgba(6,182,212,.13) 0%,transparent 70%)',
                    borderRadius: '50%', animation: 'orb3 15s ease-in-out infinite'
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)',
                    backgroundSize: '60px 60px'
                }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '40px 24px 80px' }}>
                
                {/* ── Header Section ────────────────────────────────── */}
                <div className="anim-0" style={{ marginBottom: 52 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{
                            padding: '4px 14px', borderRadius: 999,
                            background: 'rgba(59,130,246,.12)',
                            border: '1px solid rgba(59,130,246,.3)',
                            display: 'flex', alignItems: 'center', gap: 6
                        }}>
                            <Sparkles size={13} style={{ color: '#63b3ed' }} />
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#63b3ed', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Campus Resources
                            </span>
                        </div>
                    </div>
                    <h1 style={{ fontSize: 'clamp(32px,4vw,52px)', fontWeight: 800, color: '#f0f6ff', lineHeight: 1.1, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                        Browse <span style={{
                            background: 'linear-gradient(90deg,#63b3ed,#a78bfa,#67e8f9)',
                            backgroundSize: '200% auto',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            animation: 'shimmer 4s linear infinite'
                        }}>Facilities</span>
                    </h1>
                    <p style={{ fontSize: 16, color: 'rgba(148,163,184,.8)', margin: 0, fontWeight: 400, maxWidth: 520 }}>
                        Find and book the perfect space for your academic needs, from study rooms to laboratories.
                    </p>

                    {/* Enhanced Search Bar */}
                    <div className="max-w-2xl mt-12 relative group anim-1">
                        <div style={glass} className="flex items-center gap-4 px-6 py-4 bg-slate-900/40 focus-within:border-blue-500/50 transition-all duration-300">
                            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search by name or code (e.g. L001, Computer Lab)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent outline-none text-slate-100 font-medium placeholder:text-slate-500"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Filter Bar ───────────────────────────────────── */}
                <div className="anim-1 mb-10 sticky top-4 z-20">
                    <div style={glass} className="p-3 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filters</span>
                        </div>

                        <select 
                            name="type" 
                            value={filters.type} 
                            onChange={handleFilterChange} 
                            className="filter-select flex-1 min-w-[150px] px-4 py-2.5 text-sm font-semibold outline-none transition-all cursor-pointer"
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
                            className="filter-select flex-1 min-w-[150px] px-4 py-2.5 text-sm font-semibold outline-none transition-all cursor-pointer"
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
                            className="filter-select flex-1 min-w-[150px] px-4 py-2.5 text-sm font-semibold outline-none transition-all cursor-pointer"
                        >
                            <option value="">Any Status</option>
                            <option value="true">✅ Bookable</option>
                            <option value="false">🔍 View Only</option>
                        </select>

                        <button 
                            onClick={clearFilters} 
                            className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:text-white transition-all duration-300"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Results Counter */}
                {!loading && filteredResources.length > 0 && (
                    <div className="mb-6 anim-2">
                        <div style={glass} className="inline-flex items-center px-4 py-2 border border-white/5">
                            <span className="text-sm font-semibold text-slate-400">
                                Found <span className="text-blue-400 font-bold">{filteredResources.length}</span> facilities
                            </span>
                        </div>
                    </div>
                )}
                
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : filteredResources.length === 0 ? (
                    <div style={glass} className="text-center p-16 anim-2">
                        <div className="bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                            <Search className="w-10 h-10 text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-200 mb-2">No facilities found</h3>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto">Try adjusting your search or filters to discover available campus resources.</p>
                        <button onClick={clearFilters} className="mt-6 text-blue-400 font-bold text-sm hover:text-blue-300 transition-colors">
                            Clear all filters →
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 anim-2">
                        {filteredResources.map((resource, index) => (
                            <div 
                                key={resource.id} 
                                onClick={() => navigate(`/resources/${resource.id}`)}
                                style={glass}
                                className="resource-card group relative p-6 cursor-pointer overflow-hidden border-white/5"
                            >
                                <div className="flex justify-between items-start mb-5">
                                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${getTypeColor(resource.type)} shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300`}>
                                        <Building2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider text-slate-400 bg-white/5 border border-white/10">
                                        {resource.resourceCode}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-100 tracking-tight group-hover:text-blue-400 transition-colors duration-300 mb-2 line-clamp-1">
                                    {resource.name}
                                </h3>
                                
                                <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-500/10 text-[10px] font-bold text-blue-400 mb-4 border border-blue-500/20">
                                    {resource.type.replace(/_/g, ' ')}
                                </div>

                                <div className="space-y-3 pt-4 border-t border-white/5">
                                    <div className="flex items-center text-slate-400 font-medium text-sm">
                                        <MapPin className="w-4 h-4 mr-3 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
                                        <span className="truncate">{resource.department?.replace(/_/g, ' ') || 'General Campus'}</span>
                                    </div>
                                    <div className="flex items-center text-slate-400 font-medium text-sm">
                                        <Users className="w-4 h-4 mr-3 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
                                        <span>Capacity: <strong className="text-slate-200 ml-1">{resource.capacity || 'N/A'}</strong></span>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-between items-center bg-white/5 -mx-6 -mb-6 px-6 py-4 border-t border-white/5 group-hover:bg-blue-500/5 transition-colors">
                                    {resource.bookable ? (
                                        <span className="flex items-center text-[10px] font-black text-emerald-400 uppercase tracking-wider gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Bookable
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-wider gap-1.5">
                                            <XCircle className="w-3.5 h-3.5" /> View Only
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1 text-blue-400 font-black text-[10px] uppercase tracking-wider group-hover:gap-2 transition-all duration-300">
                                        Details <ChevronRight className="w-3 h-3" />
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
