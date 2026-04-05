import api from './axios';
import { API_ENDPOINTS } from './endpoints';
import {
  CreateDoctorAvailabilityData,
  DoctorAvailabilityListResponse,
  UpdateDoctorAvailabilityData,
} from '@/types/availability.type';

export interface DoctorAvailabilityFilters {
  is_booked?: boolean;
  future_only?: boolean;
  page?: number;
  size?: number;
}

export const availabilityApi = {
  listByDoctor: (doctorId: string, filters: DoctorAvailabilityFilters = {}) => {
    const query = new URLSearchParams();
    if (filters.is_booked !== undefined) query.append('is_booked', String(filters.is_booked));
    if (filters.future_only !== undefined) query.append('future_only', String(filters.future_only));
    if (filters.page != null) query.append('page', String(filters.page));
    if (filters.size != null) query.append('size', String(filters.size));
    const qs = query.toString();
    const path = `${API_ENDPOINTS.AVAILABILITIES_DOCTOR(doctorId)}${qs ? `?${qs}` : ''}`;
    return api.get<DoctorAvailabilityListResponse>(path);
  },

  create: (data: CreateDoctorAvailabilityData) => api.post(API_ENDPOINTS.AVAILABILITIES, data),

  update: (availabilityId: string, data: UpdateDoctorAvailabilityData) =>
    api.patch(`${API_ENDPOINTS.AVAILABILITIES}/${availabilityId}`, data),

  delete: (availabilityId: string) =>
    api.delete(`${API_ENDPOINTS.AVAILABILITIES}/${availabilityId}`),
};
