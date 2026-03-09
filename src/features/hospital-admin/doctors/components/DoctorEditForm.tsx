import { DoctorStatus } from '@/types/doctor.type';
import { DoctorForm } from './DoctorForm';

interface DoctorEditFormProps {
  initialValues: {
    id: string;
    experience: string;
    bio?: string | null;
    department_id?: string | null;
    status?: DoctorStatus;
    license_certificate_id?: string | null;
    user: {
      name: string;
      email: string;
      phone_number: string;
      profile_image_id?: string | null;
    };
  };
  onSubmit: (data: any) => void | Promise<void>;
  loading?: boolean;
  onCancel?: () => void;
}

/**
 * @deprecated Use DoctorForm directly instead
 */
export function DoctorEditForm({
  initialValues,
  onSubmit,
  onCancel,
}: DoctorEditFormProps) {
  // This wrapper is deprecated - use DoctorForm directly
  const handleSuccess = () => {
    onSubmit({} as any);
    onCancel?.();
  };

  return (
    <DoctorForm doctor={initialValues} onSuccess={handleSuccess} />
  );
}
