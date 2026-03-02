import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
    Calendar,
    Ticket,
    Bell,
    ArrowRight,
    Activity,
    ChevronRight,
    Layers,
    Sparkles,
    Clock,
    CheckCircle,
    TrendingUp,
    Users,
    MapPin,
    Coffee,
    Wifi,
    BookOpen,
    Shield,
    Zap,
    Star
} from 'lucide-react';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [isVisible, setIsVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        setIsVisible(true);

        // Rotating features animation
        const interval = setInterval(() => {
            setActiveFeature(prev => (prev + 1) % 3);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const services = [
        {
            title: 'My Bookings',
            icon: <Calendar className="w-8 h-8 text-white" />,
            description: 'Effortlessly reserve facilities, study rooms, and campus resources.',
            color: 'from-blue-500 to-blue-600',
            stats: '12 active',
            bgIcon: Calendar,
            features: ['Real-time availability', 'Instant confirmation', 'Flexible scheduling']
        },
        {
            title: 'My Tickets',
            icon: <Ticket className="w-8 h-8 text-white" />,
            description: 'Streamlined IT and maintenance support with priority tracking.',
            color: 'from-indigo-500 to-blue-600',
            stats: '3 pending',
            bgIcon: Ticket,
            features: ['Priority queue', 'Live updates', 'History tracking']
        },
        {
            title: 'Announcements',
            icon: <Bell className="w-8 h-8 text-white" />,
            description: 'Real-time campus updates, events, and important notifications.',
            color: 'from-blue-600 to-cyan-500',
            stats: '5 new',
            bgIcon: Bell,
            features: ['Push notifications', 'Event reminders', 'Emergency alerts']
        }
    ];

    const quickStats = [
        { icon: Clock, label: 'Upcoming', value: '3 bookings', color: 'blue' },
        { icon: CheckCircle, label: 'Completed', value: '28 tasks', color: 'green' },
        { icon: TrendingUp, label: 'Activity', value: '+12%', color: 'purple' }
    ];

    const campusHighlights = [
        { icon: MapPin, text: 'Library Study Room 204 - Available', time: '2 min ago' },
        { icon: Coffee, text: 'Cafeteria Special: 20% off today', time: '15 min ago' },
        { icon: Wifi, text: 'Network maintenance scheduled', time: '1 hour ago' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            {/* Floating Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
                {/* Header with Quick Stats */}
                <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <Sparkles className="w-5 h-5 text-blue-500" />
                                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                                    Smart Campus Dashboard
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">
                                Welcome back,{' '}
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    {user?.name?.split(' ')[0] || 'Student'}
                                </span>
                            </h1>
                            <p className="text-lg text-slate-600 max-w-2xl">
                                Your centralized hub for campus operations and resources
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex gap-4 mt-4 md:mt-0">
                            {quickStats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-100 flex items-center space-x-3 hover:shadow-md transition-shadow"
                                    >
                                        <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                                            <Icon className={`w-4 h-4 text-${stat.color}-600`} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">{stat.label}</p>
                                            <p className="font-semibold text-slate-800">{stat.value}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Hero Section with Animated Feature Cards */}
                <div className={`grid lg:grid-cols-2 gap-8 mb-16 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    {/* Main Hero Card */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 text-white overflow-hidden">
                            {/* Animated Background */}
                            <div className="absolute inset-0">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-2xl" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 w-fit mb-6">
                                    <Activity className="w-4 h-4 animate-pulse" />
                                    <span className="text-sm font-medium">System Status: Optimal</span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                    Everything you need,{' '}
                                    <span className="text-blue-200">one platform</span>
                                </h2>

                                <p className="text-blue-100 mb-8 leading-relaxed">
                                    Access bookings, track tickets, and stay informed with real-time
                                    campus updates. Your seamless campus experience starts here.
                                </p>

                                {/* Rotating Feature Highlights */}
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <Zap className="w-5 h-5 text-yellow-300" />
                                        <span className="text-sm font-medium uppercase tracking-wider text-blue-200">
                                            Featured Service
                                        </span>
                                    </div>
                                    <div className="relative h-16">
                                        {services.map((service, index) => (
                                            <div
                                                key={index}
                                                className={`absolute inset-0 transform transition-all duration-500 ${activeFeature === index
                                                    ? 'translate-x-0 opacity-100'
                                                    : 'translate-x-4 opacity-0'
                                                    }`}
                                            >
                                                <p className="text-xl font-semibold mb-1">{service.title}</p>
                                                <p className="text-blue-200 text-sm">{service.features[0]}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <button className="group bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-all shadow-xl hover:shadow-2xl flex items-center">
                                        Quick Booking
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button className="bg-blue-500/30 hover:bg-blue-500/40 text-white border border-white/30 px-8 py-4 rounded-xl font-semibold transition-all backdrop-blur-sm">
                                        View Schedule
                                    </button>
                                </div>
                            </div>

                            {/* Decorative Icons */}
                            <Layers className="absolute right-0 bottom-0 w-48 h-48 text-white/5 transform rotate-12" />
                        </div>
                    </div>

                    {/* Right Side - Campus Highlights */}
                    <div className="space-y-6">
                        {/* Live Activity Feed */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-slate-800">Live Activity</h3>
                                <span className="flex items-center space-x-1">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    <span className="text-xs text-slate-500">Live</span>
                                </span>
                            </div>
                            <div className="space-y-4">
                                {campusHighlights.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={index} className="flex items-start space-x-3 group hover:bg-slate-50 p-2 rounded-lg transition-colors">
                                            <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                                                <Icon className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-700">{item.text}</p>
                                                <p className="text-xs text-slate-400">{item.time}</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-6 shadow-lg">
                            <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {['Book Room', 'Raise Ticket', 'Check Events', 'View Map'].map((action, index) => (
                                    <button
                                        key={index}
                                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl py-3 px-4 text-sm font-medium transition-all hover:scale-105"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Grid */}
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    {services.map((service, index) => {
                        const BgIcon = service.bgIcon;
                        return (
                            <div
                                key={index}
                                className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5`} />
                                    <BgIcon className="absolute -right-8 -bottom-8 w-32 h-32 text-slate-100 transform rotate-12 group-hover:rotate-45 transition-transform duration-700" />
                                </div>

                                {/* Content */}
                                <div className="relative p-8">
                                    {/* Icon Container */}
                                    <div className={`relative mb-6 inline-block`}>
                                        <div className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
                                        <div className={`relative bg-gradient-to-br ${service.color} rounded-2xl p-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                            {service.icon}
                                        </div>
                                    </div>

                                    {/* Stats Badge */}
                                    <span className="absolute top-6 right-6 bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                                        {service.stats}
                                    </span>

                                    <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                                        {service.title}
                                    </h3>

                                    <p className="text-slate-600 mb-6 leading-relaxed">
                                        {service.description}
                                    </p>

                                    {/* Feature List */}
                                    <div className="space-y-2 mb-6">
                                        {service.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center text-sm text-slate-500">
                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                                        Access Portal
                                        <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                                    </div>
                                </div>

                                {/* Hover Border Animation */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                            </div>
                        );
                    })}
                </div>

                {/* Footer Stats Section */}
                <div className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    {[
                        { icon: Users, label: 'Active Users', value: '1,234', change: '+12%' },
                        { icon: BookOpen, label: 'Resources', value: '56', change: 'available' },
                        { icon: Shield, label: 'System Uptime', value: '99.9%', change: 'this month' },
                        { icon: Star, label: ' Satisfaction', value: '4.8/5', change: 'rating' }
                    ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <Icon className="w-5 h-5 text-blue-500" />
                                    <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</p>
                                <p className="text-sm text-slate-500">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default Home;