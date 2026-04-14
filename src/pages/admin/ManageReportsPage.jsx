import { useState } from 'react';
import useReports from '../../hooks/useReports';
import HistoryTable from '../../components/history/HistoryTable';
import { SkeletonTable, EmptyState, ErrorState } from '../../components/common/Skeletons';

const FILTERS = [
  { field: 'status',    options: ['pending', 'in_review', 'forwarded', 'accepted', 'resolved', 'closed'] },
  { field: 'issueType', options: ['police_harassment', 'accident', 'breakdown', 'poor_road', 'cargo_theft', 'other'] },
  { field: 'priority',  options: ['low', 'medium', 'high', 'critical'] },
];

const ManageReportsPage = () => {
  const [filters, setFilters] = useState({ status: '', issueType: '', priority: '' });
  const { reports, loading, error, refetch, pagination } = useReports('all', filters);

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-black text-white">Manage Reports</h1>
        {pagination.total > 0 && (
          <span className="text-sm text-slate-400">{pagination.total} total</span>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3 items-end">
        {FILTERS.map(({ field, options }) => (
          <select
            key={field}
            className="bg-slate-900 border border-slate-600 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-500 capitalize flex-1 min-w-[130px]"
            value={filters[field]}
            onChange={(e) => setFilters((f) => ({ ...f, [field]: e.target.value }))}
          >
            <option value="">All {field}s</option>
            {options.map((o) => (
              <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>
            ))}
          </select>
        ))}
        {hasFilters && (
          <button
            onClick={() => setFilters({ status: '', issueType: '', priority: '' })}
            className="btn-secondary text-sm py-2 px-4"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <SkeletonTable rows={6} cols={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => refetch()} />
        ) : reports.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No reports found"
            message={hasFilters ? 'Try adjusting your filters.' : 'No reports have been submitted yet.'}
            action={hasFilters ? { label: 'Clear Filters', onClick: () => setFilters({ status: '', issueType: '', priority: '' }) } : undefined}
          />
        ) : (
          <>
            <HistoryTable reports={reports} onRefresh={refetch} showActions />
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-4 flex-wrap">
                {Array.from({ length: Math.min(pagination.pages, 10) }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => refetch(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                      pagination.page === p ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageReportsPage;
