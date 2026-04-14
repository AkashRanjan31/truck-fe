import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { timeAgo } from '../../utils/formatDate';

const severityConfig = {
  low: { color: '#22c55e', glow: 'rgba(34,197,94,0.6)' },
  medium: { color: '#eab308', glow: 'rgba(234,179,8,0.6)' },
  high: { color: '#f97316', glow: 'rgba(249,115,22,0.6)' },
  critical: { color: '#ef4444', glow: 'rgba(239,68,68,0.6)' },
};

const createIcon = (severity) => {
  const { color, glow } = severityConfig[severity] || severityConfig.medium;
  return L.divIcon({
    html: `<div style="background:${color};width:22px;height:22px;border-radius:50%;border:3px solid white;box-shadow:0 0 12px ${glow},0 2px 8px rgba(0,0,0,0.4)"></div>`,
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
};

const AlertMarker = ({ alert }) => {
  const [lng, lat] = alert.location.coordinates;
  return (
    <Marker position={[lat, lng]} icon={createIcon(alert.severity)}>
      <Popup>
        <div className="min-w-[200px] p-1">
          <p className="font-bold text-sm text-slate-800">{alert.title}</p>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.message}</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium
              ${alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'}`}>
              {alert.severity}
            </span>
            <span className="text-xs text-slate-400">{timeAgo(alert.createdAt)}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default AlertMarker;
