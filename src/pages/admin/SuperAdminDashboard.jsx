import { useState, useEffect } from 'react';
import { getStats } from '../../services/adminService';
import { SkeletonStats, ErrorState } from '../../components/common/Skeletons';

const StatCard = ({ label, value, icon, color, bg }) => (
  <div className="card flex items-center gap-4 hover:border-slate-600 transition-colors">
    <div className={`stat-icon ${bg}`}>
      <span role="img" aria-label={label}>{icon}</span>
    </div>
    <div className="min-w-0">
      <p className={`text-2xl font-black ${color} tabular-nums`}>{value ?? '—'}</p>
      <p className="text-sm text-slate-400 truncate">{label}</p>
    </div>
  </div>
);

const SuperAdminDashboard = () => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getStats()
      .then(({ data }) => setStats(data.data?.stats))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stats'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const cards = stats ? [
    { label: 'Total Reports',  value: stats.totalReports,   icon: '📋', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Active Alerts',  value: stats.activeAlerts,   icon: '🚨', color: 'text-red-400',    bg: 'bg-red-500/10'    },
    { label: 'Total Drivers',  value: stats.totalDrivers,   icon: '🚛', color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
    { label: 'Resolved',       value: stats.resolvedReports,icon: '✅', color: 'text-green-400',  bg: 'bg-green-500/10'  },
    { label: 'Total Trucks',   value: stats.totalTrucks,    icon: '🔧', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'States',         value: stats.totalStates,    icon: '🗺️', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Critical Alerts',value: stats.criticalAlerts, icon: '⚠️', color: 'text-red-400',    bg: 'bg-red-500/10'    },
  ] : [];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white">Super Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">All India overview</p>
        </div>
        <button onClick={load} className="btn-secondary text-sm py-2">
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <SkeletonStats count={7} />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cards.map((c) => <StatCard key={c.label} {...c} />)}
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
