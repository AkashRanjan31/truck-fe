import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Truck, Phone, CreditCard, Star, MapPin, Lock } from 'lucide-react';
import { getProfile, updateDriverProfile } from '../../services/userService';
import ProfileCard from '../../components/profile/ProfileCard';
import DriverInfo from '../../components/profile/DriverInfo';
import Loader from '../../components/common/Loader';
import useAuth from '../../hooks/useAuth';
import { getAllStates } from '../../utils/indiaStates';
import { formatDate } from '../../utils/formatDate';
import api from '../../services/api';

const STATES = getAllStates();

// ── Verification status banner ───────────────────────────────────────────────
const VERIFICATION_BANNERS = {
  pending: {
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    icon: '\u23f3',
    title: 'Pending Verification',
    text: 'text-yellow-400',
  },
  approved: {
    bg: 'bg-green-500/10 border-green-500/30',
    icon: '\u2705',
    title: 'Verified by State Admin',
    text: 'text-green-400',
  },
  rejected: {
    bg: 'bg-red-500/10 border-red-500/30',
    icon: '\u274c',
    title: 'Account Rejected',
    text: 'text-red-400',
  },
  correction_required: {
    bg: 'bg-blue-500/10 border-blue-500/30',
    icon: '\u26a0\ufe0f',
    title: 'Correction Required',
    text: 'text-blue-400',
  },
};

const VerificationBanner = ({ driver }) => {
  if (!driver) return null;
  const cfg = VERIFICATION_BANNERS[driver.verificationStatus];
  if (!cfg) return null;

  const msg = driver.verificationStatus === 'pending'
    ? 'Your account is waiting for approval from your State Admin. You will be notified once reviewed.'
    : driver.verificationStatus === 'approved'
    ? `Approved${driver.verifiedAt ? ' on ' + formatDate(driver.verifiedAt) : ''}. You have full access to all features.`
    : driver.verificationStatus === 'rejected'
    ? (driver.rejectionReason || 'Your account was not approved. Please contact your State Admin.')
    : (driver.correctionMessage || 'Your State Admin has requested changes to your profile. Please update your details.');

  return (
    <div className={`rounded-2xl border p-4 flex gap-3 ${cfg.bg}`}>
      <span className="text-2xl shrink-0">{cfg.icon}</span>
      <div>
        <p className={`font-bold text-sm ${cfg.text}`}>{cfg.title}</p>
        <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{msg}</p>
      </div>
    </div>
  );
};

// ── Reusable field components ────────────────────────────────────────────────
const Field = ({ label, icon: Icon, children, locked }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
      {label}
      {locked && <Lock className="w-3 h-3 text-slate-600" />}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />}
      {children}
    </div>
  </div>
);

