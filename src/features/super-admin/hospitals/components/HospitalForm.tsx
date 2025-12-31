import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hospitalApi } from '@/api/hospital.api';
import { createHospitalSchema } from '../schemas/hospital.schema';
import type { CreateHospitalData } from '@/types/hospital.types';
import { Button } from '@/components/ui/button';

interface HospitalFormProps {
  onSuccess?: () => void;
}

export default function HospitalForm({ onSuccess }: HospitalFormProps) {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors } } = useForm<CreateHospitalData>({
    resolver: zodResolver(createHospitalSchema),
  });
  
  const mutation = useMutation({
    mutationFn: (data: CreateHospitalData) => hospitalApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitals'] });
      queryClient.invalidateQueries({ queryKey: ['hospital-stats'] });
      onSuccess?.();
    },
  });
  
  const onSubmit = (data: CreateHospitalData) => {
    mutation.mutate(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hospital Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Hospital Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hospital Name</label>
              <input
                {...register('name')}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter hospital name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                {...register('address')}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter address"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  {...register('city')}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  {...register('state')}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="State"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Hospital Admin Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Hospital Admin</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Admin Name</label>
              <input
                {...register('admin.name')}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter admin name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Admin Email</label>
              <input
                {...register('admin.email')}
                type="email"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter admin email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                {...register('admin.password')}
                type="password"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter password"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" loading={mutation.isPending}>
          Create Hospital
        </Button>
      </div>
    </form>
  );//dahboard created
}