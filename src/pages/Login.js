import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Phone, ArrowRight, ChevronLeft, Truck, Users, Star, Shield, MapPin, Building2 } from 'lucide-react';
import { useDriver } from '../context/DriverContext';
import { useAuthContext } from '../context/AuthContext';
import { loginWithRole, setToken } from '../services/api';
import './Login.css';

const ROLES = [
  { key: 'DRIVER',      label: 'Driver',       icon: Truck,      color: '#f59e0b', desc: 'Driver safety network' },
  { key: 'SUPER_ADMIN', label: 'Super Admin',  icon: Shield,     color: '#e74c3c', desc: 'Full system access' },
  { key: 'STATE_ADMIN', label: 'State Admin',  icon: MapPin,     color: '#3b82f6', desc: 'State-level management' },
  { key: 'AUTHORITY',   label: 'Authority',    icon: Building2,  color: '#22c55e', desc: 'Alert response team' },
];

export default function Login() {
  const { register, login: driverLogin } = useDriver();
  const { login: authLogin } = useAuthContext();
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState('DRIVER');
  const [isRegister, setIsRegister]  = useState(true);
  const [step, setStep]              = useState('phone');   // driver only
  const [phone, setPhone]            = useState('');
  const [form, setForm]              = useState({ name: '', truckNumber: '' });
  const [email, setEmail]            = useState('');
  const [password, setPassword]      = useState('');
  const [loading, setLoading]        = useState(false);
  const [error, setError]            = useState('');

  const reset = () => { setStep('phone'); setPhone(''); setEmail(''); setPassword(''); setError(''); };

  const switchRole = (role) => { setActiveRole(role); setError(''); reset(); };

  // ── Driver phone login (existing flow) ──────────────────────────────────────
  const handleDriverPhoneNext = (e) => {
    e.preventDefault();
    if (!phone.trim() || phone.trim().length < 10) return setError('Enter a valid phone number');
    setError('');
    if (isRegister) setStep('details');
    else handleDriverLogin();
  };

  const handleDriverLogin = async () => {
    setLoading(true); setError('');
    try { await driverLogin(phone.trim()); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleDriverRegister = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.truckNumber.trim()) return setError('All fields are required');
    setLoading(true); setError('');
    try { await register(form.name.trim(), phone.trim(), form.truckNumber.trim()); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  // ── Admin / Authority email+password login ────────────────────────────────
  const handleRoleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return setError('Email and password are required');
    setLoading(true); setError('');
    try {
      const { data } = await loginWithRole(email.trim(), password.trim());
      const { user, token, redirect } = data.data;

      // Store JWT and set axios header
      setToken(token);
      localStorage.setItem('authToken', token);

      // Store in AuthContext
      authLogin(user, token);

      // Redirect to role dashboard
      navigate(redirect || '/dashboard/super-admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roleInfo = ROLES.find((r) => r.key === activeRole);
  const RoleIcon = roleInfo.icon;

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
          <button className="login-hero-back" onClick={() => navigate('/')}>
            <ChevronLeft size={16} /> Back to Home
          </button>
          <div className="login-hero-badge">
            <Truck size={13} /> Live Safety Network
          </div>
          <h1 className="login-hero-title">
            Drive Safe.<br /><span>Stay Connected.</span>
          </h1>
          <p className="login-hero-tagline">
            Real-time driver safety network — report hazards, receive instant alerts,
            and get help when it matters most.
          </p>
          <div className="login-hero-stats">
            {[{ num: '5km', label: 'Alert Radius' }, { num: 'Live', label: 'SOS Alerts' }, { num: '4', label: 'Role Types' }].map((s) => (
              <div className="lhs-item" key={s.label}>
                <span className="lhs-num">{s.num}</span>
                <span className="lhs-label">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="login-hero-proof">
            <div className="proof-avatars">
              {['S', 'A', 'D'].map((l, i) => (
                <div className="proof-av" key={i} style={{ zIndex: 3 - i }}>{l}</div>
              ))}
            </div>
            <span>1,000+ users connected</span>
            <div className="proof-stars">
              {[1,2,3,4,5].map(i => <Star size={10} key={i} fill="#f59e0b" color="#f59e0b" />)}
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
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Logo */}
          <div className="login-logo-wrap">
            <div className="login-logo" style={{ borderColor: `${roleInfo.color}44`, background: `${roleInfo.color}18` }}>
              <RoleIcon size={26} color={roleInfo.color} />
            </div>
          </div>
          <h1 className="login-title">Truck Alert</h1>
          <p className="login-sub">{roleInfo.desc}</p>

          {/* Role Selector */}
          <div className="role-tabs">
            {ROLES.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.key}
                  className={`role-tab ${activeRole === r.key ? 'active' : ''}`}
                  style={activeRole === r.key ? { borderColor: r.color, color: r.color, background: `${r.color}18` } : {}}
                  onClick={() => switchRole(r.key)}
                >
                  <Icon size={14} />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* ── DRIVER FLOW ── */}
              {activeRole === 'DRIVER' && (
                <>
                  {step === 'phone' && (
                    <>
                      <div className="login-toggle">
                        <button className={`toggle-btn ${isRegister ? 'active' : ''}`}
                          onClick={() => { setIsRegister(true); setError(''); }}>Register</button>
                        <button className={`toggle-btn ${!isRegister ? 'active' : ''}`}
                          onClick={() => { setIsRegister(false); setError(''); }}>Login</button>
                      </div>
                      <form onSubmit={handleDriverPhoneNext} className="login-form">
                        <p className="step-label">Enter your phone number</p>
                        <div className="login-input-wrap">
                          <Phone size={16} className="login-input-icon" />
                          <input className="login-input login-input-padded" placeholder="Phone Number"
                            type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                            maxLength={15} autoFocus />
                        </div>
                        {error && <p className="login-error">{error}</p>}
                        <button className="login-btn" type="submit" disabled={loading}
                          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                          {loading ? <span className="btn-spinner" /> : <>{isRegister ? 'Next Step' : 'Sign In'}<ArrowRight size={16} /></>}
                        </button>
                      </form>
                    </>
                  )}

                  {step === 'details' && (
                    <form onSubmit={handleDriverRegister} className="login-form">
                      <p className="step-label">Complete your profile</p>
                      <div className="login-input-wrap">
                        <Users size={16} className="login-input-icon" />
                        <input className="login-input login-input-padded" placeholder="Full Name"
                          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
                      </div>
                      <div className="login-input-wrap">
                        <Truck size={16} className="login-input-icon" />
                        <input className="login-input login-input-padded" placeholder="Truck Number (e.g. MH12AB1234)"
                          value={form.truckNumber}
                          onChange={(e) => setForm({ ...form, truckNumber: e.target.value.toUpperCase() })} />
                      </div>
                      {error && <p className="login-error">{error}</p>}
                      <button className="login-btn" type="submit" disabled={loading}
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        {loading ? <span className="btn-spinner" /> : <>Join Network<ArrowRight size={16} /></>}
                      </button>
                      <div className="login-links">
                        <button type="button" className="link-btn" onClick={reset}>
                          <ChevronLeft size={14} /> Change number
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}

              {/* ── ADMIN / AUTHORITY FLOW ── */}
              {activeRole !== 'DRIVER' && (
                <form onSubmit={handleRoleLogin} className="login-form">
                  <p className="step-label">Sign in with your credentials</p>
                  <div className="login-input-wrap">
                    <Mail size={16} className="login-input-icon" />
                    <input className="login-input login-input-padded" placeholder="Email address"
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
                  </div>
                  <div className="login-input-wrap">
                    <Lock size={16} className="login-input-icon" />
                    <input className="login-input login-input-padded" placeholder="Password"
                      type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  {error && <p className="login-error">{error}</p>}
                  <button className="login-btn" type="submit" disabled={loading}
                    style={{ background: `linear-gradient(135deg, ${roleInfo.color}, ${roleInfo.color}cc)` }}>
                    {loading ? <span className="btn-spinner" /> : <>Sign In <ArrowRight size={16} /></>}
                  </button>

                  {/* Credential hints for dev */}
                  <div className="cred-hint">
                    {activeRole === 'SUPER_ADMIN' && <><span>📧</span> admin@trucks.com · admin123</>}
                    {activeRole === 'STATE_ADMIN'  && <><span>📧</span> stateadmin.mh@trucks.com · StateAdmin@123</>}
                    {activeRole === 'AUTHORITY'    && <><span>📧</span> authority.mumbai@trucks.com · Authority@123</>}
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
