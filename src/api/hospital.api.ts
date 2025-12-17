import api from './axios';
import { API_ENDPOINTS } from './endpoints';
import { Hospital, CreateHospitalData } from '../types/hospital.types';

export const hospitalApi = {
  // Get all hospitals (Super Admin)
  getAll: () => api.get(API_ENDPOINTS.HOSPITALS),
  
  // Get hospital by ID
  getById: (id: string) => api.get(`${API_ENDPOINTS.HOSPITALS}/${id}`),
  
  // Create hospital (Super Admin)
  create: (data: CreateHospitalData) => api.post(API_ENDPOINTS.HOSPITALS, data),
  
  // Update hospital
  update: (id: string, data: Partial<CreateHospitalData>) => 
    api.put(`${API_ENDPOINTS.HOSPITALS}/${id}`, data),
  
  // Delete hospital
  delete: (id: string) => api.delete(`${API_ENDPOINTS.HOSPITALS}/${id}`),
  
  // Get hospital statistics
  getStats: () => api.get(API_ENDPOINTS.HOSPITAL_STATS),
};