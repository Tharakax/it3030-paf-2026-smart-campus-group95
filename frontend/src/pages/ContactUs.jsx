import React, { useState } from 'react';
import { 
    Mail, 
    MessageSquare, 
    Phone, 
    MapPin, 
    Send, 
    Sparkles, 
    CheckCircle2,
    Users,
    Clock,
    Globe
} from 'lucide-react';

/* ─── Inline styles (CSS-in-JS) ──────────────────────────────── */
const css = `
  @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(.95)} }
  @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,40px) scale(.9)} 66%{transform:translate(20px,-20px) scale(1.05)} }
  @keyframes orb3 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,30px) scale(1.08)} 66%{transform:translate(-40px,-10px) scale(.92)} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  
  .contact-root *{box-sizing:border-box;font-family:'Outfit',sans-serif}
  .contact-root h1,.contact-root h2,.contact-root h3{font-family:'Sora',sans-serif}
  .anim-0{animation:fadeSlideUp .7s ease both}
  .anim-1{animation:fadeSlideUp .7s .15s ease both}
  .anim-2{animation:fadeSlideUp .7s .3s ease both}
  
  .contact-card{transition:transform .35s cubic-bezier(.34,1.56,.64,1),box-shadow .35s ease,border-color .35s ease}
  .contact-card:hover{transform:translateY(-8px);box-shadow:0 32px 64px rgba(0,0,0,.45),0 0 0 1px rgba(99,179,237,.35)!important;border-color:rgba(99,179,237,.35)!important}
  
  .form-input{background:rgba(15,23,42,.55); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,.08); color:#e2e8f0; border-radius:12px; transition:all .3s ease}
  .form-input:focus{border-color:rgba(99,179,237,.4); background:rgba(30,41,59,.8); outline:none; box-shadow:0 0 0 4px rgba(59,130,246,0.1)}
  
  .submit-btn{background:linear-gradient(135deg,#3b82f6,#2563eb); transition:all .3s ease}
  .submit-btn:hover{transform:translateY(-2px); box-shadow:0 12px 24px rgba(59,130,246,.3)}
  .submit-btn:active{transform:translateY(0)}
`;

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setTimeout(() => {
            setIsSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const glass = {
        background: 'rgba(15,23,42,.55)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,.08)',
        borderRadius: 24
    };

    const contactMethods = [
        { icon: Mail, title: 'Email Us', value: 'support@unisync.edu', desc: 'Typical response within 2 hours', color: '#3b82f6' },
        { icon: Phone, title: 'Call Support', value: '+1 (555) 000-1234', desc: 'Mon-Fri from 8am to 6pm', color: '#10b981' },
        { icon: MapPin, title: 'Visit Hub', value: 'C-Block, Level 4', desc: 'Main Campus, Tech Avenue', color: '#a78bfa' }
    ];

    return (
        <div className="contact-root" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg,#050b1a 0%,#0a1628 40%,#0d1f3c 70%,#071020 100%)',
            position: 'relative',
            overflowX: 'hidden'
        }}>
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
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)',
                    backgroundSize: '60px 60px'
                }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '60px 24px 100px' }}>
                
                {/* ── Header ──────────────────────────────────────── */}
                <div className="anim-0 text-center mb-16">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(59,130,246,.12)', border: '1px solid rgba(59,130,246,.3)', marginBottom: 20 }}>
                        <Sparkles size={13} style={{ color: '#63b3ed' }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#63b3ed', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Get in Touch</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800, color: '#f0f6ff', lineHeight: 1.1, marginBottom: 16 }}>
                        We're Here to <span style={{
                            background: 'linear-gradient(90deg,#63b3ed,#a78bfa,#67e8f9)',
                            backgroundSize: '200% auto',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            animation: 'shimmer 4s linear infinite'
                        }}>Help You</span>
                    </h1>
                    <p style={{ fontSize: 18, color: 'rgba(148,163,184,.8)', maxWidth: 640, margin: '0 auto' }}>
                        Have questions about room bookings, technical issues, or campus facilities? Our team is ready to assist you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* ── Contact Info ── */}
                    <div className="lg:col-span-5 space-y-6 anim-1">
                        {contactMethods.map((method, i) => (
                            <div key={i} style={glass} className="contact-card p-6 border-white/5">
                                <div className="flex items-center gap-5">
                                    <div style={{ background: `${method.color}20`, border: `1px solid ${method.color}30` }} className="p-4 rounded-2xl">
                                        <method.icon size={24} style={{ color: method.color }} />
                                    </div>
                                    <div>
                                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{method.title}</h3>
                                        <p className="text-slate-100 text-lg font-bold mb-1">{method.value}</p>
                                        <p className="text-slate-500 text-sm">{method.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Extra Info Card */}
                        <div style={{ ...glass, background: 'linear-gradient(135deg,rgba(59,130,246,.1),rgba(99,102,241,.1))' }} className="p-8 border-blue-500/20 mt-8">
                            <h3 className="text-blue-400 font-bold mb-4">Support Hours</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Weekdays</span>
                                    <span className="text-slate-100 font-semibold">24 Hours</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Weekends</span>
                                    <span className="text-slate-100 font-semibold">10:00 AM - 06:00 PM</span>
                                </div>
                                <div className="pt-4 border-t border-white/5 flex items-center gap-3 text-emerald-400">
                                    <CheckCircle2 size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Currently Online</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Contact Form ── */}
                    <div className="lg:col-span-7 anim-2">
                        {isSubmitted ? (
                            <div style={glass} className="p-16 text-center border-emerald-500/20 bg-emerald-500/5">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                                    <CheckCircle2 size={40} className="text-emerald-500" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-100 mb-4">Message Received!</h2>
                                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                                    Thanks for reaching out! Our support team has received your inquiry and will get back to you shortly.
                                </p>
                                <button 
                                    onClick={() => setIsSubmitted(false)}
                                    className="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <div style={glass} className="p-8 md:p-10 border-white/5">
                                <div className="flex items-center gap-3 mb-8">
                                    <MessageSquare className="text-blue-400" size={24} />
                                    <h2 className="text-2xl font-bold text-slate-100">Send a Message</h2>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-slate-400 text-sm font-semibold ml-1">Full Name</label>
                                            <input 
                                                required
                                                type="text" 
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe" 
                                                className="form-input w-full px-5 py-3.5"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-slate-400 text-sm font-semibold ml-1">Email Address</label>
                                            <input 
                                                required
                                                type="email" 
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com" 
                                                className="form-input w-full px-5 py-3.5"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-slate-400 text-sm font-semibold ml-1">Subject</label>
                                        <input 
                                            required
                                            type="text" 
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="How can we help?" 
                                            className="form-input w-full px-5 py-3.5"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-slate-400 text-sm font-semibold ml-1">Message</label>
                                        <textarea 
                                            required
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="5" 
                                            placeholder="Write your message here..." 
                                            className="form-input w-full px-5 py-3.5 resize-none"
                                        ></textarea>
                                    </div>
                                    <button 
                                        type="submit"
                                        className="submit-btn w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 group"
                                    >
                                        Send Message
                                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Footer Stats ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 anim-2">
                    {[
                        { icon: Users, label: 'Happy Users', val: '2k+' },
                        { icon: Clock, label: 'Avg Response', val: '1.2h' },
                        { icon: CheckCircle2, label: 'Solved', val: '98%' },
                        { icon: Globe, label: 'Campus Sites', val: '4' }
                    ].map((stat, i) => (
                        <div key={i} style={glass} className="p-6 text-center border-white/5">
                            <stat.icon size={20} className="text-blue-400 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-slate-100 mb-1">{stat.val}</div>
                            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
