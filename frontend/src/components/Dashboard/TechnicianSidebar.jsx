import React from 'react';
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

const TechnicianSidebar = ({ activeTab, setActiveTab, user, handleLogout, isCollapsed, setIsCollapsed }) => {
    const mainNav = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'tasks', label: 'Maintenance Tasks', icon: ListTodo },
        { id: 'history', label: 'Work History', icon: History },
        { id: 'tools', label: 'Equipment & Tools', icon: Wrench },
    ];

    const secondaryNav = [
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside 
            className={`fixed left-0 top-0 bottom-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out ${
                isCollapsed ? 'w-20' : 'w-64'
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
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
                                    {user?.name?.charAt(0) || 'T'}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'Technician'}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight flex items-center">
                                        <Circle size={8} className="fill-emerald-500 text-emerald-500 mr-1" /> Online
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span className="text-slate-400">DAILY GOAL</span>
                                    <span className="text-blue-600">80%</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-blue-600 h-full w-[80%] rounded-full shadow-[0_0_8px_rgba(37,99,235,0.3)]" />
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
                                    className={`w-full flex items-center group relative transition-all duration-200 ${
                                        isCollapsed ? 'justify-center py-4' : 'px-4 py-3 rounded-xl'
                                    } ${
                                        isActive 
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
                                    className={`w-full flex items-center group relative transition-all duration-200 ${
                                        isCollapsed ? 'justify-center py-4' : 'px-4 py-3 rounded-xl'
                                    } ${
                                        isActive 
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
                        onClick={handleLogout}
                        className={`w-full flex items-center group relative text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all ${
                            isCollapsed ? 'justify-center py-4' : 'px-4 py-3 rounded-xl'
                        }`}
                    >
                        <LogOut size={isCollapsed ? 24 : 18} className={!isCollapsed ? 'mr-3' : ''} />
                        {!isCollapsed && <span className="text-sm font-bold">Logout Session</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default TechnicianSidebar;
