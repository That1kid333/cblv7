import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Header } from '../components/Header';
import { FormInput } from '../components/FormInput';
import { auth, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { LocationSelector } from '../components/LocationSelector';
import { locations } from '../types/location';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  driversLicense: {
    number: string;
    expirationDate: string;
  };
  vehicle: {
    make: string;
    model: string;
    year: string;
    color: string;
    plate: string;
  };
  locationId: string;
}

const initialSignupForm: SignupForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  driversLicense: {
    number: '',
    expirationDate: ''
  },
  vehicle: {
    make: '',
    model: '',
    year: '',
    color: '',
    plate: ''
  },
  locationId: locations[0].id
};

export default function DriverSignup() {
  const [formData, setFormData] = useState<SignupForm>({
    name: '',
    email: '',
    password: '',
    phone: '',
    driversLicense: {
      number: '',
      expirationDate: ''
    },
    vehicle: {
      make: '',
      model: '',
      year: '',
      color: '',
      plate: ''
    },
    locationId: locations[0].id
  });
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const now = new Date().toISOString();

      // Create driver profile
      const driverData = {
        id: userCredential.user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        photo: '', // Add default photo URL if needed
        driversLicense: {
          ...formData.driversLicense,
          documentUrl: '' // Add document upload functionality
        },
        vehicle: {
          ...formData.vehicle,
          insurance: {
            provider: '',
            policyNumber: '',
            expirationDate: '',
            documentUrl: ''
          },
          registration: {
            number: '',
            expirationDate: '',
            documentUrl: ''
          }
        },
        rating: 5.0,
        totalRides: 0,
        isOnline: false,
        lastOnlineChange: now,
        metrics: {
          totalEarnings: 0,
          acceptanceRate: 100,
          responseTime: 0,
          hoursOnline: 0,
          todayRides: 0
        },
        backgroundCheck: {
          status: 'pending',
          submissionDate: now,
          documentUrl: ''
        },
        baseRate: 0,
        airportRate: 0,
        longDistanceRate: 0,
        serviceLocations: [formData.locationId],
        status: 'inactive' as const,
        created_at: now,
        updated_at: now
      };

      // Save to Firebase
      await setDoc(doc(db, 'drivers', userCredential.user.uid), driverData);

      // Navigate to driver portal after successful registration
      navigate('/driver/portal');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (
    category: 'driversLicense' | 'vehicle',
    field: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleLocationChange = (locationId: string) => {
    setFormData(prev => ({ ...prev, locationId }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Driver Sign Up</h1>
          
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-neutral-800 rounded-lg focus:ring-2 focus:ring-[#C69249]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-neutral-800 rounded-lg focus:ring-2 focus:ring-[#C69249]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-neutral-800 rounded-lg focus:ring-2 focus:ring-[#C69249]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-neutral-800 rounded-lg focus:ring-2 focus:ring-[#C69249]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}