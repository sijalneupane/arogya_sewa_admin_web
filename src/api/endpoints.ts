export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  REFRESH_TOKEN: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Super Admin
  HOSPITALS: '/hospitals',
  HOSPITAL_STATS: '/hospitals/stats',
  
  // Hospital Admin
  DOCTORS: '/doctors',
  APPOINTMENTS: '/appointments',
  APPOINTMENT_STATS: '/appointments/stats',
  
  // Shared
  USERS: '/users',
};

// Base URL configuration
export const getBaseUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

// API version
export const API_VERSION = 'v1';

// Full URL helper
export const getApiUrl = (endpoint: string) => {
  return `${getBaseUrl()}/${API_VERSION}${endpoint}`;
};