const EditInput = ({ icon: Icon, label, type = 'text', value, onChange, placeholder, locked, min }) => (
  <Field label={label} icon={Icon} locked={locked}>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={locked}
      min={min}
      className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 rounded-xl text-sm outline-none transition-all
        ${locked
          ? 'bg-slate-800/50 border border-slate-700 text-slate-500 cursor-not-allowed'
          : 'bg-slate-900 border border-slate-600 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
        }`}
    />
  </Field>
);

// ── Edit Profile Modal ───────────────────────────────────────────────────────
const EditProfileModal = ({ data, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name:          data?.user?.name          || '',
    phone:         data?.user?.phone         || '',
    vehicleNumber: data?.driver?.vehicleNumber || '',
    licenseNumber: data?.driver?.licenseNumber || '',
    experience:    data?.driver?.experience   ?? '',
    homeStateCode: data?.driver?.homeStateCode || data?.driver?.homeState?.code || '',
  });
  const [saving, setSaving] = useState(false);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim())  return toast.error('Name is required');
    if (!form.phone.trim()) return toast.error('Phone is required');
    if (!form.vehicleNumber.trim()) return toast.error('Vehicle number is required');

    setSaving(true);
    try {
      await updateDriverProfile({
        name:          form.name.trim(),
        phone:         form.phone.trim(),
        vehicleNumber: form.vehicleNumber.trim().toUpperCase(),
        licenseNumber: form.licenseNumber.trim(),
        experience:    form.experience,
        homeStateCode: form.homeStateCode,
      });
      toast.success('Profile updated successfully!');
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <div>
            <h2 className="font-black text-white text-base">Edit Profile</h2>
            <p className="text-slate-500 text-xs mt-0.5">Update your personal details</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Driver ID — read only */}
          <EditInput
            label="Driver ID (system-generated)"
            value={data?.driver?.driverId || '—'}
            locked
          />

          <EditInput icon={Phone} label="Full Name *" value={form.name}
            onChange={set('name')} placeholder="Your full name" />

          <EditInput icon={Phone} label="Phone Number *" type="tel" value={form.phone}
            onChange={set('phone')} placeholder="10-digit mobile number" />

          <EditInput icon={Truck} label="Vehicle Number *" value={form.vehicleNumber}
            onChange={set('vehicleNumber')} placeholder="e.g. MH12AB1234" />

          {/* Home State */}
          <Field label="Home State" icon={MapPin}>
            <select
              value={form.homeStateCode}
              onChange={set('homeStateCode')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-900 border border-slate-600 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none appearance-none"
            >
              <option value="">Select state</option>
              {STATES.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </Field>

          <EditInput icon={CreditCard} label="License Number" value={form.licenseNumber}
            onChange={set('licenseNumber')} placeholder="DL-XXXXXXXXXX" />

          <EditInput icon={Star} label="Experience (years)" type="number" min="0"
            value={form.experience} onChange={set('experience')} placeholder="0" />

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-600 text-slate-300 hover:bg-slate-700 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#ea580c,#f97316)' }}>
              {saving
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>,
    document.body
  );
};

// ── Profile Page ─────────────────────────────────────────────────────────────
const ProfilePage = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [pwForm, setPwForm]   = useState({ password: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const { logoutUser } = useAuth();

  const loadProfile = useCallback(() => {
    setLoading(true);
    getProfile()
      .then(({ data }) => setData(data.data))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (pwForm.password !== pwForm.confirm) return toast.error('Passwords do not match');
    if (pwForm.password.length < 6) return toast.error('Minimum 6 characters');
    setPwLoading(true);
    try {
      await api.put('/users/profile', { password: pwForm.password });
      toast.success('Password set successfully');
      setPwForm({ password: '', confirm: '' });
    } catch {
      toast.error('Failed to set password');
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <Loader size="lg" text="Loading profile..." />
    </div>
  );

  return (
    <>
      <div className="p-4 max-w-lg mx-auto space-y-4 pb-8">
        <h1 className="text-2xl font-black text-white">Profile</h1>

        <VerificationBanner driver={data?.driver} />

        <ProfileCard
          user={data?.user}
          driver={data?.driver}
          onEdit={() => setEditOpen(true)}
        />

        <DriverInfo driver={data?.driver} />

        {/* Set Password */}
        <div className="card">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <span>🔐</span> Set Password
          </h3>
          <form onSubmit={handleSetPassword} className="space-y-3">
            <input type="password" className="input-field"
              placeholder="New password (min 6 chars)"
              value={pwForm.password}
              onChange={(e) => setPwForm({ ...pwForm, password: e.target.value })}
              required minLength={6} />
            <input type="password" className="input-field"
              placeholder="Confirm password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
              required />
            <button type="submit" disabled={pwLoading} className="btn-primary w-full">
              {pwLoading ? 'Saving...' : 'Set Password'}
            </button>
          </form>
        </div>

        {/* About */}
        <div className="card">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            <span>ℹ️</span> About TruckAlert
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            TruckAlert is India's real-time truck driver safety network. Report road hazards,
            request emergency help, and stay informed about alerts in your current state. 🚛
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <span>Version 1.0.0</span><span>·</span><span>© 2024 TruckAlert</span>
          </div>
        </div>

        <button onClick={logoutUser}
          className="btn-danger w-full flex items-center justify-center gap-2">
          <span>🚪</span> Logout
        </button>
      </div>

      {/* Edit Modal — rendered via portal on document.body */}
      <AnimatePresence>
        {editOpen && (
          <EditProfileModal
            data={data}
            onClose={() => setEditOpen(false)}
            onSaved={loadProfile}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfilePage;
