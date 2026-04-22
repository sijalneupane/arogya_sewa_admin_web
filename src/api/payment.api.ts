import api from './axios';
import { API_ENDPOINTS } from './endpoints';
import { AppointmentPayment, RecordCashPaymentRequest, RecordCashPaymentResponse } from '../types/payment.type';

export const paymentApi = {
  getByAppointmentId: (appointmentId: string) =>
    api.get<AppointmentPayment[]>(API_ENDPOINTS.PAYMENTS_BY_APPOINTMENT(appointmentId)),
  recordCashPayment: (data: RecordCashPaymentRequest) =>
    api.post<RecordCashPaymentResponse>(API_ENDPOINTS.CASH_PAYMENT_RECORD, data),
};
