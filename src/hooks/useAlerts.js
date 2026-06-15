import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../utils/constants';

export const useAlerts = (token) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAlerts = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/alerts?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setAlerts(data.data.alerts || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createAlert = useCallback(async (alertData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(alertData)
      });
      const data = await response.json();
      if (response.ok) {
        setAlerts(prev => [data.data, ...prev]);
      }
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [token]);

  return { alerts, loading, error, getAlerts, createAlert };
};
