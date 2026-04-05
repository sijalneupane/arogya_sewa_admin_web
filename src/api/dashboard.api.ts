import api from './axios';
import { API_ENDPOINTS } from './endpoints';
import type { SuperAdminDashboardSummary, HospitalAdminDashboardSummary } from '@/types/dashboard.types';

type ApiEnvelope<T> = {
  data: T;
};

const unwrapResponse = <T>(payload: T | ApiEnvelope<T>): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
};

export const dashboardApi = {
  getSuperAdminSummary: async (): Promise<SuperAdminDashboardSummary> => {
    const response = await api.get<SuperAdminDashboardSummary | ApiEnvelope<SuperAdminDashboardSummary>>(
      API_ENDPOINTS.SUPER_ADMIN_DASHBOARD_SUMMARY
    );
    return unwrapResponse(response);
  },

  getHospitalAdminSummary: async (): Promise<HospitalAdminDashboardSummary> => {
    const response = await api.get<HospitalAdminDashboardSummary | ApiEnvelope<HospitalAdminDashboardSummary>>(
      API_ENDPOINTS.HOSPITAL_ADMIN_DASHBOARD_SUMMARY
    );
    return unwrapResponse(response);
  },
};
