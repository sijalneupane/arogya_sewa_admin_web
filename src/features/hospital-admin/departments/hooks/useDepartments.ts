import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { departmentApi, DepartmentSearchParams } from '@/api/department.api';
import { Department, DepartmentListResponse } from '@/types/department.type';

const DEBOUNCE_MS = 500;

interface UseDepartmentsReturn {
  departments: Department[];
  loading: boolean;
  error: string | null;
  fetchDepartments: () => void;
}

export const useDepartments = (filters: DepartmentSearchParams = {}): UseDepartmentsReturn => {
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
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.name]);

  const queryKey = [
    'departments',
    debouncedFilters.name ?? '',
  ] as const;

  const { data, isFetching, error: queryError, refetch } = useQuery<DepartmentListResponse>({
    queryKey,
    queryFn: async () =>
      (await departmentApi.getAll(debouncedFilters)) as unknown as DepartmentListResponse,
    staleTime: 30_000,
    enabled: true, // Always enable query to fetch on mount
    retry: false, // Don't auto-retry, let user manually retry
  });

  const fetchDepartments = useCallback(() => {
    refetch();
  }, [refetch]);

  // Extract error message properly
  const errorMessage = queryError
    ? (queryError as any)?.message || 'Failed to fetch departments'
    : null;

  return {
    departments: data?.data ?? [],
    loading: isFetching,
    error: errorMessage,
    fetchDepartments,
  };
};
