import React, { useEffect, useState, useCallback } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { getAllReportsAdmin } from '../../services/api';
import './Dashboard.css';

export default function StateAdminDashboard() {
  const { auth, logout } = useAuthContext();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('reports');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getAllReportsAdmin();
      setReports(data);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const active   = reports.filter((r) => r.status === 'active').length;
  const resolved = reports.filter((r) => r.status === 'resolved').length;

  const handleLogout = () => { logout(); window.location.href = '/login'; };

  return (
    <div className="dash-page">
      <aside className="dash-sidebar">
        <div className="dash-brand">🚛 Truck Alert</div>
        <div className="dash-role-badge" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>🔵 State Admin</div>
        <nav className="dash-nav">
          {[{ key: 'reports', icon: '📋', label: 'Reports' }, { key: 'stats', icon: '📊', label: 'Statistics' }].map((t) => (
            <button key={t.key} className={`dash-nav-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
        <div className="dash-user-info">
          <p className="dash-user-name">{auth?.name}</p>
          <p className="dash-user-email">{auth?.email}</p>
          {auth?.assignedState && <p className="dash-state-tag">📍 {auth.assignedState?.name || 'State assigned'}</p>}
          <button className="dash-logout" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-header">
          <h1>State Admin Dashboard</h1>
          <button className="dash-refresh" onClick={load}>🔄 Refresh</button>
        </div>

        {loading ? <div className="dash-loading"><div className="spinner" /></div> : (
          <>
            {tab === 'stats' && (
              <div className="dash-stats">
                {[{ label: 'Total Reports', value: reports.length, color: '#f59e0b', icon: '📋' }, { label: 'Active', value: active, color: '#e74c3c', icon: '🔴' }, { label: 'Resolved', value: resolved, color: '#22c55e', icon: '✅' }].map((s) => (
                  <div className="dash-stat-card" key={s.label}>
                    <span className="dash-stat-icon">{s.icon}</span>
                    <div className="dash-stat-value" style={{ color: s.color }}>{s.value}</div>
                    <div className="dash-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
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
          </>
        )}
      </main>
    </div>
  );
}
