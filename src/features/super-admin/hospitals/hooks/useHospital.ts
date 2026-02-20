import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hospitalApi, HospitalSearchParams } from '@/api/hospital.api';
import { Hospital, PaginationMeta, HospitalListResponse } from '@/types/hospital.type';

const DEBOUNCE_MS = 500;

interface UseHospitalReturn {
  hospitals: Hospital[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  fetchHospitals: (page?: number, pageSize?: number) => Promise<void>;
}

export const useHospital = (filters: Omit<HospitalSearchParams, 'page' | 'size'> = {}): UseHospitalReturn => {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // Stable debounced filters — only updates after the user stops typing
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Skip debounce on initial mount so we don't fire an extra update
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedFilters(filters);
      setPage(1);
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.name, filters.address, filters.opened_date_from, filters.opened_date_to]);

  const { data, isFetching, error: queryError } = useQuery<HospitalListResponse>({
    queryKey: ['hospitals', debouncedFilters, page, PAGE_SIZE],
    queryFn: async () =>
      (await hospitalApi.getAll({
        ...debouncedFilters,
        page,
        size: PAGE_SIZE,
      })) as unknown as HospitalListResponse,
    staleTime: 30_000,
    placeholderData: (prev) => prev, // keep old data visible while re-fetching
  });

  const handlePageChange = async (pg?: number) => {
    setPage(pg ?? 1);
  };

  return {
    hospitals: data?.data ?? [],
    loading: isFetching,
    error: queryError ? (queryError instanceof Error ? queryError.message : 'Failed to fetch hospitals') : null,
    pagination: data?.paginationMeta ?? null,
    fetchHospitals: handlePageChange,
  };
};
