import { timeAgo, formatDateTime } from '../../utils/formatDate';
import { UPLOADS_URL } from '../../utils/constants';

const statusConfig = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  in_review: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  forwarded: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  accepted: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
  closed: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const HistoryCard = ({ report }) => (
  <div className="card space-y-3">
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white capitalize">
          {report.issueType?.replace(/_/g, ' ')}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{timeAgo(report.createdAt)}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className={`badge border ${statusConfig[report.status] || statusConfig.pending}`}>
          {report.status?.replace('_', ' ')}
        </span>
        <span className={`badge-${report.priority}`}>{report.priority}</span>
      </div>
    </div>

    <p className="text-sm text-slate-300 leading-relaxed">{report.description}</p>

    {report.location?.address && (
      <p className="text-xs text-slate-500 flex items-center gap-1">
        <span>📍</span> {report.location.address}
      </p>
    )}

    {report.currentState?.name && (
      <p className="text-xs text-slate-500 flex items-center gap-1">
        <span>🗺️</span> {report.currentState.name}
      </p>
    )}

    {report.photos?.length > 0 && (
      <div className="flex gap-2 flex-wrap">
        {report.photos.map((p, i) => (
          <img
            key={i}
            src={`${UPLOADS_URL}/reports/${p}`}
            alt=""
            className="w-16 h-16 object-cover rounded-xl border border-slate-600"
          />
        ))}
      </div>
    )}

    {report.remarks && (
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
        <p className="text-xs text-blue-400">
          <span className="font-semibold">Authority: </span>{report.remarks}
        </p>
      </div>
    )}

    {report.adminNotes && (
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
        <p className="text-xs text-orange-400">
          <span className="font-semibold">Admin: </span>{report.adminNotes}
        </p>
      </div>
    )}
  </div>
);

export default HistoryCard;
