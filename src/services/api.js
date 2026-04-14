import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Only redirect on 401 if we actually had a token (not on initial /auth/me load)
    if (err.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(err);
  }
);

export default api;
