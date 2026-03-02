import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Layers, Building, ShieldCheck, Zap, ArrowRight, Activity, Cpu } from 'lucide-react';

const Login = () => {
    const { user } = useContext(AuthContext);
    const [isHovered, setIsHovered] = useState(false);

    if (user) {
        if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
        if (user.role === 'TECHNICIAN') return <Navigate to="/technician" replace />;
        return <Navigate to="/home" replace />;
    }

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-[80px] animate-blob"></div>
                <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] rounded-full bg-indigo-400/20 blur-[80px] animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-[10%] left-[20%] w-[600px] h-[600px] rounded-full bg-cyan-400/20 blur-[80px] animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 z-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">

                {/* Left Side: Branding & Features */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600 to-indigo-800 text-white relative overflow-hidden">
                    {/* Decorative Circuit SVG Pattern */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-16">
                            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm shadow-inner">
                                <Layers className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-3xl font-extrabold tracking-tight">UniSync</span>
                        </div>

                        <div className="space-y-6 max-w-md">
                            <h1 className="text-4xl font-bold leading-tight">
                                Smart Campus Operations Hub
                            </h1>
                            <p className="text-blue-100 text-lg leading-relaxed mb-8">
                                Unifying campus management with intelligent booking systems, IT ticketing, and real-time maintenance tracking.
                            </p>

                            <div className="grid grid-cols-1 gap-6 mt-12">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-white/10 p-3 rounded-xl">
                                        <Building className="w-6 h-6 text-blue-200" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Centralized Bookings</h3>
                                        <p className="text-blue-200 text-sm">Reserve auditoriums, labs, and resources instantly.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="bg-white/10 p-3 rounded-xl">
                                        <ShieldCheck className="w-6 h-6 text-blue-200" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Role-Based Security</h3>
                                        <p className="text-blue-200 text-sm">Adaptive interfaces for Students, Technicians, and Admins.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="bg-white/10 p-3 rounded-xl">
                                        <Zap className="w-6 h-6 text-blue-200" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Rapid Issue Tracking</h3>
                                        <p className="text-blue-200 text-sm">Submit support tickets with real-time status updates.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Panel */}
                <div className="flex flex-col justify-center p-8 md:p-16 lg:p-20 relative bg-white">
                    <div className="max-w-md w-full mx-auto space-y-8">
                        {/* Mobile Logo Only */}
                        <div className="lg:hidden flex justify-center mb-8">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg">
                                    <Layers className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-extrabold text-slate-800 tracking-tight">UniSync</span>
                            </div>
                        </div>

                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                            <p className="text-slate-500">Sign in to access your dashboard and manage campus operations.</p>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={handleGoogleLogin}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                className="w-full flex items-center justify-center space-x-4 bg-white border-2 border-slate-200 hover:border-blue-500 text-slate-700 font-semibold py-4 px-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                            >
                                {/* Button Hover Background */}
                                <div className={`absolute inset-0 bg-blue-50 transform origin-left transition-transform duration-300 ease-out ${isHovered ? 'scale-x-100' : 'scale-x-0'}`}></div>

                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                                    alt="Google Logo"
                                    className="w-6 h-6 relative z-10"
                                />
                                <span className="relative z-10 group-hover:text-blue-700 transition-colors">Continue with Google</span>
                                <ArrowRight className={`w-5 h-5 text-blue-500 relative z-10 transform transition-transform duration-300 ${isHovered ? 'translate-x-1 opacity-100' : 'opacity-0 -translate-x-4'}`} />
                            </button>
                        </div>

                        <div className="relative pt-8 pb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 text-slate-400 bg-white">Secure Institutional Access</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-slate-500">
                                By continuing, you agree to the UniSync <br />
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">Terms of Service</a> and <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">Privacy Policy</a>.
                            </p>
                        </div>

                        {/* System Status Indicators */}
                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center space-x-6">
                            <div className="flex items-center text-xs text-slate-500 font-medium tooltip group cursor-help">
                                <span className="relative flex h-2 w-2 mr-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                System Online
                            </div>
                            <div className="flex items-center text-xs text-slate-500 font-medium">
                                <Cpu className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                v2.4.0
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default Login;
