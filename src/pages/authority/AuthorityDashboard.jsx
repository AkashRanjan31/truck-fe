import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboard, updateAvailability } from '../../services/authorityService';
import { toast } from 'react-toastify';
import { SkeletonStats, ErrorState } from '../../components/common/Skeletons';

const StatCard = ({ label, value, icon, color }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-black text-white tabular-nums">{value ?? '—'}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  </div>
);

const AuthorityDashboard = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const navigate = useNavigate();

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getDashboard()
      .then(({ data }) => setData(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAvailability = async () => {
    if (!data?.authority) return;
    try {
      const next = !data.authority.isAvailable;
      await updateAvailability(next);
      setData((d) => ({ ...d, authority: { ...d.authority, isAvailable: next } }));
      toast.success(`You are now ${next ? 'available' : 'unavailable'}`);
    } catch { toast.error('Failed to update availability'); }
  };

  const { authority, stats } = data || {};

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white">Authority Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            {authority?.name
              ? `${authority.name} · ${authority.state?.name} (${authority.state?.code})`
              : 'Loading...'}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-secondary text-sm py-2">🔄</button>
          {authority && (
            <button
              onClick={handleAvailability}
              className={`px-4 py-2 rounded-xl font-semibold text-sm border transition-all ${
                authority.isAvailable
                  ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                  : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30'
              }`}
            >
              {authority.isAvailable ? '🟢 Available' : '🔴 Unavailable'}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <SkeletonStats count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label="Total Reports"  value={stats?.totalReports}   icon="📋" color="bg-orange-500/10" />
            <StatCard label="Pending"        value={stats?.pendingReports}  icon="⏳" color="bg-yellow-500/10" />
            <StatCard label="Resolved"       value={stats?.resolvedReports} icon="✅" color="bg-green-500/10"  />
            <StatCard label="Active Alerts"  value={stats?.activeAlerts}    icon="🚨" color="bg-red-500/10"    />
            <StatCard label="Active Drivers" value={stats?.activeDrivers}   icon="🚛" color="bg-blue-500/10"   />
            <StatCard label="Assigned to Me" value={stats?.assignedToMe}    icon="📌" color="bg-purple-500/10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'View Drivers',    desc: 'All drivers in your state', icon: '🚛', path: '/authority/drivers',    color: 'border-blue-500/30 hover:bg-blue-500/10' },
              { label: 'View Reports',    desc: 'All reports in your state', icon: '📋', path: '/authority/reports',    color: 'border-orange-500/30 hover:bg-orange-500/10' },
              { label: 'Assigned Alerts', desc: 'Alerts assigned to you',    icon: '🚨', path: '/authority/alerts',     color: 'border-red-500/30 hover:bg-red-500/10' },
            ].map(({ label, desc, icon, path, color }) => (
              <button key={path} onClick={() => navigate(path)}
                className={`card text-left border transition-all ${color}`}>
                <span className="text-3xl">{icon}</span>
                <p className="font-bold text-white mt-2">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AuthorityDashboard;
