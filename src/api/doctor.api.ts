import api from './axios';
import { API_ENDPOINTS } from './endpoints';
import { Doctor, CreateDoctorData } from '../types/doctor.types';

export const doctorApi = {
  // Get all doctors for a hospital
  getAll: (hospitalId: string) => 
    api.get(`${API_ENDPOINTS.DOCTORS}?hospitalId=${hospitalId}`),
  
  // Get doctor by ID
  getById: (id: string) => api.get(`${API_ENDPOINTS.DOCTORS}/${id}`),
  
  // Create doctor
  create: (data: CreateDoctorData) => api.post(API_ENDPOINTS.DOCTORS, data),
  
  // Update doctor
  update: (id: string, data: Partial<CreateDoctorData>) => 
    api.put(`${API_ENDPOINTS.DOCTORS}/${id}`, data),
  
  // Delete doctor
  delete: (id: string) => api.delete(`${API_ENDPOINTS.DOCTORS}/${id}`),
  
  // Get available doctors for appointment
  getAvailable: (hospitalId: string, date: string) => 
    api.get(`${API_ENDPOINTS.DOCTORS}/available?hospitalId=${hospitalId}&date=${date}`),
};