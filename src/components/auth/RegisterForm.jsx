import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { User, Mail, Phone, CreditCard, Star, Truck, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { register } from '../../services/authService';
import { getAllStates } from '../../utils/indiaStates';

const STATES = getAllStates(); // sorted array from indiaStates.js

const InputField = ({ Icon, label, type, placeholder, value, onChange, required, min }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200"
          style={{ color: focused ? '#f97316' : '#475569' }} />
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          required={required} min={min}
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

const SelectField = ({ Icon, label, value, onChange, required, children }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10"
          style={{ color: focused ? '#f97316' : '#475569' }} />
        <select value={value} onChange={onChange} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 appearance-none"
          style={{
            background: 'rgba(15,23,42,0.8)',
            border: focused ? '1px solid rgba(249,115,22,0.6)' : '1px solid rgba(51,65,85,0.7)',
            boxShadow: focused ? '0 0 0 3px rgba(249,115,22,0.1)' : 'none',
            color: value ? '#f1f5f9' : '#475569',
          }}>
          {children}
        </select>
      </div>
    </div>
  );
};

const RegisterForm = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    vehicleNumber: '', homeStateCode: '',
    licenseNumber: '', experience: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone)
      return toast.error('Name, email and phone are required');
    if (!form.homeStateCode)
      return toast.error('Please select your home state');
    if (!form.vehicleNumber)
      return toast.error('Vehicle number is required');

    setLoading(true);
    try {
      await register(form);
      toast.success('OTP sent to your Gmail!');
      navigate(`/verify-otp?email=${encodeURIComponent(form.email)}&type=register`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Required fields */}
      {[
        { key: 'name',  Icon: User,  label: 'Full Name',    type: 'text',  ph: 'John Doe',        req: true },
        { key: 'email', Icon: Mail,  label: 'Gmail ID',     type: 'email', ph: 'your@gmail.com',  req: true },
        { key: 'phone', Icon: Phone, label: 'Phone Number', type: 'tel',   ph: '10-digit number', req: true },
      ].map(({ key, Icon, label, type, ph, req }, i) => (
        <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}>
          <InputField Icon={Icon} label={label} type={type} placeholder={ph}
            value={form[key]} onChange={set(key)} required={req} />
        </motion.div>
      ))}

      {/* Vehicle Number */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}>
        <InputField Icon={Truck} label="Vehicle Number *" type="text"
          placeholder="e.g. MH12AB1234"
          value={form.vehicleNumber} onChange={set('vehicleNumber')} required />
        <p className="text-[10px] text-slate-600 mt-1 ml-1">Enter your truck's registration number</p>
      </motion.div>

      {/* Home State */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}>
        <SelectField Icon={MapPin} label="Home State *" value={form.homeStateCode}
          onChange={set('homeStateCode')} required>
          <option value="">Select your home state</option>
          {STATES.map((s) => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </SelectField>
        {form.homeStateCode && (
          <p className="text-[10px] text-orange-400/70 mt-1 ml-1">
            Your Driver ID will be: <span className="font-bold">{form.homeStateCode}-DR-XXXX</span>
          </p>
        )}
      </motion.div>

      {/* Optional fields */}
      {[
        { key: 'licenseNumber', Icon: CreditCard, label: 'License Number (optional)', type: 'text',   ph: 'DL-XXXXXXXXXX', req: false },
        { key: 'experience',    Icon: Star,       label: 'Experience (yrs)',           type: 'number', ph: '0',             req: false, min: '0' },
      ].map(({ key, Icon, label, type, ph, req, min }, i) => (
        <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}>
          <InputField Icon={Icon} label={label} type={type} placeholder={ph}
            value={form[key]} onChange={set(key)} required={req} min={min} />
        </motion.div>
      ))}

      <motion.button type="submit" disabled={loading}
        whileHover={{ scale: 1.02, boxShadow: '0 0 28px rgba(249,115,22,0.5)' }}
        whileTap={{ scale: 0.98 }}
        className="relative w-full py-3.5 rounded-xl font-bold text-sm text-white overflow-hidden mt-1"
        style={{
          background: loading ? 'rgba(249,115,22,0.5)' : 'linear-gradient(135deg,#ea580c 0%,#f97316 60%,#fb923c 100%)',
          boxShadow: '0 0 20px rgba(249,115,22,0.3)',
        }}>
        {!loading && (
          <motion.div className="absolute inset-0"
            style={{ background: 'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.15) 50%,transparent 60%)' }}
            animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }} />
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending OTP...</>
            : <>Create Account <ArrowRight className="w-4 h-4" /></>}
        </span>
      </motion.button>
    </form>
  );
};

export default RegisterForm;
