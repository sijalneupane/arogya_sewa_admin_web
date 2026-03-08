import { useState, useEffect, useRef } from 'react';
import { doctorApi } from '@/api/doctor.api';
import { Doctor } from '@/types/doctor.type';

interface UseDoctorByIdReturn {
  doctor: Doctor | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDoctorById = (id: string | undefined): UseDoctorByIdReturn => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
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

    const fetchDoctor = async () => {
      try {
        const response = await doctorApi.getById(id);
        setDoctor(response.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch doctor details';
        setError(errorMessage);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const refetch = async () => {
    if (!id) {
      setError('Doctor ID is required');
      return;
    }

    currentIdRef.current = undefined; // Reset to allow refetch
    setError(null);
    setLoading(true);

    try {
      const response = await doctorApi.getById(id);
      setDoctor(response.data);
      currentIdRef.current = id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch doctor details';
      setError(errorMessage);
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  };

  return { doctor, loading, error, refetch };
};
