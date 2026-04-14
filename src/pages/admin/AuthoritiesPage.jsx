import { useState, useEffect, useCallback } from 'react';
import { getAllUsers, getAllStates } from '../../services/adminService';
import { createAuthority } from '../../services/authorityService';
import { toast } from 'react-toastify';
import { SkeletonCard, ErrorState } from '../../components/common/Skeletons';

const TYPES = ['police', 'highway_patrol', 'transport_dept', 'emergency', 'hospital'];

const AuthoritiesPage = () => {
  const [users, setUsers]   = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [form, setForm]     = useState({ name: '', userId: '', stateId: '', type: 'police', district: '', contactNumber: '', email: '' });
  const [adding, setAdding] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([getAllUsers(), getAllStates()])
      .then(([u, s]) => {
        setUsers(u.data.data.users || []);
        setStates(s.data.data || []);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Authority name is required');
    if (!form.stateId)     return toast.error('Please select a state');
    setAdding(true);
    try {
      await createAuthority({ ...form, user: form.userId || undefined, state: form.stateId });
      toast.success('Authority created successfully');
      setForm({ name: '', userId: '', stateId: '', type: 'police', district: '', contactNumber: '', email: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create authority');
    } finally { setAdding(false); }
  };

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-2xl">
      <h1 className="text-2xl font-black text-white">Manage Authorities</h1>

      {loading ? (
        <SkeletonCard rows={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <div className="card space-y-4">
          <h2 className="font-bold text-white">Add Authority / Police Station</h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <input className="input-field" placeholder="Authority / Station Name *"
              value={form.name} onChange={set('name')} required />

            <div className="grid grid-cols-2 gap-3">
              <select className="input-field" value={form.stateId} onChange={set('stateId')} required>
                <option value="">Select State *</option>
                {states.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <select className="input-field" value={form.type} onChange={set('type')}>
                {TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input className="input-field" placeholder="District" value={form.district} onChange={set('district')} />
              <input className="input-field" placeholder="Contact Number" value={form.contactNumber} onChange={set('contactNumber')} />
            </div>

            <input className="input-field" placeholder="Email" type="email" value={form.email} onChange={set('email')} />

            <select className="input-field" value={form.userId} onChange={set('userId')}>
              <option value="">Link to User Account (optional)</option>
              {users.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
            </select>

            <button type="submit" disabled={adding} className="btn-primary w-full">
              {adding ? 'Creating...' : '+ Create Authority'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AuthoritiesPage;
