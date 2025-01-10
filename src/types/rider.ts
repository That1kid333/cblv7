import { z } from 'zod';
import { SUPPORTED_CITIES } from '../constants/cities';

export const riderSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  photo: z.string().url("Profile photo must be a valid URL").optional(),
  serviceLocations: z.array(z.string()),
  type: z.literal('rider'),
  created_at: z.string(),
  updated_at: z.string(),
  preferredLocation: z.string().optional(),
  currentCity: z.enum(SUPPORTED_CITIES).optional()
});

export type Rider = z.infer<typeof riderSchema>;

export const initialRider: Rider = {
  id: "",
  name: "",
  email: "",
  phone: "",
  photo: "",
  serviceLocations: [],
  type: 'rider',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  currentCity: undefined,
  preferredLocation: undefined
};
