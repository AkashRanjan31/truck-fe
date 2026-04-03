import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, ChevronLeft, Truck, Users, Star } from 'lucide-react';
import { useDriver } from '../context/DriverContext';
import './Login.css';

export default function Login() {
  const { register, login } = useDriver();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(true);
  const [step,       setStep]       = useState('phone');
  const [phone,      setPhone]      = useState('');
  const [form,       setForm]       = useState({ name: '', truckNumber: '' });
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  const handlePhoneNext = (e) => {
    e.preventDefault();
    if (!phone.trim() || phone.trim().length < 10) return setError('Enter a valid phone number');
    setError('');
    if (isRegister) setStep('details');
    else handleLogin();
  };

  const handleLogin = async () => {
    setLoading(true); setError('');
    try { await login(phone.trim()); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.truckNumber.trim()) return setError('All fields are required');
    setLoading(true); setError('');
    try { await register(form.name.trim(), phone.trim(), form.truckNumber.trim()); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const reset = () => { setStep('phone'); setPhone(''); setError(''); };

  return (
    <motion.div
      className="login-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Left hero */}
      <div className="login-hero">
        <div className="login-hero-img" />
        <div className="login-hero-overlay" />
        <div className="login-hero-content">

          {/* Back to home */}
          <button className="login-hero-back" onClick={() => navigate('/')}>
            <ChevronLeft size={16} />
            Back to Home
          </button>

          <div className="login-hero-badge">
            <Truck size={13} />
            Live Safety Network
          </div>
          <h1 className="login-hero-title">
            Drive Safe.<br /><span>Stay Connected.</span>
          </h1>
          <p className="login-hero-tagline">
            Real-time driver safety network — report hazards, receive instant alerts,
            and get help when it matters most.
          </p>

          {/* Stats */}
          <div className="login-hero-stats">
            <div className="lhs-item">
              <span className="lhs-num">5km</span>
              <span className="lhs-label">Alert Radius</span>
            </div>
            <div className="lhs-item">
              <span className="lhs-num">Live</span>
              <span className="lhs-label">SOS Alerts</span>
            </div>
            <div className="lhs-item">
              <span className="lhs-num">6</span>
              <span className="lhs-label">Issue Types</span>
            </div>
          </div>

          {/* Social proof */}
          <div className="login-hero-proof">
            <div className="proof-avatars">
              {['U','D','K'].map((l,i) => (
                <div className="proof-av" key={i} style={{ zIndex: 3 - i }}>{l}</div>
              ))}
            </div>
            <span>1,000+ drivers already connected</span>
            <div className="proof-stars">
              {[1,2,3,4,5].map(i => <Star size={10} key={i} fill="#f59e0b" color="#f59e0b"/>)}
            </div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="login-right">
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Logo */}
          <div className="login-logo-wrap">
            <div className="login-logo">
              <Truck size={26} />
            </div>
          </div>
          <h1 className="login-title">Truck Alert</h1>
          <p className="login-sub">Driver Safety Network</p>

          {step === 'phone' && (
            <>
              <div className="login-toggle">
                <button
                  className={`toggle-btn ${isRegister ? 'active' : ''}`}
                  onClick={() => { setIsRegister(true); setError(''); }}
                >
                  Register
                </button>
                <button
                  className={`toggle-btn ${!isRegister ? 'active' : ''}`}
                  onClick={() => { setIsRegister(false); setError(''); }}
                >
                  Login
                </button>
              </div>

              <form onSubmit={handlePhoneNext} className="login-form">
                <p className="step-label">Enter your phone number</p>
                <div className="login-input-wrap">
                  <Phone size={16} className="login-input-icon" />
                  <input
                    className="login-input login-input-padded"
                    placeholder="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={15}
                    autoFocus
                  />
                </div>
                {error && <p className="login-error">{error}</p>}
                <button className="login-btn" type="submit" disabled={loading}>
                  {loading ? (
                    <span className="btn-spinner" />
                  ) : (
                    <>
                      {isRegister ? 'Next Step' : 'Sign In'}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 'details' && (
            <form onSubmit={handleRegister} className="login-form">
              <p className="step-label">Complete your profile</p>
              <div className="login-input-wrap">
                <Users size={16} className="login-input-icon" />
                <input
                  className="login-input login-input-padded"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoFocus
                />
              </div>
              <div className="login-input-wrap">
                <Truck size={16} className="login-input-icon" />
                <input
                  className="login-input login-input-padded"
                  placeholder="Truck Number (e.g. MH12AB1234)"
                  value={form.truckNumber}
                  onChange={(e) => setForm({ ...form, truckNumber: e.target.value.toUpperCase() })}
                />
              </div>
              {error && <p className="login-error">{error}</p>}
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? (
                  <span className="btn-spinner" />
                ) : (
                  <>
                    Join Network
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
              <div className="login-links">
                <button type="button" className="link-btn" onClick={reset}>
                  <ChevronLeft size={14} /> Change number
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
