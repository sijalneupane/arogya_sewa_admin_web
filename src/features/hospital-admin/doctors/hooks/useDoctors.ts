import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorApi, DoctorFilters } from '@/api/doctor.api';
import { Doctor, DoctorListResponse, PaginationMeta } from '@/types/doctor.type';
import toast from 'react-hot-toast';

const DEBOUNCE_MS = 500;

interface UseDoctorsOptions extends DoctorFilters {
  page?: number;
  pageSize?: number;
}

interface UseDoctorsReturn {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  fetchDoctors: () => void;
  deleteDoctor: (doctorId: string) => Promise<boolean>;
  isDeleting: boolean;
}

export const useDoctors = (options: UseDoctorsOptions = {}): UseDoctorsReturn => {
  const { page = 1, pageSize = 10, ...filters } = options;
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const queryClient = useQueryClient();

  // Debounce filter changes — skips on initial mount
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedFilters(filters);
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.name, filters.status, filters.department_id]);

  const queryKey = [
    'doctors-hospital-my',
    debouncedFilters.name ?? '',
    debouncedFilters.status ?? '',
    debouncedFilters.department_id ?? '',
    page,
    pageSize,
  ] as const;

  const { data, isFetching, error: queryError, refetch } = useQuery<DoctorListResponse>({
    queryKey,
    queryFn: async () =>
      (await doctorApi.getMyHospitalDoctors({
        ...debouncedFilters,
        page,
        size: pageSize,
      })) as unknown as DoctorListResponse,
    staleTime: 30_000,
    enabled: true,
    retry: false,
  });

  const fetchDoctors = useCallback(() => {
    refetch();
  }, [refetch]);

  // Delete mutation
  const { mutateAsync: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: (doctorId: string) => doctorApi.delete(doctorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors-hospital-my'] });
      toast.success('Doctor deleted successfully');
      return true;
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to delete doctor';
      toast.error(errorMessage);
      return false;
    },
  });

  const handleDelete = useCallback(async (doctorId: string): Promise<boolean> => {
    try {
      await deleteMutation(doctorId);
      return true;
    } catch {
      return false;
    }
  }, [deleteMutation]);

  // Extract error message properly
  const errorMessage = queryError
    ? (queryError as any)?.message || 'Failed to fetch doctors'
    : null;

  return {
    doctors: data?.data ?? [],
    loading: isFetching,
    error: errorMessage,
    pagination: data?.paginationMeta ?? null,
    fetchDoctors,
    deleteDoctor: handleDelete,
    isDeleting,
  };
};
