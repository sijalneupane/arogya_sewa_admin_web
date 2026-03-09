import api from './axios';
import { API_ENDPOINTS } from './endpoints';
import { Doctor, DoctorListResponse, CreateDoctorData, UpdateDoctorData } from '../types/doctor.type';

export interface DoctorFilters {
  name?: string;
  status?: string;
  department_id?: string;
  page?: number;
  size?: number;
}

export const doctorApi = {
  // Get all doctors for the current hospital admin's hospital
  getMyHospitalDoctors: (filters: DoctorFilters = {}) => {
    const query = new URLSearchParams();
    if (filters.name) query.append('name', filters.name);
    if (filters.status) query.append('status', filters.status);
    if (filters.department_id) query.append('department_id', filters.department_id);
    if (filters.page != null) query.append('page', String(filters.page));
    if (filters.size != null) query.append('size', String(filters.size));
    return api.get<DoctorListResponse>(`${API_ENDPOINTS.DOCTORS_HOSPITAL_MY}?${query.toString()}`);
  },

  // Get all doctors for a hospital
  getAll: (hospitalId: string) =>
    api.get(`${API_ENDPOINTS.DOCTORS}?hospitalId=${hospitalId}`),

  // Get doctor by ID
  getById: (id: string) => api.get<Doctor>(`${API_ENDPOINTS.DOCTORS}/${id}`),

  // Create doctor (includes user credentials)
  create: (data: CreateDoctorData) => api.post(API_ENDPOINTS.DOCTORS, data),

  // Update doctor (includes user credentials - same payload as create)
  update: (id: string, data: UpdateDoctorData) =>
    api.patch(`${API_ENDPOINTS.DOCTORS}/${id}`, data),

  // Delete doctor
  delete: (id: string) => api.delete(`${API_ENDPOINTS.DOCTORS}/${id}`),

  // Get available doctors for appointment
  getAvailable: (hospitalId: string, date: string) =>
    api.get(`${API_ENDPOINTS.DOCTORS}/available?hospitalId=${hospitalId}&date=${date}`),
};
