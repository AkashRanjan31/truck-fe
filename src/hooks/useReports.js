import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../utils/constants';

export const useReports = (token) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getReports = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/reports?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setReports(data.data.reports || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createReport = useCallback(async (reportData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reportData)
      });
      const data = await response.json();
      if (response.ok) {
        setReports(prev => [data.data, ...prev]);
      }
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [token]);

  return { reports, loading, error, getReports, createReport };
};
