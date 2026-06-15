import React, { useEffect, useState, useCallback } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { getAllReportsAdmin, getAllDrivers, getActiveSOS } from '../../services/api';
import { connectSocket } from '../../services/socket';
import './Dashboard.css';

export default function SuperAdminDashboard() {
  const { auth, logout } = useAuthContext();
  const [stats, setStats]     = useState({ reports: 0, drivers: 0, sos: 0, active: 0 });
  const [reports, setReports] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [sosList, setSosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('overview');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rRes, dRes, sosRes] = await Promise.all([
        getAllReportsAdmin(), getAllDrivers(), getActiveSOS(),
      ]);
      const r = rRes.data; const d = dRes.data; const s = sosRes.data;
      setReports(r); setDrivers(d); setSosList(s);
      setStats({ reports: r.length, drivers: d.length, sos: s.length, active: r.filter((x) => x.status === 'active').length });
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const socket = connectSocket();
    const onAlert = (r) => setReports((p) => p.find((x) => x._id === r._id) ? p : [r, ...p]);
    socket.on('alert_nearby', onAlert);
    return () => socket.off('alert_nearby', onAlert);
  }, [load]);

  const handleLogout = () => { logout(); window.location.href = '/login'; };

  return (
    <div className="dash-page">
      <aside className="dash-sidebar">
        <div className="dash-brand">🚛 Truck Alert</div>
        <div className="dash-role-badge" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>🔴 Super Admin</div>
        <nav className="dash-nav">
          {[{ key: 'overview', icon: '📊', label: 'Overview' }, { key: 'reports', icon: '📋', label: 'Reports' }, { key: 'drivers', icon: '👤', label: 'Drivers' }, { key: 'sos', icon: '🚨', label: 'SOS Alerts' }].map((t) => (
            <button key={t.key} className={`dash-nav-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
        <div className="dash-user-info">
          <p className="dash-user-name">{auth?.name}</p>
          <p className="dash-user-email">{auth?.email}</p>
          <button className="dash-logout" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-header">
          <h1>Super Admin Dashboard</h1>
          <button className="dash-refresh" onClick={load}>🔄 Refresh</button>
        </div>

        {loading ? <div className="dash-loading"><div className="spinner" /></div> : (
          <>
            {tab === 'overview' && (
              <>
                <div className="dash-stats">
                  {[{ label: 'Total Reports', value: stats.reports, color: '#f59e0b', icon: '📋' }, { label: 'Active Reports', value: stats.active, color: '#e74c3c', icon: '🔴' }, { label: 'Total Drivers', value: stats.drivers, color: '#3b82f6', icon: '👤' }, { label: 'SOS Alerts', value: stats.sos, color: '#e74c3c', icon: '🚨' }].map((s) => (
                    <div className="dash-stat-card" key={s.label}>
                      <span className="dash-stat-icon">{s.icon}</span>
                      <div className="dash-stat-value" style={{ color: s.color }}>{s.value}</div>
                      <div className="dash-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
                <h3 className="dash-section-title">Recent Reports</h3>
                <div className="dash-table-wrap">
                  <table className="dash-table">
                    <thead><tr><th>Type</th><th>Driver</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody>
                      {reports.slice(0, 10).map((r) => (
                        <tr key={r._id}>
                          <td>{r.type?.replace(/_/g, ' ').toUpperCase()}</td>
                          <td>{r.driverName}</td>
                          <td><span className={`dash-badge ${r.status}`}>{r.status}</span></td>
                          <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {reports.length === 0 && <tr><td colSpan={4} className="empty-row">No reports yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {tab === 'reports' && (
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead><tr><th>Type</th><th>Description</th><th>Driver</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r._id}>
                        <td>{r.type?.replace(/_/g, ' ')}</td>
                        <td className="desc-cell">{r.description}</td>
                        <td>{r.driverName}</td>
                        <td><span className={`dash-badge ${r.status}`}>{r.status}</span></td>
                        <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {reports.length === 0 && <tr><td colSpan={5} className="empty-row">No reports</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
            {tab === 'drivers' && (
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead><tr><th>Name</th><th>Phone</th><th>Truck</th><th>Status</th><th>Joined</th></tr></thead>
                  <tbody>
                    {drivers.map((d) => (
                      <tr key={d._id}>
                        <td>👤 {d.name}</td><td>{d.phone}</td><td>{d.truckNumber || '—'}</td>
                        <td><span className={`dash-badge ${d.isActive ? 'active' : 'inactive'}`}>{d.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {drivers.length === 0 && <tr><td colSpan={5} className="empty-row">No drivers</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
            {tab === 'sos' && (
              <div className="sos-cards">
                {sosList.length === 0 && <p className="empty-row">No SOS alerts</p>}
                {sosList.map((s, i) => (
                  <div key={s.sosId || i} className={`sos-card ${s.status === 'resolved' ? 'sos-card-resolved' : ''}`}>
                    <div className="sos-card-header">
                      <span>🚨</span>
                      <div><strong>{s.driverName}</strong><p>📞 {s.phone} · {s.truckNumber}</p></div>
                      <span className={`dash-badge ${s.status === 'resolved' ? 'resolved' : 'active'}`}>{s.status === 'resolved' ? '✅ Resolved' : '🔴 Active'}</span>
                    </div>
                    <p>📍 {s.address}</p>
                    <p>🕐 {new Date(s.timestamp).toLocaleString()}</p>
                    <p>👥 {s.nearbyCount || 0} notified · ✅ {s.acknowledgedBy?.length || 0} responded</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
