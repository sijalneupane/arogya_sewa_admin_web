import { useQuery } from '@tanstack/react-query';
import { doctorApi } from '@/api/doctor.api';
import { Doctor } from '@/types/doctor.type';

interface UseDoctorByIdReturn {
  doctor: Doctor | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<unknown>;
}

function queryErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

/** Shares cache with EditDoctorPage via queryKey ['doctor', id]. */
export const useDoctorById = (id: string | undefined): UseDoctorByIdReturn => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['doctor', id],
    queryFn: () => doctorApi.getById(id!),
    enabled: Boolean(id),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const doctor = data?.data ?? null;

  return {
    doctor,
    loading: isLoading,
    error: error ? queryErrorMessage(error, 'Failed to fetch doctor details') : null,
    refetch,
  };
};
