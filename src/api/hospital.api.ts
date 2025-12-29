import api from './axios';
import { API_ENDPOINTS } from './endpoints';
import { Hospital, CreateHospitalData, UpdateHospitalData } from '../types/hospital.type.ts';

export const hospitalApi = {
  // Get all hospitals (Super Admin)
  getAll: () => api.get<Hospital[]>(API_ENDPOINTS.HOSPITALS),
  
  // Get hospital by ID
  getById: (id: string) => api.get<Hospital>(`${API_ENDPOINTS.HOSPITALS}/${id}`),
  
  // Create hospital (Super Admin)
  create: (data: CreateHospitalData) => api.post<Hospital>(API_ENDPOINTS.HOSPITALS, data),
  
  // Update hospital
  update: (id: string, data: UpdateHospitalData) => 
    api.put<Hospital>(`${API_ENDPOINTS.HOSPITALS}/${id}`, data),
  
  // Delete hospital
  delete: (id: string) => api.delete(`${API_ENDPOINTS.HOSPITALS}/${id}`),
  
  // Get hospital statistics
  getStats: () => api.get(API_ENDPOINTS.HOSPITAL_STATS),
};