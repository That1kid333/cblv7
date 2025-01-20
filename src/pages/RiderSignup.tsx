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

      // Register rider
      await authService.registerRider({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
      });

      // Navigate to rider portal
      navigate('/rider/portal');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
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

  const handleGoogleSignIn = async () => {
    try {
      await authService.signInWithGoogle();
      navigate('/rider/portal');
    } catch (error) {
      console.error('Google sign in error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
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
            
            <FormInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
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
          
          <button type="button" onClick={handleGoogleSignIn} className="w-full px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] mt-4">
            Sign Up with Google
          </button>
          
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
