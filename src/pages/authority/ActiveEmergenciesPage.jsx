import { useState, useEffect, useCallback } from 'react';
import { getAllReports } from '../../services/reportService';
import { timeAgo } from '../../utils/formatDate';
import { SkeletonCard, EmptyState, ErrorState } from '../../components/common/Skeletons';

const ActiveEmergenciesPage = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getAllReports({ issueType: 'medical_emergency', status: 'pending' })
      .then(({ data }) => setEmergencies(data.data.reports || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load emergencies'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4 pb-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          🆘 Active Emergencies
        </h1>
        <button onClick={load} className="btn-secondary text-sm py-2">🔄 Refresh</button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} rows={2} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : emergencies.length === 0 ? (
        <EmptyState icon="✅" title="No active emergencies" message="There are no pending emergency reports in your jurisdiction." />
      ) : (
        <div className="space-y-3">
          {emergencies.map((e) => (
            <div key={e._id} className="card border-l-4 border-red-500 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-red-400 flex items-center gap-2">
                    <span className="animate-pulse">🆘</span> SOS Emergency
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{timeAgo(e.createdAt)}</p>
                </div>
                <span className="badge-critical">critical</span>
              </div>
              <p className="text-sm text-slate-300 line-clamp-3">{e.description}</p>
              {e.location?.address && (
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  📍 {e.location.address}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>👤 {e.driver?.name || '—'}</span>
                <span>📱 {e.driver?.phone || '—'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveEmergenciesPage;
