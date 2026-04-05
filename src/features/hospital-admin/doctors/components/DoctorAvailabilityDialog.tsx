import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarClock, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DoctorAvailability, CreateDoctorAvailabilityData } from '@/types/availability.type';
import { useCreateDoctorAvailability } from '@/features/hospital-admin/doctors/hooks/useCreateDoctorAvailability';
import { useUpdateDoctorAvailability } from '@/features/hospital-admin/doctors/hooks/useUpdateDoctorAvailability';

interface DoctorAvailabilityDialogProps {
  doctorId: string;
  doctorName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availability?: DoctorAvailability | null;
}

interface DoctorAvailabilityFormValues {
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  note: string;
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
}

function toTimeValue(date: Date) {
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${hours}:${minutes}`;
}

function combineDateAndTime(dateValue: string, timeValue: string) {
  return new Date(`${dateValue}T${timeValue}:00`);
}

function createDefaultDateTimes() {
  const start = new Date();
  start.setMinutes(start.getMinutes() + 60);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 60);

  return {
    start_date: toDateValue(start),
    start_time: toTimeValue(start),
    end_date: toDateValue(end),
    end_time: toTimeValue(end),
  };
}

export function DoctorAvailabilityDialog({
  doctorId,
  doctorName,
  open,
  onOpenChange,
  availability,
}: DoctorAvailabilityDialogProps) {
  const mutationCreate = useCreateDoctorAvailability(doctorId);
  const mutationUpdate = useUpdateDoctorAvailability(doctorId);
  const isEditMode = Boolean(availability);
  const defaultValues = useMemo(
    () => ({
      ...createDefaultDateTimes(),
      note: availability?.note ?? '',
    }),
    [availability]
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<DoctorAvailabilityFormValues>({
    mode: 'onChange',
    defaultValues,
  });

  const startDate = watch('start_date');
  const startTime = watch('start_time');
  const endDate = watch('end_date');

  useEffect(() => {
    if (!open) return;
    if (availability) {
      const start = new Date(availability.start_date_time);
      const end = new Date(availability.end_date_time);
      reset({
        start_date: toDateValue(start),
        start_time: toTimeValue(start),
        end_date: toDateValue(end),
        end_time: toTimeValue(end),
        note: availability.note ?? '',
      });
      clearErrors();
      return;
    }
    reset({
      ...createDefaultDateTimes(),
      note: '',
    });
    clearErrors();
  }, [availability, clearErrors, open, reset]);

  const now = new Date();
  const todayDate = toDateValue(now);
  const currentTime = toTimeValue(now);

  const minStartDate = todayDate;
  const minStartTime = startDate && startDate === todayDate ? currentTime : '00:00';
  const minEndDate = startDate || todayDate;
  const minEndTime = endDate && startDate && endDate === startDate ? (startTime || '00:00') : '00:00';

  const handleClose = () => {
    if (!mutationCreate.isPending && !mutationUpdate.isPending) {
      onOpenChange(false);
    }
  };

  const isSubmitting = mutationCreate.isPending || mutationUpdate.isPending;

  const onSubmit = async (values: DoctorAvailabilityFormValues) => {
    const start = combineDateAndTime(values.start_date, values.start_time);
    const end = combineDateAndTime(values.end_date, values.end_time);

    if (Number.isNaN(start.getTime())) {
      setError('start_date', { type: 'validate', message: 'Select a valid start date and time' });
      return;
    }

    if (Number.isNaN(end.getTime())) {
      setError('end_date', { type: 'validate', message: 'Select a valid end date and time' });
      return;
    }

    if (start <= now) {
      setError('start_time', { type: 'validate', message: 'Start time must be after now' });
      return;
    }

    if (end <= start) {
      setError('end_time', { type: 'validate', message: 'End time must be after start time' });
      return;
    }

    const payload: CreateDoctorAvailabilityData = {
      doctor_id: doctorId,
      start_date_time: start.toISOString(),
      end_date_time: end.toISOString(),
      note: values.note.trim(),
    };

    if (availability) {
      await mutationUpdate.mutateAsync({
        availabilityId: availability.availability_id,
        data: {
          start_date_time: payload.start_date_time,
          end_date_time: payload.end_date_time,
          note: payload.note,
        },
      });
    } else {
      await mutationCreate.mutateAsync(payload);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : handleClose())}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-left">
            <CalendarClock className="h-5 w-5 text-blue-600" />
            {isEditMode ? 'Edit availability' : 'Add availability'}
          </DialogTitle>
          <DialogDescription className="text-left">
            {isEditMode
              ? `Update the availability window for ${doctorName}. Start time must be after the current time.`
              : `Create a new availability window for ${doctorName}. Start time must be after the current time.`}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="start_date">
                Start date
              </label>
              <Input
                id="start_date"
                type="date"
                min={minStartDate}
                {...register('start_date', {
                  required: 'Start date is required',
                })}
              />
              {errors.start_date && <p className="text-xs text-red-600">{errors.start_date.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="start_time">
                Start time
              </label>
              <Input
                id="start_time"
                type="time"
                step="60"
                min={minStartTime}
                {...register('start_time', {
                  required: 'Start time is required',
                })}
              />
              {errors.start_time && <p className="text-xs text-red-600">{errors.start_time.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="end_date">
                End date
              </label>
              <Input
                id="end_date"
                type="date"
                min={minEndDate}
                {...register('end_date', {
                  required: 'End date is required',
                })}
              />
              {errors.end_date && <p className="text-xs text-red-600">{errors.end_date.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="end_time">
                End time
              </label>
              <Input
                id="end_time"
                type="time"
                step="60"
                min={minEndTime}
                {...register('end_time', {
                  required: 'End time is required',
                })}
              />
              {errors.end_time && <p className="text-xs text-red-600">{errors.end_time.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="note">
              Note
            </label>
            <Textarea
              id="note"
              placeholder="Optional note for this time slot"
              rows={4}
              {...register('note')}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEditMode ? (
                'Update availability'
              ) : (
                'Add availability'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}