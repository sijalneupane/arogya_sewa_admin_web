import { useForm } from 'react-hook-form';
import { UpdateDoctorUserData } from '@/types/doctor.type';
import { Button } from '@/components/ui/button';

interface UserEditFormProps {
  initialValues: {
    email: string;
    name: string;
    phone_number: string;
  };
  onSubmit: (data: UpdateDoctorUserData) => void | Promise<void>;
  loading?: boolean;
}

export function UserEditForm({
  initialValues,
  onSubmit,
  loading = false,
}: UserEditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateDoctorUserData>({
    defaultValues: {
      email: initialValues.email,
      name: initialValues.name,
      phone_number: initialValues.phone_number,
    },
  });

  const handleFormSubmit = (data: UpdateDoctorUserData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Dr. John Smith"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="doctor@hospital.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register('phone_number', {
              required: 'Phone number is required',
              pattern: {
                value: /^[0-9+\-\s()]+$/,
                message: 'Invalid phone number',
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+977 9841000000"
          />
          {errors.phone_number && (
            <p className="text-red-500 text-xs mt-1">{errors.phone_number.message}</p>
          )}
        </div>


      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update User Info'}
        </Button>
      </div>
    </form>
  );
}
