import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, MapPin, Bell, Shield, ArrowRight, Zap } from 'lucide-react';
import TruckAnimation from '../animations/TruckAnimation';
import './HeroSection.css';

const FEATURES = [
  { icon: <MapPin size={12} />, label: '5km Alert Radius' },
  { icon: <Bell size={12} />,   label: 'Live SOS Alerts' },
  { icon: <Shield size={12} />, label: '6 Hazard Types' },
  { icon: <Zap size={12} />,    label: 'Real-time Updates' },
];

export default function HeroSection() {
  const navigate = useNavigate();

  // 'drive-in' → 'idle' → (on click) 'drive-out' → navigate
  const [truckPhase, setTruckPhase] = useState('drive-in');
  const [leaving,    setLeaving]    = useState(false);

  // After drive-in animation (≈2s), switch to idle
  useEffect(() => {
    const t = setTimeout(() => setTruckPhase('idle'), 2100);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = () => {
    if (leaving) return;
    setLeaving(true);
    setTruckPhase('drive-out');
    // Give truck 1s to exit, then navigate
    setTimeout(() => navigate('/login'), 900);
  };

  return (
    <div className="hero-root">
      {/* Backgrounds */}
      <div className="hero-bg" />
      <div className="hero-stars" />
      <div className="hero-horizon" />

      {/* Road */}
      <div className="hero-road-section" />

      {/* Truck lives between road and content */}
      <div className="hero-truck-area">
        <TruckAnimation phase={truckPhase} />
      </div>

      {/* Content */}
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
      >
        {/* Brand pill */}
        <motion.div
          className="hero-brand"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <span className="hero-brand-icon"><Truck size={22} /></span>
          <span className="hero-brand-name">Truck Alert</span>
          <span className="hero-brand-tag">Safety Network</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="hero-headline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          Drive Safe.<br />
          <span className="hero-headline-accent">Stay Connected.</span>
        </motion.h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          Real-time driver safety network — report road hazards, receive instant
          alerts, and get help when it matters most.
        </motion.p>

        {/* Stats */}
        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          {[
            { num: '5km',  label: 'Alert Radius' },
            { num: 'Live', label: 'SOS Updates' },
            { num: '6',    label: 'Hazard Types' },
            { num: '24/7', label: 'Active Network' },
          ].map(s => (
            <div className="hero-stat" key={s.label}>
              <span className="hero-stat-num">{s.num}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="hero-cta-group"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <button
            id="hero-login-btn"
            className="hero-btn-primary"
            onClick={handleLogin}
            disabled={leaving}
          >
            <ArrowRight size={18} />
            {leaving ? 'Loading…' : 'Get Started — Login'}
          </button>
        </motion.div>

        {/* Feature chips */}
        <motion.div
          className="hero-features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          {FEATURES.map(f => (
            <div className="hero-feature-chip" key={f.label}>
              {f.icon}
              {f.label}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll hint dot */}
      <AnimatePresence>
        {truckPhase === 'idle' && !leaving && (
          <motion.div
            className="hero-scroll-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="scroll-dot" />
            <span>Click to begin</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
