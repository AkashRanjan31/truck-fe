import api from './api';

export const sendOTP = (email, phone) => api.post('/auth/send-otp', { email, phone });
export const verifyOTP = (email, otp) => api.post('/auth/verify-otp', { email, otp });
export const register = (data) => api.post('/auth/register', data);
export const resendOTP = (email, type) => api.post('/auth/resend-otp', { email, type });
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');
