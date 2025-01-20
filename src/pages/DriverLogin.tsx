import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { FormInput } from '../components/FormInput';
import { authService } from '../lib/services/auth.service';
import { loginSchema } from '../lib/utils/validation';
import { Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function DriverLogin() {
  const navigate = useNavigate();
  const { user, driver, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && user && driver) {
      navigate('/driver/portal');
    }
  }, [loading, user, driver, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setIsLoading(true);
      const driver = await authService.signInWithGoogle();
      navigate('/driver/portal');
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const validatedData = loginSchema.parse(formData);
      const driver = await authService.login(validatedData.email, validatedData.password);
      navigate('/driver/portal');
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#C69249] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-[#C69249] text-4xl font-bold mb-4">Driver Login</h1>
          <p className="text-neutral-400">Access your driver dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full mb-6 p-4 bg-white text-black rounded-lg flex items-center justify-center gap-3 hover:bg-neutral-100 transition-colors disabled:opacity-50"
        >
          <Mail className="w-5 h-5" />
          Continue with Gmail
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-neutral-400">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="bg-white text-black"
          />

          <FormInput
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="bg-white text-black"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-4 bg-[#C69249] text-white rounded-lg text-xl font-bold hover:bg-[#B58238] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center text-neutral-400">
            Don't have an account?{' '}
            <Link to="/driver/signup" className="text-[#C69249] hover:underline">
              Sign up here
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default DriverLogin;