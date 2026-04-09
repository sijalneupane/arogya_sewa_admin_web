import { Department } from './department.type';
import { FileObject } from './file.types';
import { User } from './user.type';

export enum DoctorStatus {
  ACTIVE = 'Active',
  ON_LEAVE = 'On Leave',
  INACTIVE = 'Inactive',
}

export interface Doctor {
  doctor_id: string;
  experience: string;
  booking_fee?: number | null;
  fee?: number | null;
  status: DoctorStatus;
  bio: string | null;
  license_certificate: FileObject | null;
  hospital_id: string;
  department: Department | null;
  user: User;
}

export interface PaginationMeta {
  totalPage: number;
  currentPage: number;
  pageSize: number;
  totalRecords: number;
}

export interface DoctorListResponse {
  message: string;
  data: Doctor[];
  paginationMeta: PaginationMeta;
}

export interface CreateDoctorData {
  experience: string;
  fee?: number | null;
  license_certificate_id?: string | null;
  department_id?: string | null;
  bio?: string | null;
  status: DoctorStatus| null;
  user: {
    email: string;
    name: string;
    phone_number: string;
    password: string;
    profile_image_id?: string | null;
  };
}

export interface UpdateDoctorData {
  experience: string;
  fee?: number | null;
  license_certificate_id?: string | null;
  department_id?: string | null;
  status?: DoctorStatus;
  bio?: string | null;
  user: {
    name: string;
    email: string;
    phone_number: string;
    password: string;
    profile_image_id?: string | null;
  };
}

// Deprecated: Use UpdateDoctorData instead
export interface UpdateDoctorUserData {
  email?: string;
  name?: string;
  phone_number?: string;
  password?: string;
}

export interface AvailableDoctor {
  id: string;
  name: string;
  specialization: string;
  availableSlots: string[];
}
