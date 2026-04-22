import { HospitalAdminAppointment } from '@/types/hospitalAdminAppointment.type';

export function isPaymentConditionMet(
  appointment: HospitalAdminAppointment,
  paymentsCount: number
): boolean {
  return (
    appointment.paid_amount === appointment.advance_fee &&
    appointment.payment_status === 'Partial' && appointment.status === 'Confirmed' &&
    paymentsCount === 1
  );
}

export function isTimeConditionMet(
  startDateTime: string,
  endDateTime: string,
  now: Date = new Date()
): boolean {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  const windowStart = new Date(start.getTime() - 15 * 60 * 1000);
  return now >= windowStart && now < end;
}

export function isEligibleForCashPayment(
  appointment: HospitalAdminAppointment,
  paymentsCount: number,
  now: Date = new Date()
): boolean {
  
    console.log('Eligibility check:', {
      paymentCondition: isPaymentConditionMet(appointment, paymentsCount),
      timeCondition: isTimeConditionMet(
        appointment.availability.start_date_time,
        appointment.availability.end_date_time,
        now
      ),
    })  
  return (
    isPaymentConditionMet(appointment, paymentsCount) &&
    isTimeConditionMet(
      appointment.availability.start_date_time,
      appointment.availability.end_date_time,
      now
    )  
  );
}
