import axios from 'axios';
import { getBaseUrl, API_VERSION } from './endpoints';

const api = axios.create({
  baseURL: `${getBaseUrl()}/${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login only if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle other errors
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.response?.data?.detail || 
                   error.message || 
                   'Something went wrong';
    console.error('API Error:', message);
    
    return Promise.reject({ 
      message, 
      status: error.response?.status,
      data: error.response?.data 
    });
  }
);

export default api;