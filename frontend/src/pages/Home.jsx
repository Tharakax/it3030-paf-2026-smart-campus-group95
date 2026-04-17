import React, { useContext, useState, useEffect, useRef } from 'react';
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
  .anim-0{animation:fadeSlideUp .7s ease both}
  .anim-1{animation:fadeSlideUp .7s .15s ease both}
  .anim-2{animation:fadeSlideUp .7s .3s ease both}
  .anim-3{animation:fadeSlideUp .7s .45s ease both}
  .anim-4{animation:fadeSlideUp .7s .6s ease both}
  .anim-5{animation:fadeSlideUp .7s .75s ease both}
  .service-card{transition:transform .35s cubic-bezier(.34,1.56,.64,1),box-shadow .35s ease,border-color .35s ease}
  .service-card:hover{transform:translateY(-8px) scale(1.015);box-shadow:0 32px 64px rgba(0,0,0,.45),0 0 0 1px rgba(99,179,237,.35)!important;border-color:rgba(99,179,237,.35)!important}
  .service-card:hover .card-icon-wrap{transform:scale(1.1) rotate(4deg)}
  .service-card:hover .card-arrow{transform:translateX(5px)}
  .service-card:hover .card-line{animation:lineGrow .4s ease forwards}
  .card-icon-wrap{transition:transform .35s cubic-bezier(.34,1.56,.64,1)}
  .card-arrow{transition:transform .3s ease}
  .card-line{transform-origin:left;transform:scaleX(0)}
  .stat-mini:hover{border-color:rgba(99,179,237,.4)!important;background:rgba(99,179,237,.06)!important}
  .quick-btn:hover{background:rgba(255,255,255,.18)!important;transform:scale(1.04)}
  .activity-row:hover{background:rgba(99,179,237,.07)!important}
  .activity-row:hover .act-chevron{transform:translateX(4px);color:#63b3ed!important}
  .act-chevron{transition:transform .25s ease,color .25s ease}
  .hero-btn-primary:hover{background:rgba(255,255,255,.95)!important;box-shadow:0 12px 40px rgba(0,0,0,.35)!important;transform:translateY(-1px)}
  .hero-btn-secondary:hover{background:rgba(255,255,255,.12)!important}
  .footer-stat:hover{border-color:rgba(99,179,237,.3)!important;background:rgba(99,179,237,.05)!important}
  .ticker-item{animation:tickerSlide .4s ease}
`;

/* ═══════════════════════════════════════════════════════════════ */
const Home = () => {
    const { user } = useContext(AuthContext);
    const [isVisible, setIsVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setActiveFeature(prev => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    /* ── unchanged data ── */
    const services = [
        {
            title: 'My Bookings',
            icon: <Calendar className="w-7 h-7" style={{ color: '#fff' }} />,
            description: 'Effortlessly reserve facilities, study rooms, and campus resources.',
            gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)',
            glow: 'rgba(59,130,246,.45)',
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
            glow: 'rgba(99,102,241,.45)',
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
            glow: 'rgba(6,182,212,.45)',
            accent: '#06b6d4',
            stats: '5 new',
            bgIcon: Bell,
            features: ['Push notifications', 'Event reminders', 'Emergency alerts']
        }
    ];

    const quickStats = [
        { icon: Clock, label: 'Upcoming', value: '3 bookings', color: '#3b82f6', bg: 'rgba(59,130,246,.15)' },
        { icon: CheckCircle, label: 'Completed', value: '28 tasks', color: '#10b981', bg: 'rgba(16,185,129,.15)' },
        { icon: TrendingUp, label: 'Activity', value: '+12%', color: '#a78bfa', bg: 'rgba(167,139,250,.15)' }
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

    /* ── shared token ── */
    const glass = {
        background: 'rgba(15,23,42,.55)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,.08)',
        borderRadius: 20
    };

    return (
        <div
            className="home-root"
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg,#050b1a 0%,#0a1628 40%,#0d1f3c 70%,#071020 100%)',
                position: 'relative',
                overflowX: 'hidden'
            }}
        >
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
                {/* Subtle grid */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),
                      linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)`,
                    backgroundSize: '60px 60px'
                }} />
            </div>

            {/* ── Main Content ──────────────────────────────────── */}
            <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '40px 24px 80px' }}>

                {/* ── Header ──────────────────────────────────────── */}
                <div className="anim-0" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 52 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <div style={{
                                padding: '4px 14px', borderRadius: 999,
                                background: 'rgba(59,130,246,.12)',
                                border: '1px solid rgba(59,130,246,.3)',
                                display: 'flex', alignItems: 'center', gap: 6
                            }}>
                                <Sparkles size={13} style={{ color: '#63b3ed' }} />
                                <span style={{ fontSize: 11, fontWeight: 600, color: '#63b3ed', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Outfit,sans-serif' }}>
                                    Smart Campus Dashboard
                                </span>
                            </div>
                        </div>
                        <h1 style={{ fontSize: 'clamp(32px,4vw,52px)', fontWeight: 800, color: '#f0f6ff', lineHeight: 1.1, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                            Welcome back,{' '}
                            <span style={{
                                background: 'linear-gradient(90deg,#63b3ed,#a78bfa,#67e8f9)',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                animation: 'shimmer 4s linear infinite'
                            }}>
                                {user?.name?.split(' ')[0] || 'Student'}
                            </span>
                        </h1>
                        <p style={{ fontSize: 16, color: 'rgba(148,163,184,.8)', margin: 0, fontWeight: 400, maxWidth: 460 }}>
                            Your centralized hub for campus operations and resources
                        </p>
                    </div>

                    {/* Quick stats row */}
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {quickStats.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div key={i} className="stat-mini" style={{
                                    ...glass,
                                    padding: '12px 18px',
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    cursor: 'default',
                                    transition: 'border-color .25s,background .25s',
                                    borderRadius: 14
                                }}>
                                    <div style={{ padding: 8, borderRadius: 10, background: stat.bg }}>
                                        <Icon size={16} style={{ color: stat.color, display: 'block' }} />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: 11, color: 'rgba(148,163,184,.7)', fontWeight: 500 }}>{stat.label}</p>
                                        <p style={{ margin: 0, fontSize: 14, color: '#e2e8f0', fontWeight: 600 }}>{stat.value}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Hero 2-col ───────────────────────────────────── */}
                <div className="anim-1" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,.85fr)', gap: 24, marginBottom: 56, alignItems: 'stretch' }}>

                    {/* Left — Main hero card */}
                    <div style={{
                        background: 'linear-gradient(135deg,#1a3a6b 0%,#1e3a8a 40%,#1e2d70 100%)',
                        borderRadius: 28,
                        padding: '44px 48px',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid rgba(99,179,237,.2)'
                    }}>
                        {/* inner glow */}
                        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 10%,rgba(99,179,237,.15) 0%,transparent 60%)', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 10% 90%,rgba(167,139,250,.12) 0%,transparent 55%)', pointerEvents: 'none' }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            {/* Status pill */}
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '6px 16px', borderRadius: 999, marginBottom: 28,
                                background: 'rgba(16,185,129,.12)',
                                border: '1px solid rgba(16,185,129,.25)'
                            }}>
                                <span style={{ position: 'relative', display: 'inline-block', width: 8, height: 8 }}>
                                    <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981', animation: 'pulse-ring 1.8s ease-out infinite' }} />
                                    <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981' }} />
                                </span>
                                <Activity size={13} style={{ color: '#34d399' }} />
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#34d399', letterSpacing: '.06em' }}>System Status: Optimal</span>
                            </div>

                            <h2 style={{ fontSize: 'clamp(26px,2.8vw,38px)', fontWeight: 700, color: '#f0f9ff', lineHeight: 1.2, margin: '0 0 16px', letterSpacing: '-0.015em' }}>
                                Everything you need,{' '}
                                <span style={{ color: '#93c5fd' }}>one platform</span>
                            </h2>

                            <p style={{ fontSize: 15, color: 'rgba(186,230,253,.75)', lineHeight: 1.75, margin: '0 0 32px', maxWidth: 460, fontWeight: 400 }}>
                                Access bookings, track tickets, and stay informed with real-time
                                campus updates. Your seamless campus experience starts here.
                            </p>

                            {/* Rotating feature ticker */}
                            <div style={{
                                background: 'rgba(0,0,0,.25)',
                                borderRadius: 16, padding: '18px 22px',
                                border: '1px solid rgba(255,255,255,.07)',
                                marginBottom: 32
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <Zap size={14} style={{ color: '#fbbf24' }} />
                                    <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(186,230,253,.55)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
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
                                            <p style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 700, color: '#f0f9ff', fontFamily: 'Sora,sans-serif' }}>{svc.title}</p>
                                            <p style={{ margin: 0, fontSize: 13, color: 'rgba(186,230,253,.6)' }}>{svc.features[0]}</p>
                                        </div>
                                    ))}
                                </div>
                                {/* ticker dots */}
                                <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
                                    {services.map((_, i) => (
                                        <div key={i} style={{
                                            height: 3, borderRadius: 99,
                                            width: activeFeature === i ? 24 : 8,
                                            background: activeFeature === i ? '#63b3ed' : 'rgba(255,255,255,.18)',
                                            transition: 'width .4s ease, background .4s ease'
                                        }} />
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                <button className="hero-btn-primary" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    padding: '14px 28px', borderRadius: 12, border: 'none',
                                    background: '#fff', color: '#1e3a8a',
                                    fontWeight: 700, fontSize: 14, cursor: 'pointer',
                                    boxShadow: '0 8px 24px rgba(0,0,0,.25)',
                                    transition: 'all .25s ease', fontFamily: 'Outfit,sans-serif'
                                }}>
                                    Quick Booking
                                    <ArrowRight size={16} />
                                </button>
                                <button className="hero-btn-secondary" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    padding: '14px 28px', borderRadius: 12,
                                    background: 'rgba(255,255,255,.07)',
                                    border: '1px solid rgba(255,255,255,.15)',
                                    color: '#e0f2fe', fontWeight: 600, fontSize: 14,
                                    cursor: 'pointer', transition: 'background .25s', fontFamily: 'Outfit,sans-serif'
                                }}>
                                    View Schedule
                                </button>
                            </div>
                        </div>

                        {/* decorative */}
                        <Layers style={{ position: 'absolute', right: -24, bottom: -20, width: 180, height: 180, color: 'rgba(255,255,255,.03)', transform: 'rotate(15deg)' }} />
                    </div>

                    {/* Right — Activity + Quick actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Live Activity */}
                        <div style={{ ...glass, padding: '24px 26px', flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>Live Activity</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ position: 'relative', width: 8, height: 8, display: 'inline-block' }}>
                                        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981', animation: 'pulse-ring 1.8s ease-out infinite' }} />
                                        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981' }} />
                                    </span>
                                    <span style={{ fontSize: 11, color: '#34d399', fontWeight: 600 }}>Live</span>
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
                                                background: `${item.color}18`,
                                                border: `1px solid ${item.color}25`,
                                                flexShrink: 0
                                            }}>
                                                <Icon size={14} style={{ color: item.color, display: 'block' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ margin: 0, fontSize: 13, color: '#cbd5e1', lineHeight: 1.4, fontWeight: 400 }}>{item.text}</p>
                                                <p style={{ margin: 0, fontSize: 11, color: 'rgba(148,163,184,.5)', marginTop: 2 }}>{item.time}</p>
                                            </div>
                                            <ChevronRight size={14} className="act-chevron" style={{ color: 'rgba(148,163,184,.3)', flexShrink: 0 }} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div style={{
                            borderRadius: 20, padding: '22px 24px',
                            background: 'linear-gradient(135deg,rgba(59,130,246,.2),rgba(99,102,241,.2))',
                            border: '1px solid rgba(99,179,237,.2)',
                            backdropFilter: 'blur(20px)'
                        }}>
                            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#bae6fd', letterSpacing: '.02em' }}>Quick Actions</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                {['Book Room', 'Raise Ticket', 'Check Events', 'View Map'].map((action, i) => (
                                    <button key={i} className="quick-btn" style={{
                                        padding: '11px 14px', borderRadius: 12,
                                        background: 'rgba(255,255,255,.08)',
                                        border: '1px solid rgba(255,255,255,.12)',
                                        color: '#e0f2fe', fontSize: 13, fontWeight: 500,
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

                {/* ── Service Cards ──────────────────────────────────── */}
                <div className="anim-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, marginBottom: 56 }}>
                    {services.map((svc, i) => {
                        const BgIcon = svc.bgIcon;
                        return (
                            <div key={i} className="service-card" style={{
                                ...glass,
                                padding: '32px 28px',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                                animationDelay: `${i * 120}ms`
                            }}>
                                {/* bg watermark icon */}
                                <BgIcon style={{
                                    position: 'absolute', right: -18, bottom: -18,
                                    width: 110, height: 110,
                                    color: 'rgba(255,255,255,.03)'
                                }} />

                                {/* Glow on card */}
                                <div style={{
                                    position: 'absolute', top: 0, left: 0,
                                    width: '100%', height: 2,
                                    background: svc.gradient, borderRadius: '20px 20px 0 0'
                                }} />

                                {/* Icon */}
                                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 22 }}>
                                    <div style={{
                                        position: 'absolute', inset: -4, borderRadius: 18,
                                        background: svc.glow, filter: 'blur(14px)'
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

                                {/* Stats badge */}
                                <span style={{
                                    position: 'absolute', top: 26, right: 24,
                                    background: 'rgba(255,255,255,.06)',
                                    border: '1px solid rgba(255,255,255,.1)',
                                    color: '#93c5fd', fontSize: 11, fontWeight: 600,
                                    padding: '4px 12px', borderRadius: 999
                                }}>{svc.stats}</span>

                                <h3 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 700, color: '#f0f6ff' }}>{svc.title}</h3>
                                <p style={{ margin: '0 0 20px', fontSize: 14, color: 'rgba(148,163,184,.75)', lineHeight: 1.7, fontWeight: 400 }}>{svc.description}</p>

                                {/* Features */}
                                <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {svc.features.map((f, fi) => (
                                        <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 5, height: 5, borderRadius: '50%', background: svc.accent, flexShrink: 0 }} />
                                            <span style={{ fontSize: 13, color: 'rgba(148,163,184,.65)', fontWeight: 400 }}>{f}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: svc.accent }}>Access Portal</span>
                                    <ChevronRight size={16} className="card-arrow" style={{ color: svc.accent }} />
                                </div>

                                {/* Bottom line */}
                                <div className="card-line" style={{
                                    position: 'absolute', bottom: 0, left: 0,
                                    width: '100%', height: 2,
                                    background: svc.gradient
                                }} />
                            </div>
                        );
                    })}
                </div>

                {/* ── Footer Stats ───────────────────────────────────── */}
                <div className="anim-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
                    {footerStats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className="footer-stat" style={{
                                ...glass,
                                padding: '22px 24px',
                                cursor: 'default',
                                transition: 'border-color .25s,background .25s',
                                borderRadius: 16
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                    <Icon size={18} style={{ color: '#60a5fa' }} />
                                    <span style={{ fontSize: 11, fontWeight: 600, color: stat.changeColor, background: `${stat.changeColor}18`, padding: '3px 10px', borderRadius: 999 }}>
                                        {stat.change}
                                    </span>
                                </div>
                                <p style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 700, color: '#f0f6ff', fontFamily: 'Sora,sans-serif', letterSpacing: '-0.02em' }}>
                                    {stat.value}
                                </p>
                                <p style={{ margin: 0, fontSize: 13, color: 'rgba(148,163,184,.6)', fontWeight: 400 }}>{stat.label}</p>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default Home;