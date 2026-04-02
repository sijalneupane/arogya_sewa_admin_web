import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { appointmentApi } from '@/api/appointment.api';
import {
  HospitalAdminAppointment,
  HospitalAdminAppointmentFilters,
  HospitalAdminAppointmentListResponse,
} from '@/types/hospitalAdminAppointment.type';
import { PaginationMeta } from '@/types/doctor.type';

const DEBOUNCE_MS = 500;

interface UseHospitalAdminAppointmentsOptions extends Omit<HospitalAdminAppointmentFilters, 'page' | 'size'> {
  page?: number;
  pageSize?: number;
}

interface UseHospitalAdminAppointmentsReturn {
  appointments: HospitalAdminAppointment[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  refetch: () => void;
}

export function useHospitalAdminAppointments(
  options: UseHospitalAdminAppointmentsOptions = {}
): UseHospitalAdminAppointmentsReturn {
  const { page = 1, pageSize = 10, ...filterFields } = options;
  const [debouncedFilters, setDebouncedFilters] = useState({
    doctor_name: filterFields.doctor_name,
    patient_name: filterFields.patient_name,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedFilters({
        doctor_name: filterFields.doctor_name,
        patient_name: filterFields.patient_name,
      });
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [filterFields.doctor_name, filterFields.patient_name]);

  const queryKey = [
    'hospital-admin-appointments',
    debouncedFilters.doctor_name ?? '',
    debouncedFilters.patient_name ?? '',
    filterFields.status ?? '',
    filterFields.date_from ?? '',
    filterFields.date_to ?? '',
    filterFields.appointment_date ?? '',
    page,
    pageSize,
  ] as const;

  const { data, isFetching, error: queryError, refetch } = useQuery<HospitalAdminAppointmentListResponse>({
    queryKey,
    queryFn: async () =>
      (await appointmentApi.getHospitalAdminAppointments({
        doctor_name: debouncedFilters.doctor_name || undefined,
        patient_name: debouncedFilters.patient_name || undefined,
        status: filterFields.status || undefined,
        date_from: filterFields.date_from || undefined,
        date_to: filterFields.date_to || undefined,
        appointment_date: filterFields.appointment_date || undefined,
        page,
        size: pageSize,
      })) as unknown as HospitalAdminAppointmentListResponse,
    staleTime: 30_000,
    retry: false,
  });

  const refetchAppointments = useCallback(() => {
    refetch();
  }, [refetch]);

  const errorMessage = queryError
    ? (queryError as { message?: string })?.message || 'Failed to fetch appointments'
    : null;

  return {
    appointments: data?.data ?? [],
    loading: isFetching,
    error: errorMessage,
    pagination: data?.paginationMeta ?? null,
    refetch: refetchAppointments,
  };
}
