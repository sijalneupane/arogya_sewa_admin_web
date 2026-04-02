import { useQuery } from '@tanstack/react-query';
import { paymentApi } from '@/api/payment.api';
import { AppointmentPayment } from '@/types/payment.type';

function normalizePayments(payload: unknown): AppointmentPayment[] {
  if (Array.isArray(payload)) return payload as AppointmentPayment[];
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return (payload as { data: AppointmentPayment[] }).data;
  }
  return [];
}

function queryErrorMessage(err: unknown, fallback: string): string {
  if (
    err &&
    typeof err === 'object' &&
    'message' in err &&
    typeof (err as { message: unknown }).message === 'string'
  ) {
    return (err as { message: string }).message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export function useAppointmentPayments(appointmentId: string | undefined) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['appointment-payments', appointmentId],
    queryFn: async () => {
      const res = await paymentApi.getByAppointmentId(appointmentId!);
      return normalizePayments(res);
    },
    enabled: Boolean(appointmentId),
    staleTime: 30_000,
    retry: false,
  });

  return {
    payments: data ?? [],
    loading: isLoading,
    error: error ? queryErrorMessage(error, 'Failed to load payments') : null,
    refetch,
  };
}
