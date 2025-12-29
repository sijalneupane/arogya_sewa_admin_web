export interface Hospital {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  contact_number: string[];
  opened_date: string;
  hospital_license_id: string;
  logo_img_id: string;
  banner_img_id: string;
  totalDoctors?: number;
  activeAppointments?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  adminId?: string;
  createdAt?: string;
  updatedAt?: string;
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