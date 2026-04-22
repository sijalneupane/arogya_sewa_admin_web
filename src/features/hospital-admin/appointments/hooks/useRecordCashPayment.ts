import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { paymentApi } from '@/api/payment.api';
import { RecordCashPaymentRequest } from '@/types/payment.type';

function queryErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export function useRecordCashPayment(appointmentId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RecordCashPaymentRequest) => paymentApi.recordCashPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospital-admin-appointment', appointmentId] });
      queryClient.invalidateQueries({ queryKey: ['appointment-payments', appointmentId] });
      toast.success('Cash payment recorded successfully');
    },
    onError: (error: unknown) => {
      toast.error(queryErrorMessage(error, 'Failed to record cash payment'));
    },
  });
}
