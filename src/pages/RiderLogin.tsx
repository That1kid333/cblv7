import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../lib/services/auth.service';

export default function RiderLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await authService.signIn(email, password);
      const userDoc = await authService.getUserDoc(user.uid);
      
      if (userDoc?.type !== 'rider') {
        await authService.signOut();
        setError('This account is not registered as a rider. Please sign up as a rider first.');
        setIsLoading(false);
        return;
      }

      navigate('/rider/portal');
    } catch (err) {
      setError('Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <img 
              src="https://aiautomationsstorage.blob.core.windows.net/cbl/citybucketlist%20logo.png"
              alt="CityBucketList.com"
              className="h-12 object-contain"
            />
          </Link>
        </div>

        <div className="bg-neutral-900 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Rider Login</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 rounded-lg focus:ring-2 focus:ring-[#C69249] text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 rounded-lg focus:ring-2 focus:ring-[#C69249] text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-neutral-400">
            <p>Don't have a rider account?{' '}
              <Link to="/rider/signup" className="text-[#C69249] hover:text-[#B58238]">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
