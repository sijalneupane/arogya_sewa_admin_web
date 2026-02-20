import { useState, useEffect, useRef } from 'react';
import { hospitalApi, HospitalSearchParams } from '@/api/hospital.api';
import { Hospital, PaginationMeta, HospitalListResponse } from '@/types/hospital.type';

const DEBOUNCE_MS = 400;

interface UseHospitalReturn {
  hospitals: Hospital[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  fetchHospitals: (page?: number, pageSize?: number) => Promise<void>;
}

export const useHospital = (filters: Omit<HospitalSearchParams, 'page' | 'size'> = {}): UseHospitalReturn => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Debounced filters
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedFilters(filters);
      setPage(1); // reset to first page on filter change
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.name, filters.address, filters.opened_date_from, filters.opened_date_to]);

  const fetchHospitals = async (pg = page, ps = pageSize) => {
    setLoading(true);
    setError(null);
    try {
      // Axios interceptor unwraps response.data, so response is HospitalListResponse directly
      const response = (await hospitalApi.getAll({ ...debouncedFilters, page: pg, size: ps })) as unknown as HospitalListResponse;
      setHospitals(response.data);
      setPagination(response.paginationMeta);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hospitals';
      setError(errorMessage);
      setHospitals([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever debounced filters or page change
  useEffect(() => {
    fetchHospitals(page, pageSize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters, page]);

  const handlePageChange = async (pg?: number, _ps?: number) => {
    setPage(pg ?? 1);
  };

  return { hospitals, loading, error, pagination, fetchHospitals: handlePageChange };
};
