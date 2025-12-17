import api from './axios';
import { API_ENDPOINTS } from './endpoints';
import { Appointment, CreateAppointmentData } from '../types/appointment.types';

export const appointmentApi = {
  // Get all appointments for a hospital
  getAll: (hospitalId: string, filters?: any) => 
    api.get(`${API_ENDPOINTS.APPOINTMENTS}?hospitalId=${hospitalId}`, { params: filters }),
  
  // Get today's appointments
  getToday: (hospitalId: string) => 
    api.get(`${API_ENDPOINTS.APPOINTMENTS}/today?hospitalId=${hospitalId}`),
  
  // Get appointment by ID
  getById: (id: string) => api.get(`${API_ENDPOINTS.APPOINTMENTS}/${id}`),
  
  // Create appointment
  create: (data: CreateAppointmentData) => api.post(API_ENDPOINTS.APPOINTMENTS, data),
  
  // Update appointment
  update: (id: string, data: Partial<CreateAppointmentData>) => 
    api.put(`${API_ENDPOINTS.APPOINTMENTS}/${id}`, data),
  
  // Cancel appointment
  cancel: (id: string) => api.delete(`${API_ENDPOINTS.APPOINTMENTS}/${id}`),
  
  // Get appointment statistics
  getStats: (hospitalId: string) => 
    api.get(`${API_ENDPOINTS.APPOINTMENT_STATS}?hospitalId=${hospitalId}`),
};