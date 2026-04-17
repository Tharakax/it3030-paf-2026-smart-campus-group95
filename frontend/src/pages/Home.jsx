import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
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

/* ─── Google Fonts injection ─────────────────────────────────── */
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
    'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600&display=swap';
if (!document.head.querySelector('[href*="Sora"]')) document.head.appendChild(fontLink);

/* ─── Animated counter hook ──────────────────────────────────── */
function useCountUp(target, duration = 1200) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        const numeric = parseFloat(String(target).replace(/[^0-9.]/g, ''));
        if (!numeric) return;
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(ease * numeric));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration]);
    return value;
}

/* ─── Inline styles (CSS-in-JS) ──────────────────────────────── */
const css = `
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
  @keyframes pulse-ring { 0%{transform:scale(.9);opacity:.8} 70%{transform:scale(1.3);opacity:0} 100%{opacity:0} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(.95)} }
  @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,40px) scale(.9)} 66%{transform:translate(20px,-20px) scale(1.05)} }
  @keyframes orb3 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,30px) scale(1.08)} 66%{transform:translate(-40px,-10px) scale(.92)} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lineGrow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes tickerSlide { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .home-root *{box-sizing:border-box;font-family:'Outfit',sans-serif}
  .home-root h1,.home-root h2,.home-root h3{font-family:'Sora',sans-serif}
  
  /* Scroll reveal base (hidden until visible) */
  .scroll-reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  }
  .scroll-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
  /* Individual delays for child elements (optional) */
  .reveal-delay-1 { transition-delay: 0.05s; }
  .reveal-delay-2 { transition-delay: 0.1s; }
  .reveal-delay-3 { transition-delay: 0.15s; }
  .reveal-delay-4 { transition-delay: 0.2s; }
  
  .service-card{transition:transform .35s cubic-bezier(.34,1.56,.64,1),box-shadow .35s ease,border-color .35s ease}
  .service-card:hover{transform:translateY(-8px) scale(1.015);box-shadow:0 32px 64px rgba(0,0,0,.08),0 0 0 1px rgba(59,130,246,.2)!important;border-color:rgba(59,130,246,.2)!important}
  .service-card:hover .card-icon-wrap{transform:scale(1.1) rotate(4deg)}
  .service-card:hover .card-arrow{transform:translateX(5px)}
  .service-card:hover .card-line{animation:lineGrow .4s ease forwards}
  .card-icon-wrap{transition:transform .35s cubic-bezier(.34,1.56,.64,1)}
  .card-arrow{transition:transform .3s ease}
  .card-line{transform-origin:left;transform:scaleX(0)}
  .stat-mini:hover{border-color:rgba(59,130,246,.3)!important;background:rgba(59,130,246,.04)!important}
  .quick-btn:hover{background:rgba(59,130,246,.08)!important;transform:scale(1.02)}
  .activity-row:hover{background:rgba(59,130,246,.05)!important}
  .activity-row:hover .act-chevron{transform:translateX(4px);color:#3b82f6!important}
  .act-chevron{transition:transform .25s ease,color .25s ease}
  .hero-btn-primary:hover{background:#0f172a!important;box-shadow:0 12px 28px rgba(0,0,0,.08)!important;transform:translateY(-2px)}
  .hero-btn-secondary:hover{background:rgba(59,130,246,.08)!important;border-color:rgba(59,130,246,.2)!important;color:#1e40af}
  .footer-stat:hover{border-color:rgba(59,130,246,.2)!important;background:rgba(59,130,246,.02)!important}
  .ticker-item{animation:tickerSlide .4s ease}
`;

