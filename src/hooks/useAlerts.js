import { useState, useEffect, useCallback } from 'react';
import { getCurrentStateAlerts } from '../services/alertService';

const useAlerts = (params) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paramsKey = JSON.stringify(params);

  const fetch = useCallback(() => {
    setLoading(true);
    getCurrentStateAlerts(params)
      .then(({ data }) => setAlerts(data.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load alerts'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  useEffect(() => { fetch(); }, [fetch]);

  return { alerts, loading, error, setAlerts, refetch: fetch };
};

export default useAlerts;
