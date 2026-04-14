import { useState, useEffect, useCallback } from 'react';
import { getMyReports, getAllReports } from '../services/reportService';

const useReports = (type = 'my', params = {}) => {
  const [reports, setReports]     = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const paramsKey = JSON.stringify(params);

  const fetch = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const fn = type === 'all' ? getAllReports : getMyReports;
      const { data } = await fn({ ...params, page });
      setReports(data.data.reports || []);
      setPagination({ page: data.data.page || 1, pages: data.data.pages || 1, total: data.data.total || 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, paramsKey]);

  useEffect(() => { fetch(); }, [fetch]);

  return { reports, pagination, loading, error, refetch: fetch };
};

export default useReports;
