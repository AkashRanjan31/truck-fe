import { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts';
import { getStats, getReportsTrend } from '../../services/adminService';
import { SkeletonCard, ErrorState } from '../../components/common/Skeletons';

const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];

const tooltipStyle = {
  contentStyle: { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f1f5f9' },
  labelStyle: { color: '#94a3b8' },
};

const ChartCard = ({ title, children }) => (
  <div className="card">
    <h2 className="font-bold text-white mb-4">{title}</h2>
    {children}
  </div>
);

const AnalyticsPage = () => {
  const [data, setData]     = useState(null);
  const [trend, setTrend]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([getStats(), getReportsTrend(7)])
      .then(([s, t]) => {
        setData(s.data.data);
        setTrend((t.data.data || []).map((d) => ({ date: d._id, count: d.count })));
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const byState = data?.byState?.map((d) => ({ name: d.stateName || 'Unknown', count: d.count })) || [];
  const byType  = data?.byType?.map((d) => ({ name: (d._id || 'other').replace(/_/g, ' '), count: d.count })) || [];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-black text-white">Analytics</h1>
        <button onClick={load} className="btn-secondary text-sm py-2">🔄 Refresh</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} rows={6} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Reports by State">
            {byState.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={byState}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Reports by Type">
            {byType.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={byType} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#475569' }}>
                    {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="7-Day Report Trend">
            {trend.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No data for the last 7 days</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip {...tooltipStyle} />
                  <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={2.5}
                    dot={{ fill: '#f97316', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
