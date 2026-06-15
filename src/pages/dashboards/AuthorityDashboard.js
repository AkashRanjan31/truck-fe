import React, { useEffect, useState, useCallback } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { getActiveSOS } from '../../services/api';
import { connectSocket } from '../../services/socket';
import './Dashboard.css';

export default function AuthorityDashboard() {
  const { auth, logout } = useAuthContext();
  const [alerts, setAlerts]   = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getActiveSOS();
      setAlerts(data);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const socket = connectSocket();
    const onEmergency = (d) => setAlerts((p) => [d, ...p]);
    socket.on('emergency_alert', onEmergency);
    return () => socket.off('emergency_alert', onEmergency);
  }, [load]);

  const handleLogout = () => { logout(); window.location.href = '/login'; };

  const active = alerts.filter((a) => a.status !== 'resolved').length;

  return (
    <div className="dash-page">
      <aside className="dash-sidebar">
        <div className="dash-brand">🚛 Truck Alert</div>
        <div className="dash-role-badge" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>🟢 Authority</div>
        <nav className="dash-nav">
          <button className="dash-nav-btn active">🚨 Active Alerts</button>
        </nav>
        <div className="dash-user-info">
          <p className="dash-user-name">{auth?.name}</p>
          <p className="dash-user-email">{auth?.email}</p>
          <button className="dash-logout" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-header">
          <h1>Authority Dashboard</h1>
          <span className="dash-live-badge">🔴 {active} Active</span>
          <button className="dash-refresh" onClick={load}>🔄 Refresh</button>
        </div>

        {loading ? <div className="dash-loading"><div className="spinner" /></div> : (
          <div className="sos-cards">
            {alerts.length === 0 && <p className="empty-row">✅ No active alerts. Monitoring...</p>}
            {alerts.map((s, i) => (
              <div key={s.sosId || i} className={`sos-card ${s.status === 'resolved' ? 'sos-card-resolved' : ''}`}>
                <div className="sos-card-header">
                  <span style={{ fontSize: 24 }}>🚨</span>
                  <div>
                    <strong>{s.driverName}</strong>
                    <p>🚛 {s.truckNumber} · 📞 {s.phone}</p>
                  </div>
                  <span className={`dash-badge ${s.status === 'resolved' ? 'resolved' : 'active'}`}>
                    {s.status === 'resolved' ? '✅ Resolved' : '🔴 Active'}
                  </span>
                </div>
                <p style={{ marginTop: 8 }}>📍 {s.address}</p>
                <p>🕐 {new Date(s.timestamp).toLocaleString()}</p>
                <p>👥 {s.nearbyCount || 0} drivers notified · ✅ {s.acknowledgedBy?.length || 0} responded</p>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
                    target="_blank" rel="noreferrer" className="dash-action-btn">
                    🧭 Navigate
                  </a>
                  <a href={`tel:${s.phone}`} className="dash-action-btn" style={{ background: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.3)', color: '#4ade80' }}>
                    📞 Call Driver
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
