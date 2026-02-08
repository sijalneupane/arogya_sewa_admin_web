export interface FileObject {
  file_id: string;
  file_url: string;
  meta_type: string;
  file_type: string;
}

export interface Hospital {
  hospital_id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  contact_number: string[];
  opened_date: string;
  created_at: string;
  updated_at: string;
  admin_id: string;
  logo?: FileObject;
  license?: FileObject;
  banner?: FileObject;
}

export interface PaginationMeta {
  totalPage: number;
  currentPage: number;
  pageSize: number;
  totalRecords: number;
}

export interface HospitalListResponse {
  message: string;
  data: Hospital[];
  paginationMeta: PaginationMeta;
}

export interface CreateHospitalData {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  contact_number: string[];
  opened_date: string;
  hospital_license_id: string;
  logo_img_id: string;
  banner_img_id: string;
  admin_details: {
    email: string;
    name: string;
    phone_number: string;
    password: string;
  };
}

export interface UpdateHospitalData {
  name?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  contact_number?: string[];
  opened_date?: string;
  hospital_license_id?: string;
  logo_img_id?: string;
  banner_img_id?: string;
}

export interface HospitalStats {
  totalHospitals: number;
  activeHospitals: number;
  totalDoctors: number;
  totalAppointments: number;
}