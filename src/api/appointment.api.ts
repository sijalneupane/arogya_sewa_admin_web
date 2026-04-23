import api from './axios';
import { API_ENDPOINTS } from './endpoints';
import { CreateAppointmentData } from '../types/appointment.types';
import {
  HospitalAdminAppointmentDetailResponse,
  HospitalAdminAppointmentFilters,
  HospitalAdminAppointmentListResponse,
} from '../types/hospitalAdminAppointment.type';

export const appointmentApi = {
  getHospitalAdminAppointments: (filters: HospitalAdminAppointmentFilters = {}) => {
    const query = new URLSearchParams();
    if (filters.doctor_name) query.append('doctor_name', filters.doctor_name);
    if (filters.patient_name) query.append('patient_name', filters.patient_name);
    if (filters.status) query.append('status', filters.status);
    if (filters.date_from) query.append('date_from', filters.date_from);
    if (filters.date_to) query.append('date_to', filters.date_to);
    if (filters.appointment_date) query.append('appointment_date', filters.appointment_date);
    if (filters.page != null) query.append('page', String(filters.page));
    if (filters.size != null) query.append('size', String(filters.size));
    const qs = query.toString();
    const path = qs
      ? `${API_ENDPOINTS.APPOINTMENTS_HOSPITAL_ADMIN}?${qs}`
      : API_ENDPOINTS.APPOINTMENTS_HOSPITAL_ADMIN;
    return api.get<HospitalAdminAppointmentListResponse>(path);
  },

  // Get all appointments for a hospital
  getAll: (hospitalId: string, filters?: any) =>
    api.get(`${API_ENDPOINTS.APPOINTMENTS}?hospitalId=${hospitalId}`, { params: filters }),
  
  // Get today's appointments
  getToday: (hospitalId: string) => 
    api.get(`${API_ENDPOINTS.APPOINTMENTS}/today?hospitalId=${hospitalId}`),
  
  getById: (id: string) =>
    api.get<HospitalAdminAppointmentDetailResponse>(`${API_ENDPOINTS.APPOINTMENTS}/${id}`),
  
  // Create appointment
  create: (data: CreateAppointmentData) => api.post(API_ENDPOINTS.APPOINTMENTS, data),
  
  // Update appointment
  update: (id: string, data: Partial<CreateAppointmentData>) => 
    api.put(`${API_ENDPOINTS.APPOINTMENTS}/${id}`, data),

  // Mark appointment as complete
  complete: (id: string, completedAt: string) =>
    api.patch<HospitalAdminAppointmentDetailResponse>(`${API_ENDPOINTS.APPOINTMENTS}/${id}/complete`, {
      completed_at: completedAt,
    }),
  
  // Cancel appointment
  cancel: (id: string) => api.delete(`${API_ENDPOINTS.APPOINTMENTS}/${id}`),
  
  // Get appointment statistics
  getStats: (hospitalId: string) => 
    api.get(`${API_ENDPOINTS.APPOINTMENT_STATS}?hospitalId=${hospitalId}`),
};