import { Department } from './department.type';
import { FileObject } from './file.types';
import { User } from './user.type';

export enum DoctorStatus {
  ACTIVE = 'Active',
  ON_LEAVE = 'On Leave',
  ON_APPOINTMENT = 'On Appointment',
  INACTIVE = 'Inactive',
}

export interface Doctor {
  doctor_id: string;
  experience: string;
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
  license_certificate_id?: string | null;
  department_id?: string | null;
  bio?: string | null;
  user: {
    email: string;
    name: string;
    phone_number: string;
    password: string;
    profile_image_id?: string | null;
  };
}

export interface UpdateDoctorData {
  experience?: string;
  license_certificate_id?: string | null;
  department_id?: string | null;
  status?: DoctorStatus;
  bio?: string | null;
}

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
