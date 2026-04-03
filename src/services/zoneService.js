import api from './api';

export const getIncidentZones = (lat, lng, radius = 50000) =>
  api.get('/reports', { params: { lat, lng, radius } });

export const createIncidentReport = (formData) =>
  api.post('/reports', formData);
