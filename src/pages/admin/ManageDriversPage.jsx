import { useState, useEffect, useCallback } from 'react';
import { getAllUsers, toggleUserStatus } from '../../services/adminService';
import { toast } from 'react-toastify';
import { SkeletonTable, EmptyState, ErrorState } from '../../components/common/Skeletons';
import { formatDate } from '../../utils/formatDate';

const STATUS_COLORS = {
  pending:            'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  approved:           'bg-green-500/15  text-green-400  border-green-500/30',
  rejected:           'bg-red-500/15    text-red-400    border-red-500/30',
  correction_required:'bg-blue-500/15   text-blue-400   border-blue-500/30',
};

const ManageDriversPage = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [toggling, setToggling] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getAllUsers({ role: 'driver' })
      .then(({ data }) => setUsers(data.data.users || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load drivers'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (id) => {
    setToggling(id);
    try {
      await toggleUserStatus(id);
      toast.success('Status updated');
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isActive: !u.isActive } : u));
    } catch {
      toast.error('Failed to update status');
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white">Manage Drivers</h1>
          {!loading && !error && (
            <p className="text-slate-400 text-sm mt-1">{users.length} driver{users.length !== 1 ? 's' : ''}</p>
          )}
        </div>
        <button onClick={load} className="btn-secondary text-sm py-2">🔄 Refresh</button>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-5"><SkeletonTable rows={5} cols={5} /></div>
        ) : error ? (
          <div className="p-5"><ErrorState message={error} onRetry={load} /></div>
        ) : users.length === 0 ? (
          <div className="p-5">
            <EmptyState icon="🚛" title="No drivers found" message="No driver accounts have been registered yet." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/50">
                  {['Name', 'Email', 'Phone', 'Verification', 'Joined', 'Account'].map((h) => (
                    <th key={h} className="table-header px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="table-row">
                    <td className="table-cell px-4 font-medium text-white">{u.name}</td>
                    <td className="table-cell px-4 text-slate-400 max-w-[180px] truncate">{u.email}</td>
                    <td className="table-cell px-4 text-slate-400">{u.phone || '—'}</td>
                    <td className="table-cell px-4">
                      {u.driverProfile?.verificationStatus ? (
                        <span className={`badge border ${STATUS_COLORS[u.driverProfile.verificationStatus] || ''}`}>
                          {u.driverProfile.verificationStatus.replace('_', ' ')}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="table-cell px-4 text-slate-500 text-xs">{formatDate(u.createdAt)}</td>
                    <td className="table-cell px-4">
                      <button
                        onClick={() => handleToggle(u._id)}
                        disabled={toggling === u._id}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all disabled:opacity-50 ${
                          u.isActive
                            ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                            : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30'
                        }`}
                      >
                        {toggling === u._id ? '...' : u.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDriversPage;
