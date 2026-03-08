import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateDoctorData } from '@/types/doctor.type';
import { Button } from '@/components/ui/button';
import { DepartmentSelect } from '@/features/hospital-admin/doctors/components/DepartmentSelect';
import { FileUpload } from '@/components/ui/FileUpload';

interface DoctorCreateFormProps {
  onSubmit: (data: CreateDoctorData) => void | Promise<void>;
  loading?: boolean;
  onCancel?: () => void;
}

export function DoctorCreateForm({
  onSubmit,
  loading = false,
  onCancel,
}: DoctorCreateFormProps) {
  const [licenseFile, setLicenseFile] = useState<{ file_id: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateDoctorData>({
    defaultValues: {
      experience: '',
      bio: '',
      department_id: null,
      user: {
        email: '',
        name: '',
        phone_number: '',
        password: '',
      },
    },
  });

  const handleLicenseUpload = (fileData: { file_id: string } | null) => {
    setLicenseFile(fileData);
  };

  const handleFormSubmit = (data: CreateDoctorData) => {
    const submitData: CreateDoctorData = {
      ...data,
      license_certificate_id: licenseFile?.file_id || null,
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* User Credentials Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          User Credentials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('user.name', { required: 'Name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Dr. John Smith"
            />
            {errors.user?.name && (
              <p className="text-red-500 text-xs mt-1">{errors.user.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register('user.email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="doctor@hospital.com"
            />
            {errors.user?.email && (
              <p className="text-red-500 text-xs mt-1">{errors.user.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              {...register('user.phone_number', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9+\-\s()]+$/,
                  message: 'Invalid phone number',
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+977 9841000000"
            />
            {errors.user?.phone_number && (
              <p className="text-red-500 text-xs mt-1">{errors.user.phone_number.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register('user.password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
            {errors.user?.password && (
              <p className="text-red-500 text-xs mt-1">{errors.user.password.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Doctor Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Doctor Information
        </h3>
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
            <label className="block text-sm font-medium mb-1">Department</label>
            <DepartmentSelect
              value={watch('department_id') || null}
              onChange={(value) => setValue('department_id', value)}
              placeholder="Select department (optional)"
              clearable
            />
          </div>
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
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload the doctor&apos;s medical license certificate (PDF or Image, max 5MB)
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Doctor'}
        </Button>
      </div>
    </form>
  );
}
