import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { FormInput } from '../components/FormInput';
import { authService } from '../lib/services/auth.service';
import { locations } from '../types/location';

function RiderSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    locationId: locations[0].id,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!formData.name.trim()) throw new Error('Name is required');
      if (!formData.email.trim()) throw new Error('Email is required');
      if (!formData.phone.trim()) throw new Error('Phone number is required');
      if (!formData.password) throw new Error('Password is required');
      if (formData.password.length < 6) throw new Error('Password must be at least 6 characters');
      if (formData.password !== formData.confirmPassword) throw new Error('Passwords do not match');
      if (!formData.locationId) throw new Error('Please select your city');

      // Register rider
      await authService.registerRider({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        locationId: formData.locationId
      });

      // Navigate to rider portal
      navigate('/rider/portal');
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        if (error.message.includes('auth/email-already-in-use')) {
          setError('This email is already registered. Please sign in instead.');
          // Clear password fields
          setFormData(prev => ({
            ...prev,
            password: '',
            confirmPassword: ''
          }));
          return;
        }
        setError(error.message);
      } else {
        setError('Failed to create account');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-2">Sign Up as a Rider</h1>
          <p className="text-neutral-400 mb-8">Create your rider account to get started</p>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <select
                name="locationId"
                value={formData.locationId}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C69249]"
                required
              >
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}, {location.region}
                  </option>
                ))}
              </select>
            </div>
            
            <FormInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            
            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <p className="mt-6 text-center text-neutral-400">
            Already have an account?{' '}
            <Link to="/rider/login" className="text-[#C69249] hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default RiderSignup;
