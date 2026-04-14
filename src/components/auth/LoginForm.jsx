import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Mail, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { sendOTP } from '../../services/authService';

const InputField = ({ Icon, label, type, placeholder, value, onChange, required }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200"
          style={{ color: focused ? '#f97316' : '#475569' }} />
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all duration-200"
          style={{
            background: 'rgba(15,23,42,0.8)',
            border: focused ? '1px solid rgba(249,115,22,0.6)' : '1px solid rgba(51,65,85,0.7)',
            boxShadow: focused ? '0 0 0 3px rgba(249,115,22,0.1)' : 'none',
          }} />
      </div>
    </div>
  );
};

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) return toast.error('Email is required');
    setLoading(true);
    try {
      await sendOTP(form.email, form.phone);
      toast.success('OTP sent to your Gmail!');
      navigate(`/verify-otp?email=${encodeURIComponent(form.email)}&type=login`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField Icon={Mail} label="Gmail ID" type="email" placeholder="your@gmail.com"
        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <InputField Icon={Phone} label="Phone Number" type="tel" placeholder="10-digit mobile number"
        value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

      {/* CTA */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02, boxShadow: '0 0 28px rgba(249,115,22,0.5)' }}
        whileTap={{ scale: 0.98 }}
        className="relative w-full py-3.5 rounded-xl font-bold text-sm text-white overflow-hidden mt-2"
        style={{
          background: loading
            ? 'rgba(249,115,22,0.5)'
            : 'linear-gradient(135deg,#ea580c 0%,#f97316 60%,#fb923c 100%)',
          boxShadow: '0 0 20px rgba(249,115,22,0.3)',
        }}
      >
        {/* Shimmer */}
        {!loading && (
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.15) 50%,transparent 60%)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
          />
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending OTP...</> : <>Next Step <ArrowRight className="w-4 h-4" /></>}
        </span>
      </motion.button>

      <p className="text-center text-xs text-slate-600">
        OTP will be sent to your Gmail address
      </p>
    </form>
  );
};

export default LoginForm;
