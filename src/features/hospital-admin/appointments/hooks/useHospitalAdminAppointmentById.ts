import { useQuery } from '@tanstack/react-query';
import { appointmentApi } from '@/api/appointment.api';
import {
  HospitalAdminAppointment,
  HospitalAdminAppointmentDetailResponse,
} from '@/types/hospitalAdminAppointment.type';

interface UseHospitalAdminAppointmentByIdReturn {
  appointment: HospitalAdminAppointment | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<unknown>;
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

export function useHospitalAdminAppointmentById(
  id: string | undefined
): UseHospitalAdminAppointmentByIdReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['hospital-admin-appointment', id],
    queryFn: async () =>
      (await appointmentApi.getById(id!)) as unknown as HospitalAdminAppointmentDetailResponse,
    enabled: Boolean(id),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    appointment: data?.data ?? null,
    loading: isLoading,
    error: error ? queryErrorMessage(error, 'Failed to fetch appointment') : null,
    refetch,
  };
}
