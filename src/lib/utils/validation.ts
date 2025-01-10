import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
export const phoneSchema = z.string().regex(/^\+?[\d\s-()]{10,}$/, 'Invalid phone number');

export const vehicleSchema = z.object({
  make: z.string().min(1, 'Vehicle make is required'),
  model: z.string().min(1, 'Vehicle model is required'),
  year: z.string().regex(/^\d{4}$/, 'Must be a valid year'),
  color: z.string().min(1, 'Vehicle color is required'),
  plate: z.string().min(1, 'License plate is required')
});

export const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
  vehicle: z.string().min(1, 'Vehicle information is required')
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export const rideRequestSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: phoneSchema,
  pickup: z.string().optional(),
  dropoff: z.string().optional(),
  locationId: z.string().min(1, 'Location is required')
});

export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

export function validatePassword(password: string): boolean {
  return passwordSchema.safeParse(password).success;
}

export function validatePhone(phone: string): boolean {
  return phoneSchema.safeParse(phone).success;
}