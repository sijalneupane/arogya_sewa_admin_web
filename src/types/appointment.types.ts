export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  doctorId: string;
  doctorName: string;
  hospitalId: string;
  date: string;
  timeSlot: string;
  reason: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  doctorId: string;
  hospitalId: string;
  date: string;
  timeSlot: string;
  reason: string;
  notes?: string;
}

export interface AppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  today: number;
}