import { PaginationMeta } from './doctor.type';

export interface CreateDoctorAvailabilityData {
  doctor_id: string;
  start_date_time: string;
  end_date_time: string;
  note: string;
}

export interface UpdateDoctorAvailabilityData {
  start_date_time: string;
  end_date_time: string;
  note: string;
}

export interface DoctorAvailability {
  availability_id: string;
  doctor_id: string;
  start_date_time: string;
  end_date_time: string;
  note: string;
  is_booked: boolean;
}

export interface DoctorAvailabilityListResponse {
  message: string;
  data: DoctorAvailability[];
  paginationMeta: PaginationMeta;
}
