import { useQuery } from '@tanstack/react-query';
import { availabilityApi, DoctorAvailabilityFilters } from '@/api/availability.api';
import { DoctorAvailability, DoctorAvailabilityListResponse } from '@/types/availability.type';
import { PaginationMeta } from '@/types/doctor.type';

interface UseDoctorAvailabilitiesOptions extends DoctorAvailabilityFilters {
  page?: number;
  pageSize?: number;
}

interface UseDoctorAvailabilitiesReturn {
  availabilities: DoctorAvailability[];
  loading: boolean;
  /** In-flight request while an earlier response is still shown (e.g. pagination) */
  isRefreshing: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  refetch: () => void;
}

function queryErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export function useDoctorAvailabilities(
  doctorId: string | undefined,
  options: UseDoctorAvailabilitiesOptions = {}
): UseDoctorAvailabilitiesReturn {
  const { page = 1, pageSize = 10, is_booked, future_only } = options;

  const queryKey = [
    'doctor-availabilities',
    doctorId ?? '',
    is_booked ?? 'all',
    future_only ?? 'any',
    page,
    pageSize,
  ] as const;

  const { data, isFetching, error: queryError, refetch } = useQuery({
    queryKey,
    queryFn: async () =>
      (await availabilityApi.listByDoctor(doctorId!, {
        is_booked,
        future_only,
        page,
        size: pageSize,
      })) as unknown as DoctorAvailabilityListResponse,
    enabled: Boolean(doctorId),
    staleTime: 45_000,
    gcTime: 5 * 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const errorMessage = queryError ? queryErrorMessage(queryError, 'Failed to load availability') : null;

  const loading = isFetching && data == null;
  const isRefreshing = isFetching && data != null;

  return {
    availabilities: data?.data ?? [],
    loading,
    isRefreshing,
    error: errorMessage,
    pagination: data?.paginationMeta ?? null,
    refetch,
  };
}
