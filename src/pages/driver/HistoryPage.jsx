import { useState } from 'react';
import useReports from '../../hooks/useReports';
import HistoryCard from '../../components/history/HistoryCard';
import { SkeletonCard, EmptyState, ErrorState } from '../../components/common/Skeletons';
import { Filter } from 'lucide-react';

const STATUSES   = ['pending', 'in_review', 'forwarded', 'accepted', 'resolved', 'closed'];
const CATEGORIES = ['police_harassment', 'roadside_extortion', 'accident', 'breakdown', 'poor_road', 'cargo_theft', 'other'];

const HistoryPage = () => {
  const [filters, setFilters] = useState({ status: '', issueType: '' });
  const { reports, loading, error, pagination, refetch } = useReports('my', filters);

  const set = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));
  const hasFilters = filters.status || filters.issueType;

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto pb-10">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          📜 My Reports
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {pagination.total > 0 ? `${pagination.total} report${pagination.total !== 1 ? 's' : ''} found` : 'Your submitted reports'}
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-300">Filter Reports</span>
          {hasFilters && (
            <button
              onClick={() => setFilters({ status: '', issueType: '' })}
              className="ml-auto text-xs text-orange-400 hover:text-orange-300 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            className="input-field flex-1 min-w-[140px] py-2 text-sm"
            value={filters.status}
            onChange={set('status')}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <select
            className="input-field flex-1 min-w-[140px] py-2 text-sm"
            value={filters.issueType}
            onChange={set('issueType')}
          >
            <option value="">All Types</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} rows={2} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => refetch()} />
      ) : reports.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No reports found"
          message={hasFilters ? 'Try clearing your filters to see all reports.' : 'You have not submitted any reports yet.'}
          action={hasFilters ? { label: 'Clear Filters', onClick: () => setFilters({ status: '', issueType: '' }) } : undefined}
        />
      ) : (
        <>
          <div className="space-y-3">
            {reports.map((r) => <HistoryCard key={r._id} report={r} />)}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6 flex-wrap">
              <button
                onClick={() => refetch(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn-secondary text-sm py-2 px-4 disabled:opacity-30"
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => refetch(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                    pagination.page === p
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => refetch(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="btn-secondary text-sm py-2 px-4 disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryPage;
