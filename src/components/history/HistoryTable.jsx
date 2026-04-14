import { timeAgo } from '../../utils/formatDate';
import { updateReportStatus } from '../../services/reportService';
import { toast } from 'react-toastify';

const statusConfig = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  in_review: 'bg-blue-500/20 text-blue-400',
  forwarded: 'bg-purple-500/20 text-purple-400',
  accepted: 'bg-cyan-500/20 text-cyan-400',
  resolved: 'bg-green-500/20 text-green-400',
  closed: 'bg-slate-500/20 text-slate-400',
};

const HistoryTable = ({ reports, onRefresh, showActions = false }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm min-w-[600px]">
      <thead>
        <tr className="border-b border-slate-700">
          <th className="table-header">Issue</th>
          <th className="table-header">Driver</th>
          <th className="table-header">Priority</th>
          <th className="table-header">Status</th>
          <th className="table-header">State</th>
          <th className="table-header">Time</th>
          {showActions && <th className="table-header">Action</th>}
        </tr>
      </thead>
      <tbody>
        {reports.map((r) => (
          <tr key={r._id} className="table-row">
            <td className="table-cell font-medium capitalize">
              {r.issueType?.replace(/_/g, ' ')}
            </td>
            <td className="table-cell text-slate-400">{r.driver?.name || '—'}</td>
            <td className="table-cell">
              <span className={`badge-${r.priority}`}>{r.priority}</span>
            </td>
            <td className="table-cell">
              <span className={`badge ${statusConfig[r.status] || ''}`}>
                {r.status?.replace('_', ' ')}
              </span>
            </td>
            <td className="table-cell text-slate-400">{r.currentState?.name || '—'}</td>
            <td className="table-cell text-slate-500 text-xs">{timeAgo(r.createdAt)}</td>
            {showActions && (
              <td className="table-cell">
                <select
                  value={r.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    try {
                      await updateReportStatus(r._id, { status: newStatus });
                      toast.success('Status updated');
                      onRefresh?.();
                    } catch {
                      toast.error('Failed to update');
                    }
                  }}
                  className="bg-slate-700 border border-slate-600 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-orange-500"
                >
                  {['pending', 'in_review', 'forwarded', 'accepted', 'resolved', 'closed'].map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
    {!reports.length && (
      <div className="text-center py-12">
        <p className="text-4xl mb-2">📋</p>
        <p className="text-slate-500">No reports found</p>
      </div>
    )}
  </div>
);

export default HistoryTable;
