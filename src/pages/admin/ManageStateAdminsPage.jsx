import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Copy, CheckCircle, XCircle, Mail, Search } from 'lucide-react';
import { getAllStates, assignStateAdminByEmail } from '../../services/adminService';
import Loader from '../../components/common/Loader';

// ── Copy to clipboard helper ─────────────────────────────────────────────────
const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} title="Copy"
      className="text-slate-500 hover:text-orange-400 transition-colors shrink-0">
      {copied
        ? <CheckCircle className="w-3.5 h-3.5 text-green-400" />
        : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};

// ── Assign Modal ─────────────────────────────────────────────────────────────
const AssignModal = ({ state, onClose, onSaved }) => {
  const [email, setEmail] = useState(state.admin?.email || '');
  const [name,  setName]  = useState(state.admin?.name  || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Email is required');
    setSaving(true);
    try {
      await assignStateAdminByEmail(state._id, { email: email.trim(), name: name.trim() });
      toast.success(`Admin assigned to ${state.name}`);
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign admin');
    } finally {
      setSaving(false);
    }
  };

  // Suggest the alias email
  const suggestEmail = () => {
    const base = 'truckalert513';
    const code = state.code.toLowerCase();
    setEmail(`${base}+${code}@gmail.com`);
    if (!name) setName(`${state.name} State Admin`);
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <div>
            <h2 className="font-black text-white text-base">Assign State Admin</h2>
            <p className="text-slate-500 text-xs mt-0.5">{state.name} ({state.code})</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Admin Email *</label>
              <button type="button" onClick={suggestEmail}
                className="text-[10px] text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                Use alias suggestion
              </button>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`truckalert513+${state.code.toLowerCase()}@gmail.com`}
              className="w-full bg-slate-900 border border-slate-600 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-orange-500"
              required
            />
            <p className="text-[10px] text-slate-600 mt-1">
              Gmail alias tip: <span className="text-slate-500">yourname+{state.code.toLowerCase()}@gmail.com</span> delivers to your main inbox
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`${state.name} State Admin`}
              className="w-full bg-slate-900 border border-slate-600 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-600 text-slate-300 hover:bg-slate-700 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#ea580c,#f97316)' }}>
              {saving
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                : <><Save className="w-4 h-4" /> Assign Admin</>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>,
    document.body
  );
};

