import { useState, useEffect, useCallback } from 'react';
import { getAllStateReports } from '../../services/authorityService';
import { updateReportStatus } from '../../services/reportService';
import { toast } from 'react-toastify';
import { timeAgo } from '../../utils/formatDate';
import Loader from '../../components/common/Loader';

const STATUS_OPTIONS = ['', 'pending', 'in_review', 'forwarded', 'accepted', 'resolved', 'closed'];
const ISSUE_OPTIONS  = ['', 'police_harassment', 'roadside_extortion', 'accident', 'breakdown', 'poor_road', 'cargo_theft', 'sos', 'other'];

const statusColors = {
  pending:   'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  in_review: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  forwarded: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  accepted:  'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  resolved:  'bg-green-500/20 text-green-400 border-green-500/30',
  closed:    'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const AuthorityReportsPage = () => {
  const [reports, setReports]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filters, setFilters]     = useState({ status: '', issueType: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const load = useCallback((page = 1, overrideFilters) => {
    setLoading(true);
    const activeFilters = overrideFilters ?? filters;
    getAllStateReports({ page, limit: 15, ...activeFilters })
      .then(({ data }) => {
        setReports(data.data.reports || []);
        setPagination({ page: data.data.page || 1, pages: data.data.pages || 1, total: data.data.total || 0 });
      })
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateReportStatus(id, { status });
      toast.success('Status updated');
      load(pagination.page);
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <span>📋</span> State Reports
        </h1>
        <p className="text-slate-400 text-sm mt-1">{pagination.total} total reports in your jurisdiction</p>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap gap-3">
        <select className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
          value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s ? s.replace('_', ' ') : 'All Statuses'}</option>)}
        </select>
        <select className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
          value={filters.issueType} onChange={(e) => setFilters({ ...filters, issueType: e.target.value })}>
          {ISSUE_OPTIONS.map(s => <option key={s} value={s}>{s ? s.replace(/_/g, ' ') : 'All Types'}</option>)}
        </select>
        <button onClick={() => load(1)} className="btn-primary text-sm py-2">Apply</button>
        <button onClick={() => {
          const cleared = { status: '', issueType: '' };
          setFilters(cleared);
          load(1, cleared);
        }}
          className="btn-secondary text-sm py-2">Reset</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader text="Loading reports..." /></div>
      ) : (
        <>
          <div className="space-y-3">
            {reports.map((r) => (
              <div key={r._id} className="card space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white capitalize">{r.issueType?.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-slate-300 mt-1 line-clamp-2">{r.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
                      <span>👤 {r.driver?.name} · {r.driver?.phone}</span>
                      <span>🗺️ {r.currentState?.name}</span>
                      <span>🕐 {timeAgo(r.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`badge border ${statusColors[r.status] || ''}`}>
                      {r.status?.replace('_', ' ')}
                    </span>
                    <span className={`badge-${r.priority}`}>{r.priority}</span>
                  </div>
                </div>

                {/* Status update */}
                <div className="flex gap-2 flex-wrap">
                  {['accepted', 'in_review', 'resolved', 'closed'].map((s) => (
                    <button key={s} onClick={() => handleStatusUpdate(r._id, s)}
                      disabled={r.status === s}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed
                        ${s === 'resolved' ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20' :
                          s === 'accepted' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20' :
                          s === 'closed'   ? 'bg-slate-500/10 text-slate-400 border-slate-500/30 hover:bg-slate-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20'}`}>
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {!reports.length && (
              <div className="card text-center py-16">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-slate-400">No reports found</p>
              </div>
            )}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button key={i} onClick={() => load(i + 1)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold ${
                    pagination.page === i + 1 ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}>{i + 1}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuthorityReportsPage;
