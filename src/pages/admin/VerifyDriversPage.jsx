import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, ChevronDown, X, Loader2 } from 'lucide-react';
import { getPendingDrivers, verifyDriver } from '../../services/adminService';
import { formatDate, timeAgo } from '../../utils/formatDate';
import Loader from '../../components/common/Loader';

// ── Status badge ─────────────────────────────────────────────────────────────
const STATUS = {
  pending:            { label: 'Pending',            color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  approved:           { label: 'Approved',           color: 'bg-green-500/15  text-green-400  border-green-500/30'  },
  rejected:           { label: 'Rejected',           color: 'bg-red-500/15    text-red-400    border-red-500/30'    },
  correction_required:{ label: 'Correction Needed',  color: 'bg-blue-500/15   text-blue-400   border-blue-500/30'   },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS[status] || STATUS.pending;
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

// ── Action Modal ─────────────────────────────────────────────────────────────
const ActionModal = ({ driver, onClose, onDone }) => {
  const [action, setAction]   = useState('approved');
  const [reason, setReason]   = useState('');
  const [saving, setSaving]   = useState(false);

  const needsReason = action === 'rejected' || action === 'correction_required';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (needsReason && !reason.trim())
      return toast.error('Please provide a reason');
    setSaving(true);
    try {
      await verifyDriver(driver._id, action, reason.trim());
      toast.success(`Driver ${action.replace('_', ' ')} successfully`);
      onDone();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setSaving(false);
    }
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
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <div>
            <h2 className="font-black text-white text-base">Verify Driver</h2>
            <p className="text-slate-500 text-xs mt-0.5">{driver.user?.name} · {driver.driverId || '—'}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Action selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Action</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'approved',            label: 'Approve',   Icon: CheckCircle, active: 'bg-green-500/15 border-green-500 text-green-400', inactive: 'border-slate-600 text-slate-400 hover:border-green-500/50' },
                { value: 'rejected',            label: 'Reject',    Icon: XCircle,     active: 'bg-red-500/15   border-red-500   text-red-400',   inactive: 'border-slate-600 text-slate-400 hover:border-red-500/50'   },
                { value: 'correction_required', label: 'Correct',   Icon: AlertTriangle,active:'bg-blue-500/15  border-blue-500  text-blue-400',  inactive: 'border-slate-600 text-slate-400 hover:border-blue-500/50'  },
              ].map(({ value, label, Icon, active, inactive }) => (
                <button key={value} type="button" onClick={() => setAction(value)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-semibold transition-all ${action === value ? active : inactive}`}>
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
              {action === 'correction_required' ? 'Correction Message' : 'Reason'}
              {needsReason && <span className="text-red-400 ml-1">*</span>}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                action === 'approved' ? 'Optional note...' :
                action === 'rejected' ? 'Reason for rejection...' :
                'Describe what needs to be corrected...'
              }
              rows={3}
              className="w-full bg-slate-900 border border-slate-600 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 resize-none placeholder-slate-600"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-600 text-slate-300 hover:bg-slate-700 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
                action === 'approved' ? 'bg-green-600 hover:bg-green-500' :
                action === 'rejected' ? 'bg-red-600 hover:bg-red-500' :
                'bg-blue-600 hover:bg-blue-500'
              }`}>
              {saving
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                : `Confirm ${action === 'correction_required' ? 'Request' : action.charAt(0).toUpperCase() + action.slice(1)}`}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>,
    document.body
  );
};

// ── Driver Card ───────────────────────────────────────────────────────────────
const DriverCard = ({ driver, onAction }) => {
  const [expanded, setExpanded] = useState(false);
  const u = driver.user || {};

  return (
    <div className="card space-y-3">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center font-bold text-white text-base shrink-0">
            {u.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white truncate">{u.name}</p>
            <p className="text-xs text-slate-400 truncate">{u.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={driver.verificationStatus} />
          <button onClick={() => setExpanded(v => !v)}
            className="text-slate-500 hover:text-white transition-colors">
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick info */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <span className="text-slate-500">Phone: <span className="text-slate-300">{u.phone || '—'}</span></span>
        <span className="text-slate-500">Driver ID: <span className="text-orange-400 font-mono">{driver.driverId || '—'}</span></span>
        <span className="text-slate-500">Vehicle: <span className="text-slate-300">{driver.vehicleNumber || '—'}</span></span>
        <span className="text-slate-500">State: <span className="text-slate-300">{driver.homeState?.name || '—'}</span></span>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-700/60 pt-3 space-y-1.5 text-xs">
            <Row label="License No."  value={driver.licenseNumber || '—'} />
            <Row label="Experience"   value={`${driver.experience || 0} years`} />
            <Row label="Joined"       value={formatDate(u.createdAt)} />
            <Row label="Registered"   value={timeAgo(driver.createdAt)} />
            {driver.rejectionReason && (
              <div className="mt-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 font-semibold">Rejection reason:</p>
                <p className="text-red-300 mt-0.5">{driver.rejectionReason}</p>
              </div>
            )}
            {driver.correctionMessage && (
              <div className="mt-2 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-blue-400 font-semibold">Correction requested:</p>
                <p className="text-blue-300 mt-0.5">{driver.correctionMessage}</p>
              </div>
            )}
            {driver.verifiedBy && (
              <Row label="Reviewed by" value={driver.verifiedBy?.name || '—'} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action button */}
      <button onClick={() => onAction(driver)}
        className="w-full py-2 rounded-xl text-xs font-bold border border-orange-500/40 text-orange-400 hover:bg-orange-500/10 transition-all">
        Review & Decide
      </button>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-slate-500">{label}:</span>
    <span className="text-slate-300 font-medium">{value}</span>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const VerifyDriversPage = () => {
  const [drivers, setDrivers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('pending');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [selected, setSelected] = useState(null);

  const load = useCallback((page = 1, status) => {
    const activeStatus = status ?? filter;
    setLoading(true);
    getPendingDrivers({ status: activeStatus, page, limit: 15 })
      .then(({ data }) => {
        setDrivers(data.data.drivers || []);
        setPagination({ page: data.data.page || 1, pages: data.data.pages || 1, total: data.data.total || 0 });
      })
      .catch(() => toast.error('Failed to load drivers'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { load(1, filter); }, [filter, load]);

  const tabs = [
    { value: 'pending',             label: 'Pending',   color: 'text-yellow-400' },
    { value: 'approved',            label: 'Approved',  color: 'text-green-400'  },
    { value: 'rejected',            label: 'Rejected',  color: 'text-red-400'    },
    { value: 'correction_required', label: 'Correction',color: 'text-blue-400'   },
  ];

  return (
    <>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            🪪 Driver Verification
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review and verify driver accounts from your state · {pagination.total} total
          </p>
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-slate-800 border border-slate-700 w-fit">
          {tabs.map(({ value, label, color }) => (
            <button key={value} onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === value
                  ? `bg-slate-700 ${color}`
                  : 'text-slate-500 hover:text-slate-300'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-16"><Loader text="Loading drivers..." /></div>
        ) : drivers.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-slate-400 font-medium">No {filter.replace('_', ' ')} drivers</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {drivers.map((d) => (
              <DriverCard key={d._id} driver={d} onAction={setSelected} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: pagination.pages }, (_, i) => (
              <button key={i} onClick={() => load(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                  pagination.page === i + 1 ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action modal */}
      <AnimatePresence>
        {selected && (
          <ActionModal
            driver={selected}
            onClose={() => setSelected(null)}
            onDone={() => load(pagination.page)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default VerifyDriversPage;
