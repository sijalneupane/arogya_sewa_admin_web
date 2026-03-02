import api from './axios';
import { API_ENDPOINTS } from './endpoints';
import { Hospital, CreateHospitalData, UpdateHospitalData, HospitalListResponse } from '../types/hospital.type.ts';

export interface HospitalSearchParams {
  name?: string;
  address?: string;
  opened_date_from?: string;
  opened_date_to?: string;
  page?: number;
  size?: number;
}

export const hospitalApi = {
  // Get all hospitals (Super Admin) with pagination and filters
  getAll: (params: HospitalSearchParams = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.size) query.append('size', params.size.toString());
    if (params.name) query.append('name', params.name);
    if (params.address) query.append('address', params.address);
    if (params.opened_date_from) query.append('opened_date_from', params.opened_date_from);
    if (params.opened_date_to) query.append('opened_date_to', params.opened_date_to);
    return api.get<HospitalListResponse>(`${API_ENDPOINTS.HOSPITALS}?${query.toString()}`);
  },
  
  // Get hospital by ID
  getById: (id: string) => api.get<Hospital>(`${API_ENDPOINTS.HOSPITALS}/${id}`),
  
  // Create hospital (Super Admin)
  create: (data: CreateHospitalData) => api.post<Hospital>(API_ENDPOINTS.HOSPITALS, data),
  
  // Update hospital
  update: (id: string, data: UpdateHospitalData) => 
    api.patch<Hospital>(`${API_ENDPOINTS.HOSPITALS}/${id}`, data),
  
  // Delete hospital
  delete: (id: string) => api.delete(`${API_ENDPOINTS.HOSPITALS}/${id}`),
  
  // Get hospital statistics
  getStats: () => api.get(API_ENDPOINTS.HOSPITAL_STATS),
};