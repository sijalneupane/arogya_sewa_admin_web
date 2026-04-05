import { z } from 'zod';

const NAME_REGEX = /^[A-Za-z ]+$/;
const PHONE_REGEX = /^\d{10}$/;

const trimmedRequired = (fieldLabel: string) =>
  z.string().trim().min(1, `${fieldLabel} is required`);

const phoneSchema = z
  .string()
  .trim()
  .regex(PHONE_REGEX, 'Phone number must be exactly 10 digits');

const baseHospitalSchema = z.object({
  name: trimmedRequired('Hospital name').refine(
    (value) => NAME_REGEX.test(value),
    'Hospital name must contain only letters and spaces'
  ),
  location: trimmedRequired('Location'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  contact_number: z.array(phoneSchema).min(1, 'At least one contact number is required'),
  opened_date: trimmedRequired('Opening date').refine(
    (value) => !Number.isNaN(new Date(value).getTime()),
    'Invalid opening date'
  ),
  hospital_license_id: trimmedRequired('License image'),
  logo_img_id: trimmedRequired('Logo image'),
  banner_img_id: trimmedRequired('Banner image'),
});

// For creating new hospitals (Super Admin only) - requires admin_details
export const createHospitalSchema = baseHospitalSchema.extend({
  admin_details: z.object({
    email: z.string().trim().email('Invalid email address'),
    name: trimmedRequired('Admin name').refine(
      (value) => NAME_REGEX.test(value),
      'Admin name must contain only letters and spaces'
    ),
    phone_number: phoneSchema,
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

// For updating hospitals (Hospital Admin can update their own, Super Admin can update any)
// Admin details are NOT included in updates
export const updateHospitalSchema = baseHospitalSchema.partial();

export type CreateHospitalFormData = z.infer<typeof createHospitalSchema>;
export type UpdateHospitalFormData = z.infer<typeof updateHospitalSchema>;
