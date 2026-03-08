import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DoctorStatus } from '@/types/doctor.type';
import { Button } from '@/components/ui/button';
import { DepartmentSelect } from '@/features/hospital-admin/doctors/components/DepartmentSelect';
import { StatusSelect } from '@/features/hospital-admin/doctors/components/StatusSelect';
import { FileUpload } from '@/features/hospital-admin/doctors/components/FileUpload';

interface DoctorInfo {
  experience: string;
  bio?: string | null;
  department_id?: string | null;
  status?: DoctorStatus;
  license_certificate_id?: string | null;
}

interface DoctorEditFormProps {
  initialValues: DoctorInfo;
  onSubmit: (data: DoctorInfo) => void | Promise<void>;
  loading?: boolean;
}

export function DoctorEditForm({
  initialValues,
  onSubmit,
  loading = false,
}: DoctorEditFormProps) {
  const [licenseFile, setLicenseFile] = useState<{ file_id: string; file_type: string } | null>(
    initialValues.license_certificate_id ? { file_id: initialValues.license_certificate_id, file_type: 'license' } : null
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DoctorInfo>({
    defaultValues: {
      experience: initialValues.experience,
      bio: initialValues.bio,
      department_id: initialValues.department_id,
      status: initialValues.status,
    },
  });

  const handleLicenseUpload = (fileData: { file_id: string; file_type: string } | null) => {
    setLicenseFile(fileData);
  };

  const handleFormSubmit = (data: DoctorInfo) => {
    const submitData: DoctorInfo = {
      ...data,
      license_certificate_id: licenseFile?.file_id || null,
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Experience <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('experience', { required: 'Experience is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. 5 years, 6 months"
          />
          {errors.experience && (
            <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <StatusSelect
            value={watch('status') || null}
            onChange={(value) => setValue('status', value || undefined)}
            placeholder="Select status"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Department</label>
        <DepartmentSelect
          value={watch('department_id') || null}
          onChange={(value) => setValue('department_id', value)}
          placeholder="Select department (optional)"
          clearable
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          {...register('bio')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Write a brief bio about the doctor..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">License Certificate</label>
        <FileUpload
          onFileUploaded={handleLicenseUpload}
          initialFile={initialValues.license_certificate_id ? { file_id: initialValues.license_certificate_id, file_type: 'license' } : null}
        />
        <p className="text-xs text-gray-500 mt-1">
          Upload the doctor&apos;s medical license certificate (PDF or Image, max 5MB)
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Doctor Info'}
        </Button>
      </div>
    </form>
  );
}
