export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  registrationNumber: string;
  totalDoctors: number;
  activeAppointments: number;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  adminId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHospitalData {
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  registrationNumber: string;
  admin: {
    name: string;
    email: string;
    password: string;
  };
}

export interface HospitalStats {
  totalHospitals: number;
  activeHospitals: number;
  totalDoctors: number;
  totalAppointments: number;
}