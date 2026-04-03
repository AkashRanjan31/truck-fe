import React, { useState } from 'react';
import { useDriver } from '../context/DriverContext';
import { changeDriverPassword } from '../services/api';
import AnimatedPage from '../components/ui/AnimatedPage';
import { Truck, Phone, Hash, Calendar, Key, LogOut } from 'lucide-react';
import './ProfilePage.css';

export default function ProfilePage() {
  const { driver, logout } = useDriver();
  const [showChangePass, setShowChangePass] = useState(false);
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);
  const [saving, setSaving] = useState(false);

  const confirmLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) logout();
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErr(''); setOk(false);
    if (form.next !== form.confirm) return setErr('New passwords do not match');
    if (form.next.length < 4) return setErr('Password must be at least 4 characters');
    setSaving(true);
    try {
      await changeDriverPassword(driver._id, form.current || undefined, form.next);
      setOk(true);
      setForm({ current: '', next: '', confirm: '' });
      setTimeout(() => { setShowChangePass(false); setOk(false); }, 1500);
    } catch (err) {
      setErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatedPage>
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar"><Truck size={30} /></div>
        </div>
        <h2 className="profile-name">{driver?.name}</h2>
        <p className="profile-truck">{driver?.truckNumber}</p>

        <div className="profile-info">
          {[
            [<Phone size={13}/>, 'Phone', driver?.phone],
            [<Hash size={13}/>, 'Driver ID', driver?._id?.slice(-8).toUpperCase()],
            [<Calendar size={13}/>, 'Joined', driver?.createdAt ? new Date(driver.createdAt).toLocaleDateString() : '—'],
          ].map(([icon, label, value]) => (
            <div key={label} className="info-row">
              <span className="info-label">{icon} {label}</span>
              <span className="info-value">{value}</span>
            </div>
          ))}
        </div>

        <button className="change-pass-btn" onClick={() => { setShowChangePass(!showChangePass); setErr(''); setOk(false); }}>
          <Key size={14} style={{marginRight:6}}/>{driver?.password ? 'Change Password' : 'Set Password'}
        </button>

        {showChangePass && (
          <form className="change-pass-form" onSubmit={handleChangePassword}>
            {driver?.password && (
              <input className="pass-input" type="password" placeholder="Current password"
                value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} autoFocus />
            )}
            <input className="pass-input" type="password" placeholder="New password (min 4 chars)"
              value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} />
            <input className="pass-input" type="password" placeholder="Confirm new password"
              value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
            {err && <p className="pass-err">{err}</p>}
            {ok && <p className="pass-ok">✅ Password updated!</p>}
            <button className="pass-submit-btn" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Password'}
            </button>
          </form>
        )}

        <div className="about-card">
          <h4>About Truck Alert</h4>
          <p>A safety network for truck drivers. Report issues, warn fellow drivers, and get help when you need it most.</p>
        </div>

        <button className="logout-btn" onClick={confirmLogout}><LogOut size={14} style={{marginRight:6}}/>Sign Out</button>
      </div>
    </div>
    </AnimatedPage>
  );
}
