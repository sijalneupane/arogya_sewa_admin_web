export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experience: number;
  consultationFee: number;
  availableDays: string[];
  availableTime: {
    start: string;
    end: string;
  };
  hospitalId: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface CreateDoctorData {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experience: number;
  consultationFee: number;
  availableDays: string[];
  availableTime: {
    start: string;
    end: string;
  };
  hospitalId: string;
}

export interface AvailableDoctor {
  id: string;
  name: string;
  specialization: string;
  availableSlots: string[];
}