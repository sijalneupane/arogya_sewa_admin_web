import { DoctorForm } from './DoctorForm';
import { CreateDoctorData } from '@/types/doctor.type';

interface DoctorCreateFormProps {
  onSubmit: (data: CreateDoctorData) => void | Promise<void>;
  loading?: boolean;
  onCancel?: () => void;
}

/**
 * @deprecated Use DoctorForm directly instead
 */
export function DoctorCreateForm({ onSubmit, onCancel }: DoctorCreateFormProps) {
  // This wrapper is deprecated - use DoctorForm directly
  const handleSuccess = () => {
    onSubmit({} as CreateDoctorData);
    onCancel?.();
  };

  return (
    <DoctorForm onSuccess={handleSuccess} />
  );
}
