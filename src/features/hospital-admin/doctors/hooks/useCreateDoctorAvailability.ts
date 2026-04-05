import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { availabilityApi } from '@/api/availability.api';
import { CreateDoctorAvailabilityData } from '@/types/availability.type';

function queryErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export function useCreateDoctorAvailability(doctorId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDoctorAvailabilityData) => availabilityApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-availabilities', doctorId] });
      toast.success('Doctor availability added successfully');
    },
    onError: (error: unknown) => {
      toast.error(queryErrorMessage(error, 'Failed to add doctor availability'));
    },
  });
}