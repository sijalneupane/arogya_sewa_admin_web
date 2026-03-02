import api from './axios';
import { API_ENDPOINTS } from './endpoints';
import { UserListResponse } from '../types/user.type';

export interface UserSearchParams {
  page?: number;
  size?: number;
  search?: string;
  role?: string;
}

export const userApi = {
  // Get all users (Super Admin) with pagination, search and role filters
  getAll: (params: UserSearchParams = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.size) query.append('size', params.size.toString());
    if (params.search) query.append('search', params.search);
    if (params.role) query.append('role', params.role);
    return api.get<UserListResponse>(`${API_ENDPOINTS.USERS}?${query.toString()}`);
  },
};
