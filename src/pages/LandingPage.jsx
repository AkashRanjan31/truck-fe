import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Radio, MapPin, Siren, AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react';

// ─── Particle background ────────────────────────────────────────────────────
const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 120 }, () => ({
      x:       Math.random() * window.innerWidth,
      y:       Math.random() * window.innerHeight,
      r:       Math.random() * 1.5 + 0.3,
      alpha:   Math.random(),
      speed:   Math.random() * 0.008 + 0.003,
      phase:   Math.random() * Math.PI * 2,
    }));

    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.alpha = 0.3 + 0.5 * Math.sin(t * p.speed + p.phase);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249,115,22,${p.alpha * 0.6})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
};

// ─── Animated truck SVG scene ────────────────────────────────────────────────
const TRUCK_W = 200;

const TruckSVG = () => (
  <svg width={TRUCK_W} height="72" viewBox="0 0 200 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Trailer */}
    <rect x="0" y="8" width="128" height="46" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1.5"/>
    <rect x="2" y="10" width="124" height="42" rx="3" fill="#0f172a"/>
    <rect x="0" y="8" width="128" height="5" rx="2" fill="#f97316" opacity="0.9"/>
    <line x1="32" y1="14" x2="32" y2="54" stroke="#1e293b" strokeWidth="1.5"/>
    <line x1="64" y1="14" x2="64" y2="54" stroke="#1e293b" strokeWidth="1.5"/>
    <line x1="96" y1="14" x2="96" y2="54" stroke="#1e293b" strokeWidth="1.5"/>
    {/* Cab */}
    <rect x="128" y="14" width="58" height="38" rx="6" fill="#1e3a5f" stroke="#2563eb" strokeWidth="1.5"/>
    <rect x="130" y="16" width="54" height="34" rx="5" fill="#0f2040"/>
    <rect x="142" y="18" width="36" height="18" rx="3" fill="#1e40af" opacity="0.85"/>
    <line x1="160" y1="18" x2="160" y2="36" stroke="#3b82f6" strokeWidth="0.5" opacity="0.5"/>
    <rect x="183" y="22" width="12" height="6" rx="2" fill="#fbbf24"/>
    <rect x="183" y="32" width="12" height="4" rx="1" fill="#f97316" opacity="0.8"/>
    {/* Exhaust */}
    <rect x="125" y="4" width="4" height="12" rx="2" fill="#334155"/>
    <motion.ellipse cx="127" cy="3" rx="4" ry="2" fill="#475569" opacity="0.4"
      animate={{ opacity: [0.4, 0.05, 0.4], ry: [2, 5, 2], cy: [3, -2, 3] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    {/* Trailer wheels */}
    <circle cx="24" cy="58" r="10" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
    <circle cx="24" cy="58" r="5" fill="#334155"/>
    <circle cx="24" cy="58" r="2" fill="#64748b"/>
    <circle cx="90" cy="58" r="10" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
    <circle cx="90" cy="58" r="5" fill="#334155"/>
    <circle cx="90" cy="58" r="2" fill="#64748b"/>
    {/* Cab wheels */}
    <circle cx="148" cy="58" r="10" fill="#1e293b" stroke="#2563eb" strokeWidth="2"/>
    <circle cx="148" cy="58" r="5" fill="#1e3a5f"/>
    <circle cx="148" cy="58" r="2" fill="#3b82f6"/>
    <circle cx="174" cy="58" r="10" fill="#1e293b" stroke="#2563eb" strokeWidth="2"/>
    <circle cx="174" cy="58" r="5" fill="#1e3a5f"/>
    <circle cx="174" cy="58" r="2" fill="#3b82f6"/>
    {/* Alert beacon */}
    <motion.circle cx="152" cy="14" r="4" fill="#f97316"
      animate={{ opacity: [1, 0.2, 1], r: [4, 5, 4] }}
      transition={{ duration: 1.2, repeat: Infinity }}
    />
    <motion.circle cx="152" cy="14" r="8" fill="transparent" stroke="#f97316" strokeWidth="1"
      animate={{ opacity: [0.5, 0, 0.5], r: [8, 14, 8] }}
      transition={{ duration: 1.2, repeat: Infinity }}
    />
  </svg>
);

const TruckScene = () => {
  const containerRef = useRef(null);
  const [roadWidth, setRoadWidth] = React.useState(800);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) setRoadWidth(containerRef.current.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Truck travels from fully off-screen left (-TRUCK_W) to fully off-screen right (roadWidth)
  const startX = -TRUCK_W;
  const endX   = roadWidth;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-3xl mx-auto select-none overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* Road */}
      <div className="relative w-full h-20 rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#1e293b 0%,#0f172a 100%)', border: '1px solid rgba(51,65,85,0.7)' }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(249,115,22,0.4),transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg,transparent,#f97316,transparent)', opacity: 0.7 }} />
        {/* Moving lane dashes */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 overflow-hidden">
          <motion.div className="flex gap-8 shrink-0"
            animate={{ x: [0, -160] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            style={{ minWidth: '200%' }}
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="w-12 h-0.5 shrink-0 rounded-full"
                style={{ background: 'rgba(249,115,22,0.45)' }} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Truck — moves from startX to endX using measured pixel values */}
      <motion.div
        className="absolute"
        style={{ bottom: '6px', left: 0 }}
        animate={{ x: [startX, endX] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatDelay: 0 }}
      >
        {/* Bob */}
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Headlight beam */}
          <div className="absolute rounded-full"
            style={{
              right: '-44px', top: '50%', transform: 'translateY(-50%)',
              width: '64px', height: '22px',
              background: 'radial-gradient(ellipse,rgba(251,191,36,0.55) 0%,transparent 70%)',
            }}
          />
          <TruckSVG />
          {/* Ground shadow */}
          <div className="absolute -bottom-1 left-4 right-4 h-2 rounded-full"
            style={{ background: 'radial-gradient(ellipse,rgba(0,0,0,0.6) 0%,transparent 70%)' }} />
        </motion.div>
      </motion.div>

      {/* Speed lines */}
      {[18, 32, 46].map((top, i) => (
        <motion.div key={i}
          className="absolute h-px rounded-full pointer-events-none"
          style={{
            top: `${top}px`, left: 0, right: 0,
            background: 'linear-gradient(90deg,transparent,rgba(249,115,22,0.2),transparent)',
          }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

// ─── Stats card ──────────────────────────────────────────────────────────────
const stats = [
  { value: '5km',  label: 'ALERT RADIUS',   Icon: MapPin },
  { value: 'Live', label: 'SOS UPDATES',    Icon: Siren },
  { value: '6',    label: 'HAZARD TYPES',   Icon: AlertTriangle },
  { value: '24/7', label: 'ACTIVE NETWORK', Icon: Radio },
];

const StatsCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.8 }}
    className="w-full max-w-2xl mx-auto rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden"
    style={{
      background: 'rgba(249,115,22,0.15)',
      border: '1px solid rgba(249,115,22,0.2)',
      boxShadow: '0 0 40px rgba(249,115,22,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
    }}
  >
    {stats.map(({ value, label, Icon }, i) => (
      <motion.div
        key={label}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
        whileHover={{ background: 'rgba(249,115,22,0.12)' }}
        className="flex flex-col items-center justify-center py-5 px-3 gap-1 cursor-default transition-colors"
        style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)' }}
      >
        <Icon className="w-5 h-5 text-orange-400 mb-1" />
        <motion.span
          className="text-2xl sm:text-3xl font-black text-white"
          animate={{ textShadow: ['0 0 0px #f97316', '0 0 12px #f97316', '0 0 0px #f97316'] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
        >
          {value}
        </motion.span>
        <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-orange-400/70 text-center">
          {label}
        </span>
      </motion.div>
    ))}
  </motion.div>
);

// ─── Feature pills ────────────────────────────────────────────────────────────
const pills = [
  { Icon: MapPin,       text: '5km Alert Radius' },
  { Icon: Siren,        text: 'Live SOS Alerts' },
  { Icon: AlertTriangle,text: '6 Hazard Types' },
  { Icon: RefreshCw,    text: 'Real-time Updates' },
];

const FeaturePills = () => (
  <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
    {pills.map(({ Icon, text }, i) => (
      <motion.div
        key={text}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.6 + i * 0.08 }}
        whileHover={{ y: -3, boxShadow: '0 0 16px rgba(249,115,22,0.3)' }}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold cursor-default transition-all"
        style={{
          background: 'rgba(15,23,42,0.8)',
          border: '1px solid rgba(51,65,85,0.8)',
          backdropFilter: 'blur(8px)',
          color: '#94a3b8',
        }}
      >
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <span>{text}</span>
      </motion.div>
    ))}
  </div>
);

// ─── Main landing page ────────────────────────────────────────────────────────
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%,#1e3a5f 0%,#0f172a 60%,#020617 100%)' }}>

      {/* Particle background */}
      <ParticleCanvas />

      {/* Radial bloom behind content */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(249,115,22,0.06) 0%,transparent 70%)', zIndex: 0 }} />

      {/* Content stack */}
      <div className="relative flex flex-col items-center gap-6 sm:gap-8 w-full max-w-3xl" style={{ zIndex: 1 }}>

        {/* Brand pill */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ boxShadow: '0 0 24px rgba(249,115,22,0.4)' }}
            className="flex items-center gap-3 px-5 py-2.5 rounded-full cursor-default transition-all"
            style={{
              background: 'rgba(15,23,42,0.85)',
              border: '1px solid rgba(249,115,22,0.3)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 0 16px rgba(249,115,22,0.15)',
            }}
          >
            <Truck className="w-5 h-5 text-orange-400" />
            <span className="font-black text-white text-sm tracking-wide">
              Truck<span className="text-orange-400">Alert</span>
            </span>
            <div className="w-px h-4 bg-slate-600" />
            <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(249,115,22,0.2)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.3)' }}>
              SAFETY NETWORK
            </span>
          </motion.div>
        </motion.div>

        {/* Headline */}
        <div className="text-center space-y-1">
          <motion.h1
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-white"
          >
            Drive Safe.
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight"
            style={{ color: '#f97316', textShadow: '0 0 40px rgba(249,115,22,0.4)' }}
          >
            Stay Connected.
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="text-center text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed"
        >
          Real-time driver safety network — report road hazards, receive instant alerts,
          and get help when it matters most.
        </motion.p>

        {/* Stats card */}
        <StatsCard />

        {/* Road scene */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
        >
          <TruckScene />
        </motion.div>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <motion.button
            onClick={() => navigate('/auth')}
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(249,115,22,0.6)' }}
            whileTap={{ scale: 0.97 }}
            className="group relative flex items-center gap-3 px-10 py-4 rounded-full font-black text-lg text-white overflow-hidden"
            style={{
              background: 'linear-gradient(135deg,#ea580c 0%,#f97316 50%,#fb923c 100%)',
              boxShadow: '0 0 24px rgba(249,115,22,0.4), 0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: 'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.2) 50%,transparent 60%)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
            />
            <span className="relative z-10">Get Started</span>
            <motion.span
              className="relative z-10"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Feature pills */}
        <FeaturePills />

      </div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top,#020617,transparent)', zIndex: 0 }} />
    </div>
  );
};

export default LandingPage;
