import { Department } from './department.type';
import { FileObject } from './file.types';
import { PaginationMeta } from './doctor.type';
import { User } from './user.type';

export interface AppointmentAvailabilitySlot {
  availability_id: string;
  doctor_id: string;
  start_date_time: string;
  end_date_time: string;
  note: string;
  is_booked: boolean;
}

export interface AppointmentHospitalSummary {
  hospital_id: string;
  name: string;
  location: string;
}

export interface HospitalAdminAppointmentPatient {
  patient_id: string;
  dob: string;
  gender: string;
  blood_group: string;
  user: User;
}

export interface HospitalAdminAppointmentDoctor {
  doctor_id: string;
  experience: string;
  status: string;
  bio: string | null;
  booking_fee: number;
  license_certificate: FileObject | null;
  hospital_id: string;
  hospital: AppointmentHospitalSummary;
  department: Department | null;
  user: User;
  upcoming_availability: AppointmentAvailabilitySlot | null;
}

export interface AppointmentChangedTime {
  changed_time_id: string;
  appointment_id: string;
  start_date_time: string;
  end_date_time: string;
  reason: string;
  changed_at: string;
  changed_by_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface HospitalAdminAppointment {
  appointment_id: string;
  patient: HospitalAdminAppointmentPatient;
  doctor: HospitalAdminAppointmentDoctor;
  booked_by: User;
  availability: AppointmentAvailabilitySlot;
  reason: string;
  notes: string;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  advance_fee: number;
  payment_status: string;
  status: string;
  changed_times: AppointmentChangedTime[];
  created_at: string;
  updated_at: string;
}

export interface HospitalAdminAppointmentListResponse {
  message: string;
  data: HospitalAdminAppointment[];
  paginationMeta: PaginationMeta;
}

export interface HospitalAdminAppointmentDetailResponse {
  message: string;
  data: HospitalAdminAppointment;
}

export interface HospitalAdminAppointmentFilters {
  doctor_name?: string;
  patient_name?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  appointment_date?: string;
  page?: number;
  size?: number;
}
