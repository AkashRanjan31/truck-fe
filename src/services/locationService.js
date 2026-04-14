import api from './api';

export const updateLocation = (coordinates, speed = 0, heading = 0) =>
  api.post('/locations/update', { coordinates, speed, heading });

export const getMyLocation = () => api.get('/locations/me');

export const getLocationHistory = (limit = 50) =>
  api.get('/locations/history/me', { params: { limit } });

export const getActiveDrivers = () => api.get('/locations/active-drivers');