// ── State Row ────────────────────────────────────────────────────────────────
const StateRow = ({ state, index, onAssign }) => {
  const hasAdmin = !!state.admin;
  const isActive = state.admin?.isActive;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
    >
      {/* # */}
      <td className="py-3 px-4 text-slate-500 text-xs w-10">{index + 1}</td>

      {/* State */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-orange-500/15 text-orange-400 border border-orange-500/20">
            {state.code}
          </span>
          <span className="text-white font-semibold text-sm">{state.name}</span>
        </div>
      </td>

      {/* Admin Email */}
      <td className="py-3 px-4">
        {hasAdmin ? (
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-slate-300 text-xs font-mono truncate max-w-[200px]">
              {state.admin.email}
            </span>
            <CopyBtn text={state.admin.email} />
          </div>
        ) : (
          <span className="text-slate-600 text-xs italic">Not assigned</span>
        )}
      </td>

      {/* Login Email (same — shown for clarity) */}
      <td className="py-3 px-4">
        {hasAdmin ? (
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-xs truncate max-w-[180px]">{state.admin.name}</span>
          </div>
        ) : (
          <span className="text-slate-600 text-xs">—</span>
        )}
      </td>

      {/* Status */}
      <td className="py-3 px-4">
        {hasAdmin ? (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
            isActive
              ? 'bg-green-500/15 text-green-400 border-green-500/30'
              : 'bg-red-500/15 text-red-400 border-red-500/30'
          }`}>
            {isActive
              ? <><CheckCircle className="w-3 h-3" /> Active</>
              : <><XCircle className="w-3 h-3" /> Inactive</>}
          </span>
        ) : (
          <span className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-full font-semibold">
            ⚠ No Admin
          </span>
        )}
      </td>

      {/* Action */}
      <td className="py-3 px-4">
        <button onClick={() => onAssign(state)}
          className="text-xs px-3 py-1.5 rounded-lg font-semibold border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-all whitespace-nowrap">
          {hasAdmin ? 'Reassign' : 'Assign Admin'}
        </button>
      </td>
    </motion.tr>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const ManageStateAdminsPage = () => {
  const [states,   setStates]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getAllStates()
      .then(({ data }) => setStates(data.data || []))
      .catch(() => toast.error('Failed to load states'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = states.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  const assignedCount = states.filter((s) => s.admin).length;
  const activeCount   = states.filter((s) => s.admin?.isActive).length;

  return (
    <>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-white">State Admin Accounts</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage login accounts for all state admins
            </p>
          </div>
          {/* Summary chips */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-700 text-slate-300">
              {states.length} States
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-green-500/15 text-green-400 border border-green-500/20">
              {activeCount} Active
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">
              {states.length - assignedCount} Unassigned
            </span>
          </div>
        </div>

        {/* Login pattern info card */}
        <div className="card border-orange-500/20 bg-orange-500/5">
          <p className="text-sm font-bold text-orange-400 mb-2">📧 Gmail Alias Login Pattern</p>
          <p className="text-slate-400 text-xs leading-relaxed">
            All state admin accounts use Gmail aliases. OTPs for all aliases arrive in{' '}
            <span className="text-white font-mono">truckalert513@gmail.com</span>.
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { state: 'Jharkhand',   email: 'truckalert513+jh@gmail.com' },
              { state: 'Maharashtra', email: 'truckalert513+mh@gmail.com' },
              { state: 'Bihar',       email: 'truckalert513+br@gmail.com' },
            ].map(({ state, email }) => (
              <div key={state} className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2">
                <span className="text-slate-500 text-xs">{state}:</span>
                <span className="text-orange-400 text-xs font-mono truncate">{email}</span>
                <CopyBtn text={email} />
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search state or code..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 text-white text-sm rounded-xl outline-none focus:border-orange-500"
          />
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16"><Loader text="Loading states..." /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900/50">
                    <th className="table-header px-4 w-10">#</th>
                    <th className="table-header px-4">State</th>
                    <th className="table-header px-4">Login Email</th>
                    <th className="table-header px-4">Admin Name</th>
                    <th className="table-header px-4">Status</th>
                    <th className="table-header px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <StateRow key={s._id} state={s} index={i} onAssign={setSelected} />
                  ))}
                </tbody>
              </table>
              {!filtered.length && (
                <div className="text-center py-12">
                  <p className="text-slate-500">No states found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Full credentials list */}
        <div className="card">
          <h2 className="font-bold text-white mb-4">All State Admin Login Credentials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {states.map((s) => {
              const email = s.admin?.email || `truckalert513+${s.code.toLowerCase()}@gmail.com`;
              return (
                <div key={s._id}
                  className="flex items-center justify-between gap-2 bg-slate-900 rounded-xl px-3 py-2.5 border border-slate-700/50">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
                        {s.code}
                      </span>
                      <span className="text-white text-xs font-semibold truncate">{s.name}</span>
                    </div>
                    <p className="text-slate-500 text-[10px] font-mono mt-0.5 truncate">{email}</p>
                  </div>
                  <CopyBtn text={email} />
                </div>
              );
            })}
          </div>
          <p className="text-slate-600 text-xs mt-4 text-center">
            All OTPs arrive in <span className="text-slate-400 font-mono">truckalert513@gmail.com</span>
          </p>
        </div>
      </div>

      {/* Assign Modal */}
      <AnimatePresence>
        {selected && (
          <AssignModal
            state={selected}
            onClose={() => setSelected(null)}
            onSaved={load}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ManageStateAdminsPage;
