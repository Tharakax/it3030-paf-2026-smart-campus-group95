import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
    Calendar,
    Ticket,
    Bell,
    ArrowRight,
    ChevronRight,
    Sparkles,
    LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const services = [
        {
            title: 'Facility Bookings',
            icon: <Calendar className="w-6 h-6 text-blue-600" />,
            description: 'Reserve study rooms, labs, and sports facilities instantly.',
            link: '/bookings',
            badge: '12 Available'
        },
        {
            title: 'Support Tickets',
            icon: <Ticket className="w-6 h-6 text-indigo-600" />,
            description: 'Get help with IT, maintenance, or campus services.',
            link: '/tickets',
            badge: '3 Active'
        },
        {
            title: 'Campus Updates',
            icon: <Bell className="w-6 h-6 text-emerald-600" />,
            description: 'Stay informed with the latest news and announcements.',
            link: '/announcements',
            badge: '5 New'
        }
    ];

    const recentActivity = [
        { text: 'Library Study Room 204 Booked', time: '2 mins ago', type: 'booking' },
        { text: 'IT Ticket #4252 Resolved', time: '45 mins ago', type: 'ticket' },
        { text: 'New Announcement: Spring Fest 2026', time: '2 hours ago', type: 'bell' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
            {/* Subtle Background Accent */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-[100px] opacity-40" />
            </div>

            <div className={`max-w-6xl mx-auto px-6 py-12 md:py-20 relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {/* Header Section */}
                <header className="mb-16">
                    <div className="flex items-center space-x-2 text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span>University Operations Hub</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                        Good day, <span className="text-blue-600">{user?.name?.split(' ')[0] || 'Student'}</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-xl">
                        Everything you need to manage your campus experience, 
                        streamlined in one powerful dashboard.
                    </p>
                </header>

                {/* Main Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {services.map((service, index) => (
                        <div 
                            key={index}
                            onClick={() => navigate(service.link)}
                            className="premium-card p-8 cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                                    {service.icon}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                                    {service.badge}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                {service.description}
                            </p>
                            <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                Open Portal <ChevronRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Section: Recent Activity & Quick Redirect */}
                <div className="grid lg:grid-cols-5 gap-12 items-start">
                    <div className="lg:col-span-3">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                            Recent Activity
                        </h2>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-100 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        <span className="text-slate-700 text-sm font-medium">{activity.text}</span>
                                    </div>
                                    <span className="text-slate-400 text-xs">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group premium-shadow">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/30 transition-colors" />
                            <h3 className="text-xl font-bold mb-4 relative z-10">Advanced View</h3>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed relative z-10">
                                Need more detailed statistics and system controls? 
                                Access your full management board.
                            </p>
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center group relative z-10"
                            >
                                <LayoutDashboard className="w-5 h-5 mr-2" />
                                Go to Dashboard
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;