import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDriversInState } from '../../services/authorityService';
import { formatDate, timeAgo } from '../../utils/formatDate';
import { SkeletonCard, EmptyState, ErrorState } from '../../components/common/Skeletons';
import { toast } from 'react-toastify';

const DriverCard = ({ driver, onClick }) => {
  const user = driver.user;
  const loc  = driver.lastLocation;

  return (
    <div onClick={onClick}
      className="card cursor-pointer hover:border-orange-500/30 hover:bg-slate-700/30 transition-all border border-slate-700">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center font-bold text-white text-lg">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-800 ${driver.isOnline ? 'bg-green-400' : 'bg-slate-500'}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold text-white truncate">{user?.name}</p>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
              driver.isOnline ? 'bg-green-500/15 text-green-400' : 'bg-slate-600/50 text-slate-400'
            }`}>
              {driver.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{user?.phone} · {user?.email}</p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {driver.licenseNumber && (
              <span className="text-xs text-slate-400">🪪 <span className="text-slate-300">{driver.licenseNumber}</span></span>
            )}
            <span className="text-xs text-slate-400">📅 <span className="text-slate-300">{formatDate(driver.joiningDate)}</span></span>
            <span className="text-xs text-slate-400">📋 <span className="text-slate-300">{driver.totalReports || 0}</span> reports</span>
            <span className={`text-xs font-semibold ${
              driver.verificationStatus === 'approved' ? 'text-green-400' :
              driver.verificationStatus === 'rejected' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {driver.verificationStatus === 'approved' ? '✅' : driver.verificationStatus === 'rejected' ? '❌' : '⏳'} {driver.verificationStatus}
            </span>
          </div>

          {loc && (
            <p className="text-[10px] text-slate-500 mt-1.5">
              📍 Last seen {timeAgo(loc.timestamp)} · {loc.location?.coordinates?.[1]?.toFixed(4)}, {loc.location?.coordinates?.[0]?.toFixed(4)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const AuthorityDriversPage = () => {
  const [drivers, setDrivers]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const navigate = useNavigate();
  // Use ref to always read latest search value in load callback
  const searchRef = useRef(search);
  useEffect(() => { searchRef.current = search; }, [search]);

  const load = useCallback((page = 1) => {
    setLoading(true);
    setError(null);
    getDriversInState({ page, limit: 20, search: searchRef.current })
      .then(({ data }) => {
        setDrivers(data.data.drivers || []);
        setPagination({ page: data.data.page || 1, pages: data.data.pages || 1, total: data.data.total || 0 });
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load drivers'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    load(1);
  };

  const handleClear = () => {
    setSearch('');
    searchRef.current = '';
    load(1);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">🚛 Drivers in Your State</h1>
          <p className="text-slate-400 text-sm mt-1">{pagination.total} drivers in your jurisdiction</p>
        </div>
        <button onClick={() => load()} className="btn-secondary text-sm py-2">🔄 Refresh</button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          className="input-field flex-1"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-primary px-5">Search</button>
        {search && (
          <button type="button" onClick={handleClear} className="btn-secondary px-4">Clear</button>
        )}
      </form>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} rows={3} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => load()} />
      ) : drivers.length === 0 ? (
        <EmptyState
          icon="🚛"
          title="No drivers found"
          message={search ? 'No drivers match your search.' : 'No drivers are currently active in your state.'}
          action={search ? { label: 'Clear Search', onClick: handleClear } : undefined}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {drivers.map((d) => (
              <DriverCard
                key={d._id}
                driver={d}
                onClick={() => navigate(`/authority/driver/${d.user?._id}`)}
              />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => load(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                    pagination.page === p ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuthorityDriversPage;
