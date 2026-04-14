import api from './api';

export const getMyAssignedReports  = ()           => api.get('/authorities/my-reports');
export const updateAvailability    = (isAvailable) => api.put('/authorities/availability', { isAvailable });
export const getAuthoritiesByState = (stateId)    => api.get(`/authorities/state/${stateId}`);
export const getNearestAuthority   = (params)     => api.get('/authorities/nearest', { params });
export const createAuthority       = (data)       => api.post('/authorities/create', data);
export const getDashboard          = ()           => api.get('/authorities/dashboard');
export const getDriversInState     = (params)     => api.get('/authorities/drivers', { params });
export const getAllStateReports     = (params)     => api.get('/authorities/all-reports', { params });
export const getDriverDetail       = (driverId)   => api.get(`/authorities/driver/${driverId}`);
