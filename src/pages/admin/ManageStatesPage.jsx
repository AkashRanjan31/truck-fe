import { useState, useEffect, useCallback } from 'react';
import { getAllStates, createState } from '../../services/adminService';
import { toast } from 'react-toastify';
import { SkeletonTable, ErrorState, EmptyState } from '../../components/common/Skeletons';

const ManageStatesPage = () => {
  const [states, setStates]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [form, setForm]       = useState({ name: '', code: '' });
  const [adding, setAdding]   = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getAllStates()
      .then(({ data }) => setStates(data.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load states'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('State name is required');
    if (!form.code.trim()) return toast.error('State code is required');
    setAdding(true);
    try {
      await createState(form);
      toast.success('State created');
      setForm({ name: '', code: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create state');
    } finally { setAdding(false); }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-black text-white">Manage States</h1>
        <button onClick={load} className="btn-secondary text-sm py-2">🔄 Refresh</button>
      </div>

      <div className="card">
        <h2 className="font-bold text-white mb-4">Add New State</h2>
        <form onSubmit={handleAdd} className="flex gap-3 flex-wrap">
          <input className="input-field flex-1 min-w-[180px]" placeholder="State name"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input-field w-28" placeholder="Code (e.g. MH)"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            maxLength={3} required />
          <button type="submit" disabled={adding} className="btn-primary">
            {adding ? 'Adding...' : '+ Add State'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="font-bold text-white mb-4">All States ({states.length})</h2>
        {loading ? (
          <SkeletonTable rows={5} cols={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : states.length === 0 ? (
          <EmptyState icon="🗺️" title="No states found" message="Add your first state above." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  {['State Name', 'Code', 'Admin', 'Status'].map((h) => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {states.map((s) => (
                  <tr key={s._id} className="table-row">
                    <td className="table-cell font-medium text-white">{s.name}</td>
                    <td className="table-cell"><span className="font-mono text-orange-400">{s.code}</span></td>
                    <td className="table-cell text-slate-400">{s.admin?.name || '—'}</td>
                    <td className="table-cell">
                      <span className={`badge ${s.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
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

export default ManageStatesPage;
