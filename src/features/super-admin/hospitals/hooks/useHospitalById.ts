import { useState, useEffect, useRef } from 'react';
import { hospitalApi } from '@/api/hospital.api';
import { Hospital } from '@/types/hospital.type';

interface UseHospitalByIdReturn {
  hospital: Hospital | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useHospitalById = (id: string | undefined): UseHospitalByIdReturn => {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Prevent duplicate fetches for the same ID
    if (!id || currentIdRef.current === id) {
      return;
    }

    currentIdRef.current = id;
    setLoading(true);
    setError(null);

    const fetchHospital = async () => {
      try {
        const response = await hospitalApi.getById(id);
        setHospital(response.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hospital details';
        setError(errorMessage);
        setHospital(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, [id]);

  const refetch = async () => {
    if (!id) {
      setError('Hospital ID is required');
      return;
    }

    currentIdRef.current = undefined; // Reset to allow refetch
    setError(null);
    setLoading(true);

    try {
      const response = await hospitalApi.getById(id);
      setHospital(response.data);
      currentIdRef.current = id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hospital details';
      setError(errorMessage);
      setHospital(null);
    } finally {
      setLoading(false);
    }
  };

  return { hospital, loading, error, refetch };
};
