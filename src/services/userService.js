import api from './api';

export const getProfile = () => api.get('/users/profile');

// For photo upload (multipart)
export const updateProfile = (formData) =>
  api.put('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// For JSON field updates (name, phone, vehicleNumber, etc.)
export const updateDriverProfile = (data) => api.put('/users/profile', data);

export const changePassword = (data) => api.put('/users/change-password', data);
