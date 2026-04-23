import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mail,
    Phone,
    MapPin,
    Sparkles,
    CheckCircle2,
    Users,
    Clock,
    Globe,
    MessageSquare,
    HelpCircle,
    BookOpen,
    Twitter,
    Facebook,
    Linkedin,
    Github,
    Ticket,
    AlertCircle,
    ChevronRight,
    Shield,
    Zap
} from 'lucide-react';

/* ─── Inline styles (CSS-in-JS) ──────────────────────────────── */
const css = `
  @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(.95)} }
  @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,40px) scale(.9)} 66%{transform:translate(20px,-20px) scale(1.05)} }
  @keyframes orb3 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,30px) scale(1.08)} 66%{transform:translate(-40px,-10px) scale(.92)} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes pulse-ring { 0%{transform:scale(0.8);opacity:0.5} 100%{transform:scale(1.3);opacity:0} }
  @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-5px)} }
  
  .contact-root *{box-sizing:border-box;font-family:'Outfit',sans-serif}
  .contact-root h1,.contact-root h2,.contact-root h3{font-family:'Sora',sans-serif}
  .anim-0{animation:fadeSlideUp .7s ease both}
  .anim-1{animation:fadeSlideUp .7s .15s ease both}
  .anim-2{animation:fadeSlideUp .7s .3s ease both}
  
  .contact-card{transition:transform .35s cubic-bezier(.34,1.56,.64,1),box-shadow .35s ease,border-color .35s ease}
  .contact-card:hover{transform:translateY(-8px);box-shadow:0 32px 64px rgba(0,0,0,.08),0 0 0 1px rgba(59,130,246,.2)!important;border-color:rgba(59,130,246,.2)!important}
  
  .quick-link{transition:all .3s ease}
  .quick-link:hover{transform:translateX(4px);color:#3b82f6}
  
  .ticket-btn{position:relative;overflow:hidden;transition:all .3s cubic-bezier(.34,1.56,.64,1)}
  .ticket-btn::before{content:'';position:absolute;top:50%;left:50%;width:0;height:0;border-radius:50%;background:rgba(255,255,255,0.3);transform:translate(-50%,-50%);transition:width .6s,height .6s}
  .ticket-btn:hover::before{width:300px;height:300px}
  .ticket-btn:hover{transform:translateY(-3px);box-shadow:0 20px 40px rgba(139,92,246,0.3)}
  
  .pulse-ring{animation:pulse-ring 1.5s cubic-bezier(0.24,0,0.38,1) infinite}
  .float-animation{animation:float 3s ease-in-out infinite}
`;

