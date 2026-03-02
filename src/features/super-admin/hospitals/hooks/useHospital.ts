import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hospitalApi, HospitalSearchParams } from '@/api/hospital.api';
import { Hospital, PaginationMeta, HospitalListResponse } from '@/types/hospital.type';

const DEBOUNCE_MS = 500;
const PAGE_SIZE = 10;

interface UseHospitalReturn {
  hospitals: Hospital[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  fetchHospitals: (page?: number) => void;
}

export const useHospital = (filters: Omit<HospitalSearchParams, 'page' | 'size'> = {}): UseHospitalReturn => {
  const [page, setPage] = useState(1);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  // Debounce filter changes — skips on initial mount
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

  const queryKey = [
    'hospitals',
    debouncedFilters.name ?? '',
    debouncedFilters.address ?? '',
    debouncedFilters.opened_date_from ?? '',
    debouncedFilters.opened_date_to ?? '',
    page,
    PAGE_SIZE,
  ] as const;

  const { data, isFetching, error: queryError, refetch } = useQuery<HospitalListResponse>({
    queryKey,
    queryFn: async () =>
      (await hospitalApi.getAll({
        ...debouncedFilters,
        page,
        size: PAGE_SIZE,
      })) as unknown as HospitalListResponse,
    staleTime: 30_000,
  });

  /**
   * fetchHospitals(page) — navigate to a page (changes queryKey → React Query fetches).
   * fetchHospitals()    — retry the current page (calls refetch() to bypass cache).
   */
  const fetchHospitals = useCallback((pg?: number) => {
    if (pg !== undefined && pg !== page) {
      setPage(pg);
    } else {
      refetch();
    }
  }, [page, refetch]);

  return {
    hospitals: data?.data ?? [],
    loading: isFetching,
    error: queryError ? (queryError instanceof Error ? queryError.message : 'Failed to fetch hospitals') : null,
    pagination: data?.paginationMeta ?? null,
    fetchHospitals,
  };
};
