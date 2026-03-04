import { FileObject } from './file.types';

export interface UserRole {
  role: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone_number: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profile_img: FileObject | null;
}

export interface PaginationMeta {
  totalPage: number;
  currentPage: number;
  pageSize: number;
  totalRecords: number;
}

export interface UserListResponse {
  message: string;
  data: User[];
  paginationMeta: PaginationMeta;
}