const ContactUs = () => {
    const navigate = useNavigate();
    const glass = {
        background: 'rgba(255,255,255,.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,0,0,.05)',
        borderRadius: 24,
        boxShadow: '0 8px 24px rgba(0,0,0,.02)'
    };

    const contactMethods = [
        { icon: Mail, title: 'Email Us', value: 'support@unisync.edu', desc: 'Typical response within 2 hours', color: '#3b82f6', action: 'mailto:support@unisync.edu' },
        { icon: Phone, title: 'Call Support', value: '+1 (555) 000-1234', desc: 'Mon-Fri from 8am to 6pm', color: '#10b981', action: 'tel:+15550001234' },
        { icon: MapPin, title: 'Visit Hub', value: 'C-Block, Level 4', desc: 'Main Campus, Tech Avenue', color: '#8b5cf6', action: 'https://maps.google.com' }
    ];



    const resourceIssues = [
        { icon: Shield, title: 'Room Access Issues', desc: 'Cannot access booked rooms or facilities' },
        { icon: Zap, title: 'Equipment Malfunction', desc: 'Projectors, computers, or AV equipment not working' },
        { icon: AlertCircle, title: 'Resource Availability', desc: 'Missing or insufficient resources' }
    ];

    const handleTicketSubmit = () => {
        navigate('/dashboard', { state: { activeTab: 'tickets' } });
    };

    return (
        <div className="contact-root" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg,#f8fafc 0%,#f1f5f9 40%,#e2e8f0 70%,#f8fafc 100%)',
            position: 'relative',
            overflowX: 'hidden'
        }}>
            <style>{css}</style>

            {/* ── Animated Orbs ─────────────────────────────────── */}
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
                    backgroundImage: 'linear-gradient(rgba(0,0,0,.01) 1px,transparent 1px), linear-gradient(90deg,rgba(0,0,0,.01) 1px,transparent 1px)',
                    backgroundSize: '60px 60px'
                }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '60px 24px 100px' }}>

                {/* ── Header ──────────────────────────────────────── */}
                <div className="anim-0 text-center mb-16">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(59,130,246,.08)', border: '1px solid rgba(59,130,246,.15)', marginBottom: 20 }}>
                        <Sparkles size={13} style={{ color: '#3b82f6' }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#3b82f6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Get in Touch</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800, color: '#1e293b', lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.02em' }}>
                        We're Here to <span style={{
                            background: 'linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4)',
                            backgroundSize: '200% auto',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            animation: 'shimmer 4s linear infinite'
                        }}>Help You</span>
                    </h1>
                    <p style={{ fontSize: 18, color: '#5b6e8c', maxWidth: 640, margin: '0 auto' }}>
                        Have questions about room bookings, technical issues, or campus facilities? Our team is ready to assist you.
                    </p>
                </div>

                {/* ── Resource Issue Ticket Button (Hero Section) ── */}
                <div className="anim-1 mb-16">
                    <div style={{
                        ...glass,
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))',
                        border: '2px solid rgba(139,92,246,0.2)',
                        borderRadius: 32
                    }} className="p-8 text-center relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="float-animation" style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                            <Ticket size={120} />
                        </div>
                        <div className="pulse-ring" style={{ position: 'absolute', bottom: 20, left: 20 }}>
                            <AlertCircle size={40} style={{ color: '#8b5cf6', opacity: 0.15 }} />
                        </div>

                        <div className="relative z-10">
                            <div style={{
                                width: 60, height: 60,
                                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                boxShadow: '0 8px 20px rgba(139,92,246,0.3)'
                            }}>
                                <Ticket size={28} color="white" />
                            </div>

                            <h2 style={{ fontSize: 'clamp(24px,4vw,32px)', fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
                                Having Issues with Resources?
                            </h2>
                            <p style={{ fontSize: 16, color: '#5b6e8c', maxWidth: 500, margin: '0 auto 24px' }}>
                                Submit a support ticket and our team will prioritize your request
                            </p>

                            <button
                                onClick={handleTicketSubmit}
                                className="ticket-btn"
                                style={{
                                    background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                                    padding: '14px 32px',
                                    borderRadius: 48,
                                    border: 'none',
                                    color: 'white',
                                    fontSize: 16,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    boxShadow: '0 4px 15px rgba(139,92,246,0.3)'
                                }}
                            >
                                <Ticket size={18} />
                                Submit Resource Ticket
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                                {resourceIssues.map((issue, idx) => (
                                    <div key={idx} style={{
                                        background: 'rgba(255,255,255,0.5)',
                                        backdropFilter: 'blur(8px)',
                                        padding: '6px 14px',
                                        borderRadius: 48,
                                        fontSize: 12,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        color: '#475569'
                                    }}>
                                        <issue.icon size={12} style={{ color: '#8b5cf6' }} />
                                        <span>{issue.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* ── Main Contact Info ── */}
                    <div className="lg:col-span-7 space-y-6 anim-1">
                        {contactMethods.map((method, i) => (
                            <a
                                key={i}
                                href={method.action}
                                target={method.action.startsWith('http') ? '_blank' : '_self'}
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', display: 'block' }}
                            >
                                <div style={glass} className="contact-card p-6 border-slate-100 bg-white/60 cursor-pointer">
                                    <div className="flex items-center gap-5">
                                        <div style={{ background: `${method.color}10`, border: `1px solid ${method.color}15` }} className="p-4 rounded-2xl shadow-sm">
                                            <method.icon size={24} style={{ color: method.color }} />
                                        </div>
                                        <div>
                                            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{method.title}</h3>
                                            <p className="text-slate-800 text-lg font-bold mb-1">{method.value}</p>
                                            <p className="text-slate-500 text-sm">{method.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* ── Support Hours & Quick Actions ── */}
                    <div className="lg:col-span-5 space-y-6 anim-2">
                        {/* Support Hours Card */}
                        <div style={{ ...glass, background: 'linear-gradient(135deg,rgba(59,130,246,.05),rgba(99,102,241,.05))', border: '1px solid rgba(59,130,246,.1)' }} className="p-8 shadow-sm">
                            <h3 className="text-blue-600 font-bold mb-4 flex items-center gap-2">
                                <Clock size={18} />
                                Support Hours
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Weekdays</span>
                                    <span className="text-slate-700 font-semibold">24 Hours</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Weekends</span>
                                    <span className="text-slate-700 font-semibold">10:00 AM - 06:00 PM</span>
                                </div>
                                <div className="pt-4 border-t border-slate-200/50 flex items-center gap-3 text-emerald-600">
                                    <CheckCircle2 size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Currently Online</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


            </div>
        </div>
    );
};

export default ContactUs;