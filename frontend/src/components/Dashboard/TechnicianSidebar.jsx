import {
    LayoutDashboard,
    ListTodo,
    History,
    Wrench,
    User,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Circle
} from 'lucide-react';
import Swal from 'sweetalert2';

const TechnicianSidebar = ({ activeTab, setActiveTab, user, handleLogout, isCollapsed, setIsCollapsed }) => {
    const mainNav = [
        { id: 'tasks', label: 'Tasks', icon: ListTodo },
        { id: 'history', label: 'Work History', icon: History },
    ];

    const secondaryNav = [
        { id: 'profile', label: 'My Profile', icon: User },
    ];

    const confirmLogout = () => {
        Swal.fire({
            title: 'Logout?',
            text: "Are you sure you want to end your session?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#cbd5e1',
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel',
            background: '#ffffff',
            customClass: {
                popup: 'rounded-[1.5rem] border-none shadow-2xl',
                title: 'text-slate-800 font-bold',
                htmlContainer: 'text-slate-600 font-medium',
                confirmButton: 'rounded-xl font-bold px-6 py-3',
                cancelButton: 'rounded-xl font-bold px-6 py-3 text-slate-500'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                handleLogout();
            }
        });
    };

    return (
        <aside
            className={`fixed left-0 top-0 bottom-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'
                } hidden md:block`}
        >
            <div className="flex flex-col h-full py-4">
                {/* Branding Section */}
                <div className={`px-6 mb-8 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
                        <Wrench className="text-white w-6 h-6" />
                    </div>
                    {!isCollapsed && (
                        <span className="text-xl font-black text-slate-800 tracking-tighter">
                            UniSync <span className="text-blue-600">Tech</span>
                        </span>
                    )}
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-4 bg-white border border-slate-200 rounded-full p-1 text-slate-400 hover:text-blue-600 shadow-sm z-50"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Tech Status Summary */}
                {!isCollapsed && (
                    <div className="px-6 mb-8">
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <div className="flex items-start space-x-3">
                                {user?.picture ? (
                                    <img 
                                        src={user.picture} 
                                        className="w-11 h-11 rounded-xl shadow-md object-cover border-2 border-white" 
                                        alt="Profile"
                                    />
                                ) : (
                                    <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 border-2 border-white shrink-0">
                                        {user?.name?.charAt(0) || 'T'}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <p className="text-sm font-bold text-slate-800 truncate leading-tight tracking-tight">{user?.name || 'Technician'}</p>
                                    <p className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest mt-0.5 leading-none">{user?.role}</p>
                                    <div className="flex items-center mt-1.5">
                                        <div className="relative flex h-2 w-2 mr-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                                        </div>
                                        <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest leading-none">Status: Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Items */}
                <div className="flex-1 px-3 space-y-8 overflow-y-auto custom-scrollbar">
                    {/* Main Nav */}
                    <nav className="space-y-1">
                        {!isCollapsed && <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Main Menu</p>}
                        {mainNav.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center group relative transition-all duration-200 ${isCollapsed ? 'justify-center py-4' : 'px-4 py-3 rounded-xl'
                                        } ${isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                                        }`}
                                >
                                    <Icon size={isCollapsed ? 24 : 18} className={!isCollapsed ? 'mr-3' : ''} />
                                    {!isCollapsed && <span className="text-sm font-bold">{item.label}</span>}

                                    {isCollapsed && (
                                        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                            {item.label}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Secondary Nav */}
                    <nav className="space-y-1">
                        {!isCollapsed && <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Account</p>}
                        {secondaryNav.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center group relative transition-all duration-200 ${isCollapsed ? 'justify-center py-4' : 'px-4 py-3 rounded-xl'
                                        } ${isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                                        }`}
                                >
                                    <Icon size={isCollapsed ? 24 : 18} className={!isCollapsed ? 'mr-3' : ''} />
                                    {!isCollapsed && <span className="text-sm font-bold">{item.label}</span>}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout Section */}
                <div className="px-3 mt-auto pt-6 border-t border-slate-50">
                    <button
                        onClick={confirmLogout}
                        className={`w-full flex items-center group relative text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all ${isCollapsed ? 'justify-center py-4' : 'px-4 py-3 rounded-xl'
                            }`}
                    >
                        <LogOut size={isCollapsed ? 24 : 18} className={!isCollapsed ? 'mr-3' : ''} />
                        {!isCollapsed && <span className="text-sm font-bold">Logout</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default TechnicianSidebar;
