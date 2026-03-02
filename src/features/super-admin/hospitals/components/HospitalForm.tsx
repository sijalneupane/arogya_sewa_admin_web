import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { hospitalApi } from '@/api/hospital.api';
import { FileTypeEnum } from '@/api/fileupload.api';
import { createHospitalSchema, updateHospitalSchema } from '../schemas/hospital.schema';
import type { CreateHospitalData, UpdateHospitalData, FileObject } from '@/types/hospital.type.ts';
import { Button } from '@/components/ui/button';
import ImageUpload from './ImageUpload';
import MapSelector from './MapSelector';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/types/auth.types';

interface HospitalFormProps {
  hospital?: Partial<CreateHospitalData> & {
    id?: string;
    logo?: FileObject;
    license?: FileObject;
    banner?: FileObject;
  };
  onSuccess?: () => void;
}

export default function HospitalForm({ hospital, onSuccess }: HospitalFormProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isEditMode = !!hospital?.id;
  const isSuperAdmin = user?.role.role === UserRole.SUPER_ADMIN;
  const isHospitalAdmin = user?.role.role === UserRole.HOSPITAL_ADMIN;
  const [showPassword, setShowPassword] = useState(false);
  
  // Use different schema based on mode
  const { register, handleSubmit, control, formState: { errors } } = useForm<CreateHospitalData | UpdateHospitalData>({
    resolver: zodResolver(isEditMode ? updateHospitalSchema : createHospitalSchema),
    shouldUnregister: false,
    defaultValues: hospital ? {
      ...hospital,
      // Ensure contact_number always has at least one field
      contact_number: (hospital.contact_number && hospital.contact_number.length > 0) 
        ? hospital.contact_number 
        : [''],
      admin_details: hospital.admin_details || {
        email: '',
        name: '',
        phone_number: '',
        password: '',
      },
      // Ensure we have empty strings if these are null/undefined from hospital prop
      logo_img_id: (hospital as any).logo?.file_id || (hospital.logo_img_id as string) || '',
      hospital_license_id: (hospital as any).license?.file_id || (hospital.hospital_license_id as string) || '',
      banner_img_id: (hospital as any).banner?.file_id || (hospital.banner_img_id as string) || '',
    } : {
      name: '',
      location: '',
      latitude: 27.7172,
      longitude: 85.324,
      contact_number: [''],
      opened_date: '',
      hospital_license_id: '',
      logo_img_id: '',
      banner_img_id: '',
      admin_details: {
        email: '',
        name: '',
        phone_number: '',
        password: '',
      },
    },
  });

  // Type assertion for useFieldArray to work with zod resolver
  const { fields, append, remove } = useFieldArray<any>({
    control,
    name: 'contact_number',
  });

  // Ensure at least one contact field is always visible
  useEffect(() => {
    if (fields.length === 0) {
      append('', { shouldFocus: false });
    }
  }, [fields.length]);

  const mutation = useMutation({
    mutationFn: (data: CreateHospitalData | UpdateHospitalData) => {
      if (isEditMode && hospital?.id) {
        // For update, remove admin_details if present
        const { admin_details, ...updateData } = data as any;
        return hospitalApi.update(hospital.id, updateData as UpdateHospitalData);
      }
      console.log('Creating hospital with data:', data);
      // throw new Error();
      // For create, ensure we have admin_details
      return hospitalApi.create(data as CreateHospitalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitals'] });
      queryClient.invalidateQueries({ queryKey: ['hospital-stats'] });
      if (isEditMode && hospital?.id) {
        queryClient.invalidateQueries({ queryKey: ['hospital', hospital.id] });
      }
      toast.success(isEditMode ? 'Hospital updated successfully!' : 'Hospital created successfully!');
      onSuccess?.();
    },
    onError: () => {
      toast.error(isEditMode ? 'Failed to update hospital. Please try again.' : 'Failed to create hospital. Please try again.');
    },
  });
  
  const onSubmit = (data: CreateHospitalData | UpdateHospitalData) => {
    // Role-based validation
    if (isEditMode && isHospitalAdmin && hospital?.id !== user?.hospitalId) {
      alert('You can only update your own hospital');
      return;
    }
    
    if (!isEditMode && !isSuperAdmin) {
      alert('Only Super Admin can create hospitals');
      return;
    }
    
    console.log('Submitting hospital data:', data);
    console.log('Image IDs:', {
      logo_img_id: data.logo_img_id,
      hospital_license_id: data.hospital_license_id,
      banner_img_id: data.banner_img_id
    });
    mutation.mutate(data);
  };
  
  const onError = (errors: any) => {
    console.error('Form validation errors:', errors);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
    {/* // <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4" noValidate> */}
      {/* Image Uploads Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Hospital Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Controller
            name="logo_img_id"
            control={control}
            render={({ field }) => (
              <ImageUpload
                label="Hospital Logo *"
                value={field.value}
                onChange={field.onChange}
                fileType={FileTypeEnum.HOSPITAL_LOGO}
                error={errors.logo_img_id?.message}
                initialImageUrl={hospital?.logo?.file_url}
              />
            )}
          />
          
          <Controller
            name="hospital_license_id"
            control={control}
            render={({ field }) => (
              <ImageUpload
                label="Hospital License *"
                value={field.value}
                onChange={field.onChange}
                fileType={FileTypeEnum.LICENSE}
                error={errors.hospital_license_id?.message}
                initialImageUrl={hospital?.license?.file_url}
              />
            )}
          />
          
          <Controller
            name="banner_img_id"
            control={control}
            render={({ field }) => (
              <ImageUpload
                label="Hospital Banner *"
                value={field.value}
                onChange={field.onChange}
                fileType={FileTypeEnum.HOSPITAL_BANNER}
                error={errors.banner_img_id?.message}
                initialImageUrl={hospital?.banner?.file_url}
              />
            )}
          />
        </div>
      </div>

      {/* Hospital Details Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Hospital Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Hospital Name *</label>
            <input
              {...register('name')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter hospital name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Opening Date *</label>
            <input
              {...register('opened_date')}
              type="date"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.opened_date && (
              <p className="text-red-500 text-sm mt-1">{errors.opened_date.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Location/Address *</label>
            <input
              {...register('location')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter complete address"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>
        </div>

        {/* Contact Numbers */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Contact Numbers *</label>
            <Button
              type="button"
              size="sm"
              onClick={() => append('')}
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Number
            </Button>
          </div>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Contact Number {index + 1}</label>
                <div className="flex gap-2">
                  <input
                    {...register(`contact_number.${index}` as const)}
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. +977-9800000000"
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {(errors.contact_number as any)?.[index] && (
                   <p className="text-red-500 text-sm">{(errors.contact_number as any)[index]?.message}</p>
                )}
              </div>
            ))}
            {errors.contact_number && (
              <p className="text-red-500 text-sm">{errors.contact_number.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <Controller
          name="latitude"
          control={control}
          render={({ field: latField }) => (
            <Controller
              name="longitude"
              control={control}
              render={({ field: lngField }) => (
                <MapSelector
                  latitude={latField.value ?? 27.7172}
                  longitude={lngField.value ?? 85.324}
                  onChange={(lat, lng) => {
                    latField.onChange(lat);
                    lngField.onChange(lng);
                  }}
                />
              )}
            />
          )}
        />
        {(errors.latitude || errors.longitude) && (
          <p className="text-red-500 text-sm mt-2">
            {errors.latitude?.message || errors.longitude?.message}
          </p>
        )}
      </div>

      {/* Hospital Admin Details Section - Only for Super Admin creating new hospitals */}
      {!isEditMode && isSuperAdmin && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Hospital Admin Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Admin Name *</label>
              <input
                {...register('admin_details.name')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter admin name"
              />
              {(errors as any).admin_details?.name && (
                <p className="text-red-500 text-sm mt-1">{(errors as any).admin_details.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Admin Email *</label>
              <input
                {...register('admin_details.email')}
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter admin email"
              />
              {(errors as any).admin_details?.email && (
                <p className="text-red-500 text-sm mt-1">{(errors as any).admin_details.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Admin Phone Number *</label>
              <input
                {...register('admin_details.phone_number')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter phone number"
              />
              {(errors as any).admin_details?.phone_number && (
                <p className="text-red-500 text-sm mt-1">{(errors as any).admin_details.phone_number.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Password *</label>
              <div className="relative">
                <input
                  {...register('admin_details.password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter password (min 8 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {(errors as any).admin_details?.password && (
                <p className="text-red-500 text-sm mt-1">{(errors as any).admin_details.password.message}</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : isEditMode ? 'Update Hospital' : 'Create Hospital'}
        </Button>
      </div>

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Failed to {isEditMode ? 'update' : 'create'} hospital. Please try again.
        </div>
      )}
    </form>
  );//dahboard created
}