import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStateStats } from '../../services/adminService';
import { getPendingDrivers } from '../../services/adminService';
import useReports from '../../hooks/useReports';
import HistoryTable from '../../components/history/HistoryTable';
import { SkeletonStats, SkeletonTable, ErrorState } from '../../components/common/Skeletons';
import useAuth from '../../hooks/useAuth';

const StateAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats]         = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError]     = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const { reports, loading: reportsLoading, refetch } = useReports('all');

  const stateId = user?.state?._id || user?.state;

  const loadStats = useCallback(() => {
    if (!stateId) return;
    setStatsLoading(true);
    setStatsError(null);
    Promise.all([
      getStateStats(stateId),
      getPendingDrivers({ status: 'pending', limit: 1 }),
    ])
      .then(([s, p]) => {
        setStats(s.data.data?.stats);
        setPendingCount(p.data.data?.total || 0);
      })
      .catch((err) => setStatsError(err.response?.data?.message || 'Failed to load stats'))
      .finally(() => setStatsLoading(false));
  }, [stateId]);

  useEffect(() => { loadStats(); }, [loadStats]);

  const cards = stats ? [
    { label: 'Trucks in State', value: stats.trucksInState,  icon: '🚛', color: 'text-blue-400'   },
    { label: 'Total Reports',   value: stats.reportsInState, icon: '📋', color: 'text-orange-400' },
    { label: 'Active Alerts',   value: stats.activeAlerts,   icon: '🚨', color: 'text-red-400'    },
    { label: 'Active Drivers',  value: stats.activeDrivers,  icon: '👤', color: 'text-green-400'  },
    { label: 'Resolved',        value: stats.resolvedInState,icon: '✅', color: 'text-green-400'  },
    { label: 'Resolution Rate', value: `${stats.resolutionRate}%`, icon: '📊', color: 'text-yellow-400' },
  ] : [];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white">State Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">{user?.state?.name || 'Your State'}</p>
        </div>
        <button onClick={loadStats} className="btn-secondary text-sm py-2">
          🔄 Refresh
        </button>
      </div>

      {/* Pending verification alert */}
      {pendingCount > 0 && (
        <button
          onClick={() => navigate('/admin/verify-drivers')}
          className="w-full card border-yellow-500/30 bg-yellow-500/5 text-left hover:border-yellow-500/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="font-bold text-yellow-400 text-sm">
                {pendingCount} driver{pendingCount !== 1 ? 's' : ''} awaiting verification
              </p>
              <p className="text-slate-400 text-xs mt-0.5">Click to review and approve pending drivers →</p>
            </div>
          </div>
        </button>
      )}

      {/* Stats */}
      {statsLoading ? (
        <SkeletonStats count={6} />
      ) : statsError ? (
        <ErrorState message={statsError} onRetry={loadStats} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {cards.map(({ label, value, icon, color }) => (
            <div key={label} className="card text-center p-4 hover:border-slate-600 transition-colors">
              <p className="text-2xl mb-1" role="img" aria-label={label}>{icon}</p>
              <p className={`text-xl font-black ${color} tabular-nums`}>{value}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent Reports */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white">Recent Reports</h2>
          <button onClick={() => navigate('/admin/reports')} className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
            View all →
          </button>
        </div>
        {reportsLoading
          ? <SkeletonTable rows={4} cols={5} />
          : <HistoryTable reports={reports.slice(0, 10)} onRefresh={refetch} showActions />
        }
      </div>
    </div>
  );
};

export default StateAdminDashboard;
