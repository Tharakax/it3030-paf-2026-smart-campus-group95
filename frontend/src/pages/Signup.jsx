import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Layers, UserPlus, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axiosConfig';

const Signup = () => {
    const { user, login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    if (user) {
        if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
        if (user.role === 'TECHNICIAN') return <Navigate to="/technician" replace />;
        return <Navigate to="/home" replace />;
    }

    const validatePassword = (pass) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        return regex.test(pass);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match.");
        }

        if (!validatePassword(formData.password)) {
            return toast.error("Password must be at least 6 characters long and contain at least one letter and one number.");
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            
            login(res.data.token);
            toast.success("Account created successfully! Welcome to UniSync.");
        } catch (err) {
            const message = err.response?.data?.message || "Registration failed. Please try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background elements same as Login */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-[80px] animate-blob"></div>
                <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] rounded-full bg-indigo-400/20 blur-[80px] animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-[10%] left-[20%] w-[600px] h-[600px] rounded-full bg-cyan-400/20 blur-[80px] animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-5xl w-full z-10 bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/50 overflow-hidden grid grid-cols-1 lg:grid-cols-5">
                
                {/* Visual Side (2/5) */}
                <div className="hidden lg:flex lg:col-span-2 bg-gradient-to-br from-indigo-600 via-blue-700 to-blue-900 p-12 flex-col justify-between relative">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                    
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center space-x-3 mb-12 group">
                            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md group-hover:bg-white/30 transition-all">
                                <Layers className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-3xl font-black text-white tracking-tighter uppercase">UniSync</span>
                        </Link>

                        <div className="space-y-8">
                            <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
                                Join the <br /> 
                                <span className="text-blue-300">Intelligent</span> Campus.
                            </h2>
                            
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <div className="bg-blue-500/20 p-2 rounded-xl">
                                        <CheckCircle2 className="w-5 h-5 text-blue-300" />
                                    </div>
                                    <p className="text-blue-100 text-sm font-medium">Auto-assigned student permissions</p>
                                </div>
                                <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <div className="bg-blue-500/20 p-2 rounded-xl">
                                        <CheckCircle2 className="w-5 h-5 text-blue-300" />
                                    </div>
                                    <p className="text-blue-100 text-sm font-medium">Unified resource access protocol</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 p-6 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20">
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldCheck className="text-emerald-400 w-5 h-5" />
                            <span className="text-white font-bold text-sm tracking-wide">SECURE REGISTRATION</span>
                        </div>
                        <p className="text-blue-200 text-xs leading-relaxed">
                            Your credentials are encrypted with institutional grade BCrypt-256 protocols.
                        </p>
                    </div>
                </div>

                {/* Form Side (3/5) */}
                <div className="lg:col-span-3 p-8 lg:p-16 bg-white">
                    <div className="max-w-md mx-auto">
                        <div className="mb-10 text-center lg:text-left">
                            <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">
                                Create <span className="text-blue-600">Account</span>
                            </h1>
                            <p className="text-slate-500 font-medium">Join our smart campus ecosystem today.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input 
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl text-sm font-bold text-slate-700 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Email Identity</label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input 
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="university@email.com"
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl text-sm font-bold text-slate-700 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="group">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input 
                                            type="password"
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl text-sm font-bold text-slate-700 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Confirm</label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                            <CheckCircle2 size={18} />
                                        </div>
                                        <input 
                                            type="password"
                                            name="confirmPassword"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl text-sm font-bold text-slate-700 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-3 my-2">
                                <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-blue-700 font-bold leading-relaxed">
                                    Password must have 6+ characters, with at least one number and one letter.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                className="w-full bg-blue-600 text-white font-black uppercase text-[11px] tracking-[0.25em] py-5 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-3 overflow-hidden"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Create Root Account</span>
                                        <ArrowRight size={18} className={`transform transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-slate-500 text-sm font-semibold">
                                Already have an account? {' '}
                                <Link to="/login" className="text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 decoration-2">
                                    Sign In Here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
