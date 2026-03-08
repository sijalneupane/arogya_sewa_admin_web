export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  UPDATE_PROFILE: '/auth/profile',
  REFRESH_TOKEN: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Super Admin
  HOSPITALS: '/hospital',
  HOSPITAL_STATS: '/hospitals/stats',

  // Hospital Admin
  DOCTORS: '/doctors',
  DOCTORS_HOSPITAL_MY: '/doctors/hospital/my',
  DEPARTMENTS: '/departments',
  DEPARTMENTS_MY: '/departments/my',
  APPOINTMENTS: '/appointments',
  APPOINTMENT_STATS: '/appointments/stats',
  
  // Shared
  USERS: '/users',
  
  // File Upload
  FILE_UPLOAD: '/file/upload',
  FILE_UPDATE: '/file/update',
  FILE_DELETE: (id: string) => `/fileupload/${id}`,
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