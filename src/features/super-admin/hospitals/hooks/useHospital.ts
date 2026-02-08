import { useState, useEffect, useCallback, useRef } from 'react';
import { hospitalApi } from '@/api/hospital.api';
import { Hospital, PaginationMeta } from '@/types/hospital.type';

interface UseHospitalReturn {
  hospitals: Hospital[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  fetchHospitals: (page?: number, pageSize?: number) => Promise<void>;
}

export const useHospital = (): UseHospitalReturn => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const initialFetchDone = useRef(false);

  const fetchHospitals = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await hospitalApi.getAll(page, pageSize);
      // Axios interceptor already unwraps response.data, so response is the actual data
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
  }, []);

  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchHospitals();
    }
  }, [fetchHospitals]);

  return { hospitals, loading, error, pagination, fetchHospitals };
};
