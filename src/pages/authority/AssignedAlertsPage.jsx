import { useState, useEffect, useCallback } from 'react';
import { getMyAssignedReports, updateAvailability } from '../../services/authorityService';
import { updateReportStatus } from '../../services/reportService';
import { toast } from 'react-toastify';
import { timeAgo } from '../../utils/formatDate';
import { SkeletonCard, EmptyState, ErrorState } from '../../components/common/Skeletons';

const AssignedAlertsPage = () => {
  const [reports, setReports]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [available, setAvailable] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getMyAssignedReports()
      .then(({ data }) => setReports(data.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load alerts'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAvailability = async () => {
    try {
      const next = !available;
      await updateAvailability(next);
      setAvailable(next);
      toast.success(`You are now ${next ? 'available' : 'unavailable'}`);
    } catch { toast.error('Failed to update availability'); }
  };

  const handleAction = async (id, status, remarks) => {
    try {
      await updateReportStatus(id, { status, remarks });
      toast.success('Updated successfully');
      load();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4 pb-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white">Assigned Alerts</h1>
          {!loading && !error && (
            <p className="text-slate-400 text-sm mt-1">{reports.length} active assignment{reports.length !== 1 ? 's' : ''}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-secondary text-sm py-2">🔄</button>
          <button onClick={handleAvailability}
            className={`text-sm px-4 py-2 rounded-xl font-semibold border transition-all ${
              available
                ? 'bg-green-500/10 text-green-400 border-green-500/30'
                : 'bg-red-500/10 text-red-400 border-red-500/30'
            }`}>
            {available ? '🟢 Available' : '🔴 Unavailable'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} rows={2} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : reports.length === 0 ? (
        <EmptyState icon="✅" title="No assigned alerts" message="You have no pending alerts assigned to you." />
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r._id} className="card space-y-3 border-l-4 border-orange-500">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-white capitalize">{r.issueType?.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{timeAgo(r.createdAt)}</p>
                </div>
                <span className={`badge-${r.priority}`}>{r.priority}</span>
              </div>
              <p className="text-sm text-slate-300 line-clamp-2">{r.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>👤 {r.driver?.name} · {r.driver?.phone}</span>
                <span>🗺️ {r.currentState?.name}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(r._id, 'accepted', 'Accepted by authority')}
                  disabled={r.status === 'accepted'}
                  className="flex-1 py-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 text-sm font-semibold hover:bg-blue-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Accept
                </button>
                <button
                  onClick={() => handleAction(r._id, 'resolved', 'Resolved by authority')}
                  disabled={r.status === 'resolved'}
                  className="flex-1 py-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/30 text-sm font-semibold hover:bg-green-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedAlertsPage;
