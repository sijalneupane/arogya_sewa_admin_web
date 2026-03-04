import api from './axios';
import { API_ENDPOINTS } from './endpoints';
import { Department, CreateDepartmentData, UpdateDepartmentData, DepartmentListResponse } from '../types/department.type';

export interface DepartmentSearchParams {
  name?: string;
}

export const departmentApi = {
  // Get all departments for the current logged-in hospital admin's hospital
  getAll: (params: DepartmentSearchParams = {}) => {
    const query = new URLSearchParams();
    if (params.name) query.append('name', params.name);
    return api.get<DepartmentListResponse>(`${API_ENDPOINTS.DEPARTMENTS_MY}?${query.toString()}`);
  },

  // Get department by ID
  getById: (id: string) =>
    api.get<Department>(`${API_ENDPOINTS.DEPARTMENTS}/${id}`),

  // Create department
  create: (data: CreateDepartmentData) =>
    api.post<Department>(API_ENDPOINTS.DEPARTMENTS, data),

  // Update department
  update: (id: string, data: UpdateDepartmentData) =>
    api.patch<Department>(`${API_ENDPOINTS.DEPARTMENTS}/${id}`, data),

  // Delete department
  delete: (id: string) =>
    api.delete(`${API_ENDPOINTS.DEPARTMENTS}/${id}`),
};
