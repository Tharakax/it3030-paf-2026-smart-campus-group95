import React from 'react';
import { 
    Edit3, 
    CheckCircle2, 
    Settings 
} from 'lucide-react';

const Profile = ({ user }) => {
    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-4xl">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">Personal Profile</h2>
            
            <div className="space-y-8">
                {/* Profile Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 flex flex-col md:flex-row gap-10 items-center md:items-start relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                        <button className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all">
                            <Edit3 className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="relative group">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=2563eb&color=fff&size=200`} 
                            className="w-40 h-40 rounded-3xl shadow-2xl border-4 border-white transform group-hover:rotate-3 transition-transform duration-500"
                            alt="Profile"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white p-2 rounded-xl text-white">
                            <CheckCircle2 size={20} />
                        </div>
                    </div>

                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{user?.name}</h3>
                            <p className="text-slate-500 font-medium">{user?.email}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">User Role</p>
                                <p className="font-bold text-slate-700">{user?.role}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student ID</p>
                                <p className="font-bold text-slate-700 font-mono text-sm uppercase">IT-3030-2026</p>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
                            {['Member since 2024', 'Account Verified', 'Premium Access'].map((badge, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Account Settings Placeholder */}
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                    <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold italic">Detailed profile settings coming soon...</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
