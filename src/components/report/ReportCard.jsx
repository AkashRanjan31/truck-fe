import { timeAgo } from '../../utils/formatDate';

const statusColors = { pending: 'bg-yellow-100 text-yellow-700', verified: 'bg-blue-100 text-blue-700', resolved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };

const ReportCard = ({ report, onClick }) => (
  <div onClick={onClick} className="card cursor-pointer hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm capitalize">{report.issueType?.replace('_', ' ')}</p>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{report.location?.address || 'Location recorded'}</p>
        <p className="text-xs text-gray-400 mt-1">{timeAgo(report.createdAt)}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[report.status]}`}>{report.status}</span>
        <span className={`badge-${report.severity}`}>{report.severity}</span>
      </div>
    </div>
  </div>
);

export default ReportCard;
