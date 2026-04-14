import api from './api';

export const getAllUsers = (params) => api.get('/admin/users', { params });
export const toggleUserStatus = (id) => api.put(`/admin/users/${id}/toggle`);
export const getAllStates = () => api.get('/admin/states');
export const createState = (data) => api.post('/admin/states', data);
export const assignStateAdmin = (data) => api.post('/admin/assign-state-admin', data);
export const assignStateAdminByEmail = (stateId, data) => api.put(`/admin/states/${stateId}/assign-admin`, data);
export const createAuthority = (data) => api.post('/admin/authorities', data);
export const getStats = () => api.get('/analytics/super-admin');
export const getStateStats = (stateId) => api.get(`/analytics/state-admin/${stateId}`);
export const getReportsTrend = (days) => api.get('/analytics/trend', { params: { days } });
export const getAllTrucks = (params) => api.get('/trucks/all', { params });
export const getStateCrossingLogs = () => api.get('/locations/active-drivers');

// Driver verification
export const getPendingDrivers = (params) => api.get('/admin/drivers/pending', { params });
export const verifyDriver = (driverId, action, reason = '') =>
  api.put(`/admin/drivers/${driverId}/verify`, { action, reason });
