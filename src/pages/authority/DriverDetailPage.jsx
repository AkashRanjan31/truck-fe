import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDriverDetail } from '../../services/authorityService';
import { formatDate, formatDateTime, timeAgo } from '../../utils/formatDate';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const statusColors = {
  pending:   'bg-yellow-500/20 text-yellow-400',
  in_review: 'bg-blue-500/20 text-blue-400',
  forwarded: 'bg-purple-500/20 text-purple-400',
  accepted:  'bg-cyan-500/20 text-cyan-400',
  resolved:  'bg-green-500/20 text-green-400',
  closed:    'bg-slate-500/20 text-slate-400',
};

const DriverDetailPage = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDriverDetail(driverId)
      .then(({ data }) => setData(data.data))
      .catch(() => { toast.error('Failed to load driver'); navigate('/authority/drivers'); })
      .finally(() => setLoading(false));
  }, [driverId]);

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg" /></div>;
  if (!data) return null;

  const { user, driver, recentReports, lastLocation } = data;

  return (
    <div className="p-6 max-w-4xl space-y-5">
      {/* Back */}
      <button onClick={() => navigate('/authority/drivers')}
        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
        ← Back to Drivers
      </button>

      {/* Profile header */}
      <div className="card flex items-start gap-5 flex-wrap">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-3xl font-black text-white shrink-0">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-black text-white">{user?.name}</h1>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              user?.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
            }`}>
              {user?.isActive ? '🟢 Active' : '🔴 Inactive'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 mt-3">
            {[
              ['📧', 'Email',    user?.email],
              ['📱', 'Phone',    user?.phone],
              ['🪪', 'License',  driver?.licenseNumber],
              ['📅', 'Expiry',   driver?.licenseExpiry ? formatDate(driver.licenseExpiry) : '—'],
              ['🏠', 'Home State', driver?.homeState?.name || '—'],
              ['📍', 'Current State', driver?.currentState?.name || '—'],
              ['⭐', 'Experience', `${driver?.experience || 0} years`],
              ['📋', 'Total Reports', driver?.totalReports || 0],
              ['✅', 'Verification', driver?.verificationStatus || '—'],
              ['📅', 'Joined', driver?.joiningDate ? formatDate(driver.joiningDate) : '—'],
            ].map(([icon, label, value]) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <span className="text-base w-5 shrink-0">{icon}</span>
                <span className="text-slate-400">{label}:</span>
                <span className="text-white font-medium truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Last location */}
      {lastLocation && (
        <div className="card">
          <h2 className="font-bold text-white mb-3 flex items-center gap-2">
            <span>📍</span> Last Known Location
          </h2>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-white font-semibold">
                {lastLocation.location?.coordinates?.[1]?.toFixed(5)}, {lastLocation.location?.coordinates?.[0]?.toFixed(5)}
              </p>
              <p className="text-slate-400 text-sm mt-0.5">
                State: {lastLocation.state?.name || '—'} · {timeAgo(lastLocation.timestamp)}
              </p>
              {lastLocation.speed > 0 && (
                <p className="text-slate-400 text-xs mt-0.5">
                  Speed: {(lastLocation.speed * 3.6).toFixed(1)} km/h
                </p>
              )}
            </div>
            <a
              href={`https://www.google.com/maps?q=${lastLocation.location?.coordinates?.[1]},${lastLocation.location?.coordinates?.[0]}`}
              target="_blank" rel="noreferrer"
              className="btn-secondary text-sm"
            >
              🗺️ Open in Maps
            </a>
          </div>
        </div>
      )}

      {/* Recent reports */}
      <div className="card">
        <h2 className="font-bold text-white mb-4 flex items-center gap-2">
          <span>📋</span> Recent Reports ({recentReports?.length || 0})
        </h2>
        {recentReports?.length ? (
          <div className="space-y-2">
            {recentReports.map((r) => (
              <div key={r._id} className="flex items-start justify-between gap-3 py-2.5 border-b border-slate-700/50 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white capitalize">
                    {r.issueType?.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{r.description}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {r.currentState?.name} · {timeAgo(r.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`badge ${statusColors[r.status] || ''}`}>
                    {r.status?.replace('_', ' ')}
                  </span>
                  <span className={`badge-${r.priority}`}>{r.priority}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center py-6">No reports yet</p>
        )}
      </div>
    </div>
  );
};

export default DriverDetailPage;
