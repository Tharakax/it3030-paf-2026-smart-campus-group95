import React from 'react';
import { useLocation } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
    const location = useLocation();

    // Hide footer on dashboard, admin and technician routes
    const hideFooterRoutes = ['/dashboard', '/admin', '/technician'];
    if (hideFooterRoutes.includes(location.pathname)) return null;

    return (
        <footer className="bg-white border-t border-slate-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                            <img src={logo} alt="UniSync Logo" className="w-9 h-9 object-contain" />
                            <span className="text-xl font-bold text-slate-800 tracking-tight">
                                UniSync <span className="text-blue-600">Hub</span>
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed text-center md:text-left max-w-sm">
                            The intelligent operations platform for modern campuses. Unifying schedules, maintenance, and communications into one seamless ecosystem.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center md:text-left">
                        <h3 className="text-slate-800 font-semibold mb-4 uppercase text-sm tracking-wider">Resources</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">Documentation</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">User Guides</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">API Reference</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">Support Center</a></li>
                        </ul>
                    </div>

                    {/* Legal & Social */}
                    <div className="text-center md:text-left">
                        <h3 className="text-slate-800 font-semibold mb-4 uppercase text-sm tracking-wider">Connect</h3>
                        <div className="flex justify-center md:justify-start space-x-4 mb-6">
                            <a href="#" className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                        <p className="text-slate-500 text-xs text-center md:text-left">
                            Built for IT3030 PAF Assignment
                        </p>
                    </div>
                </div>

                <div className="border-t border-slate-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} UniSync Systems Inc. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;