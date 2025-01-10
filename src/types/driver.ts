import { z } from 'zod';

export const vehicleSchema = z.object({
  make: z.string().min(1, "Vehicle make is required"),
  model: z.string().min(1, "Vehicle model is required"),
  year: z.string().regex(/^\d{4}$/, "Must be a valid year"),
  color: z.string().min(1, "Vehicle color is required"),
  plate: z.string().min(1, "License plate is required"),
  insurance: z.object({
    provider: z.string(),
    policyNumber: z.string(),
    expirationDate: z.string(),
    documentUrl: z.string().url().optional()
  }),
  registration: z.object({
    expirationDate: z.string(),
    documentUrl: z.string().url().optional()
  })
});

export const driverSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  photo: z.string().url("Profile photo must be a valid URL").optional(),
  driversLicense: z.object({
    number: z.string(),
    expirationDate: z.string(),
    documentUrl: z.string().url().optional()
  }),
  vehicle: vehicleSchema,
  isOnline: z.boolean(),
  lastOnlineChange: z.string(),
  rating: z.number().min(0).max(5),
  totalRides: z.number().default(0),
  metrics: z.object({
    totalEarnings: z.number().default(0),
    acceptanceRate: z.number().min(0).max(100).default(100),
    responseTime: z.number().default(0),
    hoursOnline: z.number().default(0),
    todayRides: z.number().default(0)
  }),
  backgroundCheck: z.object({
    status: z.enum(["pending", "approved", "rejected"]),
    submissionDate: z.string(),
    documentUrl: z.string().url().optional()
  }),
  baseRate: z.number().default(0),
  airportRate: z.number().default(0),
  longDistanceRate: z.number().default(0),
  serviceLocations: z.array(z.string()),
  status: z.enum(["active", "inactive", "suspended"]),
  created_at: z.string(),
  updated_at: z.string()
});

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  type: 'driver';
  status: 'available' | 'busy' | 'offline';
  isOnline: boolean;
  serviceLocations: string[];
  vehicle: {
    make: string;
    model: string;
    year: string;
    color: string;
    licensePlate: string;
  };
  rating: number;
  experience: string;
  languages: string[];
  created_at: string;
  updated_at: string;
}

export const initialDriver: Driver = {
  id: '',
  name: '',
  email: '',
  phone: '',
  photo: '',
  type: 'driver',
  status: 'offline',
  isOnline: false,
  serviceLocations: [],
  vehicle: {
    make: '',
    model: '',
    year: '',
    color: '',
    licensePlate: ''
  },
  rating: 5.0,
  experience: '',
  languages: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};