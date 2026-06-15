import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

export const setToken = (token) => {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
};

export const setDriverId = (id) => {
  if (id) api.defaults.headers.common['x-driver-id'] = id;
  else delete api.defaults.headers.common['x-driver-id'];
};

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(new Error(err.response?.data?.error || err.message || 'Network error'))
);

// ── Auth ─────────────────────────────────────────────────────────────────────
export const registerDriver = (data) => api.post('/drivers/register', data);
export const loginDriver = (phone) => api.post('/drivers/login', { phone });
export const registerUser = (data) => api.post('/auth/register', data);
export const verifyOTP = (email, otp) => api.post('/auth/verify-otp', { email, otp });
export const resendOTP = (email) => api.post('/auth/resend-otp', { email });

// Unified role-based login — works for SUPER_ADMIN, STATE_ADMIN, AUTHORITY, DRIVER
export const loginWithRole = (identifier, password) =>
  api.post('/auth/login', { identifier, password });

// Legacy driver email+password login
export const loginUser = (email, password) =>
  api.post('/auth/login', { identifier: email, password });

export const getProfile = () => api.get('/auth/profile');
export const getMe = () => api.get('/auth/me');

// ── Location ──────────────────────────────────────────────────────────────────
export const updateLocation = (id, lat, lng) => api.patch(`/drivers/${id}/location`, { lat, lng });

// ── Reports ───────────────────────────────────────────────────────────────────
export const createReport = (formData) => api.post('/reports', formData);
export const getNearbyReports = (lat, lng, radius = 50000) =>
  api.get('/reports', { params: { lat, lng, radius } });
export const getTrafficZones = (lat, lng, radius = 50000) =>
  api.get('/traffic/zones', { params: { lat, lng, radius } });
export const getAllReports = () => api.get('/reports');
export const getAllReportsAdmin = () =>
  api.get('/reports/admin', {
    headers: { 'x-admin-password': localStorage.getItem('adminPass') || '' },
  });
export const getDriverReports = (driverId) => api.get(`/reports/driver/${driverId}`);
export const upvoteReport = (id) => api.patch(`/reports/${id}/upvote`);
export const userConfirmResolution = (id) => api.patch(`/reports/${id}/user-confirm`);
export const resolveReportWithPhoto = (id, formData) =>
  api.patch(`/reports/${id}/resolve`, formData, {
    headers: { 'x-admin-password': localStorage.getItem('adminPass') || '' },
  });
export const deleteReport = (id) =>
  api.delete(`/reports/${id}`, {
    headers: { 'x-admin-password': localStorage.getItem('adminPass') || '' },
  });

// ── Alerts ────────────────────────────────────────────────────────────────────
export const getAlerts = (filters = {}) => api.get('/alerts', { params: filters });
export const createAlert = (alertData) => api.post('/alerts', alertData);
export const updateAlertStatus = (alertId, status) => api.patch(`/alerts/${alertId}`, { status });
export const respondToAlert = (alertId) => api.post(`/alerts/${alertId}/respond`);

// ── Drivers ───────────────────────────────────────────────────────────────────
export const getAllDrivers = () =>
  api.get('/drivers', {
    headers: { 'x-admin-password': localStorage.getItem('adminPass') || '' },
  });
export const deleteDriver = (id) =>
  api.delete(`/drivers/${id}`, {
    headers: { 'x-admin-password': localStorage.getItem('adminPass') || '' },
  });

// ── Admin (legacy password-based) ────────────────────────────────────────────
export const adminLogin = (password) => api.post('/admin/login', { password });
export const getAdminDashboard = (filters = {}) => api.get('/admin/dashboard', { params: filters });
export const getStatesAdmin = () => api.get('/admin/states');

// ── Authority ─────────────────────────────────────────────────────────────────
export const getAssignedAlerts = () => api.get('/authority/alerts');
export const respondToAuthorityAlert = (alertId, data) =>
  api.post(`/authority/alerts/${alertId}/respond`, data);

// ── Emergency / SOS ───────────────────────────────────────────────────────────
export const triggerSOS = (data) => api.post('/emergency', data);
export const acknowledgeSOS = (sosId, data) => api.patch(`/emergency/${sosId}/acknowledge`, data);
export const getActiveSOS = () => api.get('/emergency/active');
export const resolveSOS = (sosId) => api.patch(`/emergency/${sosId}/resolve`);

// ── Analytics ─────────────────────────────────────────────────────────────────
export const getAnalytics = (filters = {}) => api.get('/analytics', { params: filters });
export const getStateAnalytics = (stateId) =>
  api.get('/analytics/state', { params: { stateId } });

// ── States ────────────────────────────────────────────────────────────────────
export const getStates = () => api.get('/states');

// ── Password ──────────────────────────────────────────────────────────────────
export const changeDriverPassword = (id, currentPassword, newPassword) =>
  api.patch(`/drivers/${id}/password`, { currentPassword, newPassword });
export const adminChangePassword = (currentPassword, newPassword) =>
  api.post('/admin/change-password', { newPassword }, {
    headers: { 'x-admin-password': localStorage.getItem('adminPass') || currentPassword },
  });

export default api;
