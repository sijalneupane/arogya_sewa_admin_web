import { User } from './user.type';

export interface RecordCashPaymentRequest {
  appointment_id: string;
  amount: number;
  user_id: string;
  remarks: string;
}

export interface RecordCashPaymentResponse {
  message: string;
  data: AppointmentPayment;
}

export interface AppointmentPayment {
  payment_id: string;
  appointment_id: string;
  paid_by_user_id: string;
  amount: number;
  payment_method: string;
  status: string;
  transaction_id: string;
  gateway_ref: string;
  remarks: string;
  paid_at: string;
  paid_by: User;
  created_at: string;
  updated_at: string;
}
