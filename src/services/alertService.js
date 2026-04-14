import api from './api';

export const sendSOS = (coordinates) => api.post('/alerts/sos', { coordinates });
export const broadcastAlert = (data) => api.post('/alerts/broadcast', data);
export const getCurrentStateAlerts = (params) => api.get('/alerts/current-state', { params });
export const getNearbyAlerts = (lat, lng, radius = 5000) =>
  api.get('/alerts/nearby', { params: { lat, lng, radius } });
export const getAlertHistory = (params) => api.get('/alerts/history', { params });
export const deactivateAlert = (id) => api.put(`/alerts/${id}/deactivate`);
