import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, ArrowLeft, Radio, Star, User } from 'lucide-react';

// ── Left hero stats ──────────────────────────────────────────────────────────
const heroStats = [
  { value: '5km',  label: 'ALERT RADIUS' },
  { value: 'Live', label: 'SOS ALERTS'   },
  { value: '6',    label: 'ISSUE TYPES'  },
];

// ── Animated road lines ──────────────────────────────────────────────────────
const RoadLines = () => (
  <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden pointer-events-none">
    {/* Road surface */}
    <div className="absolute inset-0"
      style={{ background: 'linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.6) 100%)' }} />
    {/* Lane dashes */}
    <div className="absolute bottom-8 left-0 right-0 h-0.5 overflow-hidden">
      <motion.div
        className="flex gap-8"
        style={{ minWidth: '200%' }}
        animate={{ x: [0, -160] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="w-12 h-0.5 shrink-0 rounded-full bg-orange-400/40" />
        ))}
      </motion.div>
    </div>
    {/* Bottom glow line */}
    <div className="absolute bottom-0 left-0 right-0 h-px"
      style={{ background: 'linear-gradient(90deg,transparent,#f97316,transparent)', opacity: 0.5 }} />
  </div>
);

// ── Left hero section ────────────────────────────────────────────────────────
const AuthHeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className="relative hidden lg:flex lg:w-[62%] flex-col justify-between overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#020617 0%,#0f172a 40%,#1e3a5f 100%)' }}>

      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(249,115,22,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.3) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(249,115,22,0.08) 0%,transparent 70%)' }} />

      {/* Top nav pills */}
      <div className="relative z-10 flex items-center justify-between p-8">
        <motion.button
          onClick={() => navigate('/')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ x: -3 }}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </motion.button>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
          style={{
            background: 'rgba(249,115,22,0.15)',
            border: '1px solid rgba(249,115,22,0.3)',
            color: '#fb923c',
          }}
        >
          <motion.span className="w-1.5 h-1.5 rounded-full bg-orange-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <Radio className="w-3 h-3" /> Live Safety Network
        </motion.div>
      </div>

      {/* Center hero content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-12 xl:px-16">
        {/* Truck icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full"
            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.6)' }}>
            <Truck className="w-4 h-4 text-orange-400" />
            <span className="font-black text-white text-sm">Truck<span className="text-orange-400">Alert</span></span>
          </div>
        </motion.div>

        {/* Main heading */}
        <div className="space-y-2 mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight"
          >
            Drive Safe.
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-5xl xl:text-6xl font-black leading-tight tracking-tight"
            style={{ color: '#f97316', textShadow: '0 0 40px rgba(249,115,22,0.4)' }}
          >
            Stay Connected.
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, filter: 'blur(6px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-slate-400 text-base leading-relaxed max-w-md mb-10"
        >
          Real-time driver safety network — report hazards, receive instant alerts,
          and get help when it matters most.
        </motion.p>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-10">
          {heroStats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
              className="flex flex-col items-center px-5 py-3 rounded-2xl"
              style={{
                background: 'rgba(15,23,42,0.7)',
                border: '1px solid rgba(51,65,85,0.6)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span className="text-2xl font-black text-white"
                style={{ textShadow: '0 0 16px rgba(249,115,22,0.5)' }}>
                {value}
              </span>
              <span className="text-[9px] font-bold tracking-widest text-orange-400/70 mt-0.5">
                {label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex items-center gap-3"
        >
          <div className="flex -space-x-2">
            {[0,1,2,3,4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center"
                style={{ background: `hsl(${i * 40 + 200},40%,25%)` }}>
                <User className="w-3.5 h-3.5 text-slate-300" />
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center gap-0.5">
              {[0,1,2,3,4].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-slate-400 text-xs mt-0.5">1,000+ drivers already connected</p>
          </div>
        </motion.div>
      </div>

      {/* Road animation at bottom */}
      <RoadLines />

      {/* Bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top,rgba(2,6,23,0.8),transparent)' }} />
    </div>
  );
};

// ── Auth layout wrapper ──────────────────────────────────────────────────────
const AuthLayout = () => (
  <div className="min-h-screen flex overflow-hidden"
    style={{ background: '#020617' }}>

    {/* Left hero */}
    <AuthHeroSection />

    {/* Right auth panel */}
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex-1 lg:w-[38%] flex flex-col items-center justify-center p-6 sm:p-10 relative overflow-y-auto"
      style={{ background: 'linear-gradient(180deg,#0a0f1e 0%,#0f172a 100%)' }}
    >
      {/* Subtle top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(249,115,22,0.4),transparent)' }} />

      {/* Mobile back button */}
      <div className="lg:hidden w-full max-w-sm mb-6">
        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
          ← Back
        </button>
      </div>

      {/* Auth card content */}
      <div className="w-full max-w-sm">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg,#ea580c,#f97316)',
              boxShadow: '0 0 24px rgba(249,115,22,0.4)',
            }}>
            <Truck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-black text-white">
            Truck<span className="text-orange-400">Alert</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1">Driver Safety Network</p>
        </motion.div>

        {/* Outlet renders AuthPage / VerifyOTPPage */}
        <Outlet />
      </div>

      {/* Footer */}
      <p className="absolute bottom-4 text-slate-700 text-xs">
        © 2024 TruckAlert · Keeping India's roads safe
      </p>
    </motion.div>
  </div>
);

export default AuthLayout;
