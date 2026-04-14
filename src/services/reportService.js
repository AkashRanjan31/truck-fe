import api from './api';

// Create a report (driver only)
export const createReport = (formData) =>
  api.post('/reports/create', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// GET /api/reports — works for all roles, visibility enforced by backend
// Supports: page, limit, status, issueType, priority, startDate, endDate, search
export const getReports = (params) => api.get('/reports', { params });

// Alias for driver "my reports" page
export const getMyReports = (params) => api.get('/reports/my', { params });

// Validate a MongoDB ObjectId before using it in a URL path
const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(String(id ?? ''));

// Admin: reports for a specific state
export const getReportsByState = (stateId, params) => {
  if (!isValidObjectId(stateId)) return Promise.reject(new Error('Invalid stateId'));
  return api.get(`/reports/state/${stateId}`, { params });
};

// Single report detail
export const getReport = (id) => {
  if (!isValidObjectId(id)) return Promise.reject(new Error('Invalid report id'));
  return api.get(`/reports/${id}`);
};

// Update report status (authority/admin)
export const updateReportStatus = (id, data) => {
  if (!isValidObjectId(id)) return Promise.reject(new Error('Invalid report id'));
  return api.put(`/reports/status/${id}`, data);
};

// Convenience: get all reports (admin/authority — same as getReports)
export const getAllReports = (params) => api.get('/reports', { params });
