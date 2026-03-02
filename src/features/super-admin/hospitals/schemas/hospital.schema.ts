import { z } from 'zod';

const baseHospitalSchema = z.object({
  name: z.string().min(1, 'Hospital name is required'),
  location: z.string().min(1, 'Location is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  contact_number: z.array(z.string().min(10, 'Invalid phone number')).min(1, 'At least one contact number is required'),
  opened_date: z.string().min(1, 'Opening date is required'),
  hospital_license_id: z.string().min(1, 'License image is required'),
  logo_img_id: z.string().min(1, 'Logo image is required'),
  banner_img_id: z.string().min(1, 'Banner image is required'),
});

// For creating new hospitals (Super Admin only) - requires admin_details
export const createHospitalSchema = baseHospitalSchema.extend({
  admin_details: z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(1, 'Admin name is required'),
    phone_number: z.string().min(10, 'Invalid phone number').max(15),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

// For updating hospitals (Hospital Admin can update their own, Super Admin can update any)
// Admin details are NOT included in updates
export const updateHospitalSchema = baseHospitalSchema.partial();

export type CreateHospitalFormData = z.infer<typeof createHospitalSchema>;
export type UpdateHospitalFormData = z.infer<typeof updateHospitalSchema>;