/* ═══════════════════════════════════════════════════════════════ */
const Home = () => {
    const { user } = useContext(AuthContext);
    const [isVisible, setIsVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    
    // Refs for scroll‑reveal sections
    const headerRef = useRef(null);
    const heroRef = useRef(null);
    const servicesRef = useRef(null);
    const footerRef = useRef(null);
    
    const [headerVisible, setHeaderVisible] = useState(false);
    const [heroVisible, setHeroVisible] = useState(false);
    const [servicesVisible, setServicesVisible] = useState(false);
    const [footerVisible, setFooterVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setActiveFeature(prev => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        switch (entry.target) {
                            case headerRef.current:
                                setHeaderVisible(true);
                                break;
                            case heroRef.current:
                                setHeroVisible(true);
                                break;
                            case servicesRef.current:
                                setServicesVisible(true);
                                break;
                            case footerRef.current:
                                setFooterVisible(true);
                                break;
                            default:
                                break;
                        }
                        // Unobserve after becoming visible for performance
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        if (headerRef.current) observer.observe(headerRef.current);
        if (heroRef.current) observer.observe(heroRef.current);
        if (servicesRef.current) observer.observe(servicesRef.current);
        if (footerRef.current) observer.observe(footerRef.current);

        return () => observer.disconnect();
    }, []);

    /* ── unchanged data ── */
    const services = [
        {
            title: 'My Bookings',
            icon: <Calendar className="w-7 h-7" style={{ color: '#fff' }} />,
            description: 'Effortlessly reserve facilities, study rooms, and campus resources.',
            gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)',
            glow: 'rgba(59,130,246,.35)',
            accent: '#3b82f6',
            stats: '12 active',
            bgIcon: Calendar,
            features: ['Real-time availability', 'Instant confirmation', 'Flexible scheduling']
        },
        {
            title: 'My Tickets',
            icon: <Ticket className="w-7 h-7" style={{ color: '#fff' }} />,
            description: 'Streamlined IT and maintenance support with priority tracking.',
            gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)',
            glow: 'rgba(99,102,241,.35)',
            accent: '#6366f1',
            stats: '3 pending',
            bgIcon: Ticket,
            features: ['Priority queue', 'Live updates', 'History tracking']
        },
        {
            title: 'Announcements',
            icon: <Bell className="w-7 h-7" style={{ color: '#fff' }} />,
            description: 'Real-time campus updates, events, and important notifications.',
            gradient: 'linear-gradient(135deg,#06b6d4,#0891b2)',
            glow: 'rgba(6,182,212,.35)',
            accent: '#06b6d4',
            stats: '5 new',
            bgIcon: Bell,
            features: ['Push notifications', 'Event reminders', 'Emergency alerts']
        }
    ];

    const quickStats = [
        { icon: Clock, label: 'Upcoming', value: '3 bookings', color: '#3b82f6', bg: 'rgba(59,130,246,.12)' },
        { icon: CheckCircle, label: 'Completed', value: '28 tasks', color: '#10b981', bg: 'rgba(16,185,129,.12)' },
        { icon: TrendingUp, label: 'Activity', value: '+12%', color: '#a78bfa', bg: 'rgba(167,139,250,.12)' }
    ];

    const campusHighlights = [
        { icon: MapPin, text: 'Library Study Room 204 - Available', time: '2 min ago', color: '#3b82f6' },
        { icon: Coffee, text: 'Cafeteria Special: 20% off today', time: '15 min ago', color: '#f59e0b' },
        { icon: Wifi, text: 'Network maintenance scheduled', time: '1 hour ago', color: '#06b6d4' }
    ];

    const footerStats = [
        { icon: Users, label: 'Active Users', value: '1,234', change: '+12%', changeColor: '#10b981' },
        { icon: BookOpen, label: 'Resources', value: '56', change: 'available', changeColor: '#3b82f6' },
        { icon: Shield, label: 'System Uptime', value: '99.9%', change: 'this month', changeColor: '#a78bfa' },
        { icon: Star, label: 'Satisfaction', value: '4.8/5', change: 'rating', changeColor: '#f59e0b' }
    ];

    /* ── shared light glass style ── */
    const glass = {
        background: 'rgba(255,255,255,.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,0,0,.05)',
        borderRadius: 20,
        boxShadow: '0 8px 24px rgba(0,0,0,.02)'
    };

    return (
        <div
            className="home-root"
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(145deg, #f9fafc 0%, #f1f4f9 100%)',
                position: 'relative',
                overflowX: 'hidden'
            }}
        >
            <style>{css}</style>

            {/* ── Animated Orbs (lighter, softer) ────────────────── */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{
                    position: 'absolute', top: '8%', left: '5%',
                    width: 520, height: 520,
                    background: 'radial-gradient(circle,rgba(59,130,246,.04) 0%,transparent 70%)',
                    borderRadius: '50%', animation: 'orb1 18s ease-in-out infinite'
                }} />
                <div style={{
                    position: 'absolute', top: '30%', right: '3%',
                    width: 420, height: 420,
                    background: 'radial-gradient(circle,rgba(99,102,241,.04) 0%,transparent 70%)',
                    borderRadius: '50%', animation: 'orb2 22s ease-in-out infinite'
                }} />
                <div style={{
                    position: 'absolute', bottom: '10%', left: '35%',
                    width: 360, height: 360,
                    background: 'radial-gradient(circle,rgba(6,182,212,.03) 0%,transparent 70%)',
                    borderRadius: '50%', animation: 'orb3 15s ease-in-out infinite'
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `
                      linear-gradient(rgba(0,0,0,.02) 1px,transparent 1px),
                      linear-gradient(90deg,rgba(0,0,0,.02) 1px,transparent 1px)`,
                    backgroundSize: '60px 60px'
                }} />
            </div>

            {/* ── Main Content ──────────────────────────────────── */}
            <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '40px 24px 80px' }}>

                {/* ── Header (scroll reveal) ──────────────────────── */}
                <div
                    ref={headerRef}
                    className={`scroll-reveal ${headerVisible ? 'visible' : ''}`}
                    style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 52 }}
                >
                    <div className="reveal-delay-1" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <div style={{
                                padding: '4px 14px', borderRadius: 999,
                                background: 'rgba(59,130,246,.08)',
                                border: '1px solid rgba(59,130,246,.15)',
                                display: 'flex', alignItems: 'center', gap: 6
                            }}>
                                <Sparkles size={13} style={{ color: '#3b82f6' }} />
                                <span style={{ fontSize: 11, fontWeight: 600, color: '#3b82f6', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Outfit,sans-serif' }}>
                                    Smart Campus Dashboard
                                </span>
                            </div>
                        </div>
                        <h1 style={{ fontSize: 'clamp(32px,4vw,52px)', fontWeight: 800, color: '#1e293b', lineHeight: 1.1, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                            Welcome back,{' '}
                            <span style={{
                                background: 'linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4)',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                animation: 'shimmer 4s linear infinite'
                            }}>
                                {user?.name?.split(' ')[0] || 'Student'}
                            </span>
                        </h1>
                        <p style={{ fontSize: 16, color: '#5b6e8c', margin: 0, fontWeight: 400, maxWidth: 460 }}>
                            Your centralized hub for campus operations and resources
                        </p>
                    </div>

                    {/* Quick stats row */}
                    <div className="reveal-delay-2" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {quickStats.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div key={i} className="stat-mini" style={{
                                    ...glass,
                                    padding: '12px 18px',
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    cursor: 'default',
                                    transition: 'border-color .25s,background .25s',
                                    borderRadius: 14,
                                    background: 'white'
                                }}>
                                    <div style={{ padding: 8, borderRadius: 10, background: stat.bg }}>
                                        <Icon size={16} style={{ color: stat.color, display: 'block' }} />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: 11, color: '#6c7a91', fontWeight: 500 }}>{stat.label}</p>
                                        <p style={{ margin: 0, fontSize: 14, color: '#1e293b', fontWeight: 600 }}>{stat.value}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Hero 2-col (scroll reveal) ───────────────────── */}
                <div
                    ref={heroRef}
                    className={`scroll-reveal ${heroVisible ? 'visible' : ''}`}
                    style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,.85fr)', gap: 24, marginBottom: 56, alignItems: 'stretch' }}
                >
                    {/* Left — Main hero card (Light, modern, no dark) */}
                    <div className="reveal-delay-1" style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        borderRadius: 28,
                        padding: '44px 48px',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,.04)',
                        boxShadow: '0 20px 35px -12px rgba(0,0,0,.08)'
                    }}>
                        {/* inner glow (subtle) */}
                        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 10%,rgba(59,130,246,.06) 0%,transparent 60%)', pointerEvents: 'none' }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            {/* Status pill */}
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '6px 16px', borderRadius: 999, marginBottom: 28,
                                background: 'rgba(16,185,129,.1)',
                                border: '1px solid rgba(16,185,129,.15)'
                            }}>
                                <span style={{ position: 'relative', display: 'inline-block', width: 8, height: 8 }}>
                                    <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981', animation: 'pulse-ring 1.8s ease-out infinite' }} />
                                    <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981' }} />
                                </span>
                                <Activity size={13} style={{ color: '#10b981' }} />
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#2c7a4d', letterSpacing: '.06em' }}>System Status: Optimal</span>
                            </div>

                            <h2 style={{ fontSize: 'clamp(26px,2.8vw,38px)', fontWeight: 700, color: '#1e293b', lineHeight: 1.2, margin: '0 0 16px', letterSpacing: '-0.015em' }}>
                                Everything you need,{' '}
                                <span style={{ color: '#5b6e8c' }}>one platform</span>
                            </h2>

                            <p style={{ fontSize: 15, color: '#5b6e8c', lineHeight: 1.65, margin: '0 0 32px', maxWidth: 460, fontWeight: 400 }}>
                                Access bookings, track tickets, and stay informed with real-time
                                campus updates. Your seamless campus experience starts here.
                            </p>

                            {/* Rotating feature ticker */}
                            <div style={{
                                background: 'rgba(59,130,246,.03)',
                                borderRadius: 16, padding: '18px 22px',
                                border: '1px solid rgba(59,130,246,.1)',
                                marginBottom: 32
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <Zap size={14} style={{ color: '#eab308' }} />
                                    <span style={{ fontSize: 10, fontWeight: 700, color: '#7e8b9f', letterSpacing: '.12em', textTransform: 'uppercase' }}>
                                        Featured Service
                                    </span>
                                </div>
                                <div style={{ position: 'relative', height: 56, overflow: 'hidden' }}>
                                    {services.map((svc, i) => (
                                        <div key={i} style={{
                                            position: 'absolute', inset: 0,
                                            transition: 'opacity .5s ease, transform .5s ease',
                                            opacity: activeFeature === i ? 1 : 0,
                                            transform: activeFeature === i ? 'translateY(0)' : 'translateY(10px)',
                                            pointerEvents: activeFeature === i ? 'auto' : 'none'
                                        }}>
                                            <p style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 700, color: '#1e293b', fontFamily: 'Sora,sans-serif' }}>{svc.title}</p>
                                            <p style={{ margin: 0, fontSize: 13, color: '#6c7a91' }}>{svc.features[0]}</p>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
                                    {services.map((_, i) => (
                                        <div key={i} style={{
                                            height: 3, borderRadius: 99,
                                            width: activeFeature === i ? 24 : 8,
                                            background: activeFeature === i ? '#3b82f6' : 'rgba(59,130,246,.2)',
                                            transition: 'width .4s ease, background .4s ease'
                                        }} />
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                <button className="hero-btn-primary" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    padding: '14px 28px', borderRadius: 12, border: 'none',
                                    background: '#1e293b', color: '#ffffff',
                                    fontWeight: 700, fontSize: 14, cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(0,0,0,.05)',
                                    transition: 'all .25s ease', fontFamily: 'Outfit,sans-serif'
                                }}>
                                    Quick Booking
                                    <ArrowRight size={16} />
                                </button>
                                <button className="hero-btn-secondary" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    padding: '14px 28px', borderRadius: 12,
                                    background: 'transparent',
                                    border: '1px solid #cbd5e1',
                                    color: '#475569', fontWeight: 600, fontSize: 14,
                                    cursor: 'pointer', transition: 'all .25s', fontFamily: 'Outfit,sans-serif'
                                }}>
                                    View Schedule
                                </button>
                            </div>
                        </div>

                        {/* decorative */}
                        <Layers style={{ position: 'absolute', right: -24, bottom: -20, width: 180, height: 180, color: 'rgba(0,0,0,.02)', transform: 'rotate(15deg)' }} />
                    </div>

                    {/* Right — Activity + Quick actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Live Activity */}
                        <div className="reveal-delay-2" style={{ ...glass, padding: '24px 26px', flex: 1, background: 'white' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Live Activity</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ position: 'relative', width: 8, height: 8, display: 'inline-block' }}>
                                        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981', animation: 'pulse-ring 1.8s ease-out infinite' }} />
                                        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981' }} />
                                    </span>
                                    <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Live</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {campusHighlights.map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={i} className="activity-row" style={{
                                            display: 'flex', alignItems: 'center', gap: 12,
                                            padding: '10px 10px', borderRadius: 12, cursor: 'pointer',
                                            transition: 'background .2s'
                                        }}>
                                            <div style={{
                                                padding: 9, borderRadius: 10,
                                                background: `${item.color}10`,
                                                border: `1px solid ${item.color}15`,
                                                flexShrink: 0
                                            }}>
                                                <Icon size={14} style={{ color: item.color, display: 'block' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ margin: 0, fontSize: 13, color: '#334155', lineHeight: 1.4, fontWeight: 400 }}>{item.text}</p>
                                                <p style={{ margin: 0, fontSize: 11, color: '#6c7a91', marginTop: 2 }}>{item.time}</p>
                                            </div>
                                            <ChevronRight size={14} className="act-chevron" style={{ color: '#94a3b8', flexShrink: 0 }} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="reveal-delay-3" style={{
                            borderRadius: 20, padding: '22px 24px',
                            background: 'white',
                            border: '1px solid rgba(59,130,246,.1)',
                            boxShadow: '0 10px 25px -8px rgba(59,130,246,.1)'
                        }}>
                            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#3b82f6', letterSpacing: '.02em' }}>Quick Actions</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                {['Book Room', 'Raise Ticket', 'Check Events', 'View Map'].map((action, i) => (
                                    <button key={i} className="quick-btn" style={{
                                        padding: '11px 14px', borderRadius: 12,
                                        background: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        color: '#334155', fontSize: 13, fontWeight: 500,
                                        cursor: 'pointer', transition: 'all .2s ease',
                                        fontFamily: 'Outfit,sans-serif', textAlign: 'center'
                                    }}>
                                        {action}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Service Cards (scroll reveal) ───────────────────── */}
                <div
                    ref={servicesRef}
                    className={`scroll-reveal ${servicesVisible ? 'visible' : ''}`}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, marginBottom: 56 }}
                >
                    {services.map((svc, i) => {
                        const BgIcon = svc.bgIcon;
                        return (
                            <div
                                key={i}
                                className={`service-card reveal-delay-${(i % 3) + 1}`}
                                style={{
                                    ...glass,
                                    background: 'white',
                                    padding: '32px 28px',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxShadow: '0 8px 20px rgba(0,0,0,.02)'
                                }}
                            >
                                <BgIcon style={{
                                    position: 'absolute', right: -18, bottom: -18,
                                    width: 110, height: 110,
                                    color: 'rgba(59,130,246,.03)'
                                }} />

                                <div style={{
                                    position: 'absolute', top: 0, left: 0,
                                    width: '100%', height: 2,
                                    background: svc.gradient, borderRadius: '20px 20px 0 0'
                                }} />

                                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 22 }}>
                                    <div style={{
                                        position: 'absolute', inset: -4, borderRadius: 18,
                                        background: svc.glow, filter: 'blur(12px)',
                                        opacity: 0.4
                                    }} />
                                    <div className="card-icon-wrap" style={{
                                        position: 'relative',
                                        background: svc.gradient,
                                        borderRadius: 16, padding: 14,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {svc.icon}
                                    </div>
                                </div>

                                <span style={{
                                    position: 'absolute', top: 26, right: 24,
                                    background: 'rgba(59,130,246,.08)',
                                    border: '1px solid rgba(59,130,246,.1)',
                                    color: '#3b82f6', fontSize: 11, fontWeight: 600,
                                    padding: '4px 12px', borderRadius: 999
                                }}>{svc.stats}</span>

                                <h3 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 700, color: '#1e293b' }}>{svc.title}</h3>
                                <p style={{ margin: '0 0 20px', fontSize: 14, color: '#5b6e8c', lineHeight: 1.6, fontWeight: 400 }}>{svc.description}</p>

                                <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {svc.features.map((f, fi) => (
                                        <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 5, height: 5, borderRadius: '50%', background: svc.accent, flexShrink: 0 }} />
                                            <span style={{ fontSize: 13, color: '#475569', fontWeight: 400 }}>{f}</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: svc.accent }}>Access Portal</span>
                                    <ChevronRight size={16} className="card-arrow" style={{ color: svc.accent }} />
                                </div>

                                <div className="card-line" style={{
                                    position: 'absolute', bottom: 0, left: 0,
                                    width: '100%', height: 2,
                                    background: svc.gradient
                                }} />
                            </div>
                        );
                    })}
                </div>

                {/* ── Footer Stats (scroll reveal) ───────────────────── */}
                <div
                    ref={footerRef}
                    className={`scroll-reveal ${footerVisible ? 'visible' : ''}`}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}
                >
                    {footerStats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={i}
                                className={`footer-stat reveal-delay-${(i % 3) + 1}`}
                                style={{
                                    ...glass,
                                    background: 'white',
                                    padding: '22px 24px',
                                    cursor: 'default',
                                    transition: 'border-color .25s,background .25s',
                                    borderRadius: 16,
                                    boxShadow: '0 4px 12px rgba(0,0,0,.02)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                    <Icon size={18} style={{ color: '#3b82f6' }} />
                                    <span style={{ fontSize: 11, fontWeight: 600, color: stat.changeColor, background: `${stat.changeColor}10`, padding: '3px 10px', borderRadius: 999 }}>
                                        {stat.change}
                                    </span>
                                </div>
                                <p style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 700, color: '#1e293b', fontFamily: 'Sora,sans-serif', letterSpacing: '-0.02em' }}>
                                    {stat.value}
                                </p>
                                <p style={{ margin: 0, fontSize: 13, color: '#6c7a91', fontWeight: 400 }}>{stat.label}</p>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default Home;