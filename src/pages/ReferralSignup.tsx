import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Driver } from '../types/driver';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useDriverMetrics } from '../hooks/useDriverMetrics';

function ReferralSignup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get referral ID from URL query params
  const searchParams = new URLSearchParams(location.search);
  const referralId = searchParams.get('referral');
  
  // Get driver metrics
  const metrics = useDriverMetrics(referralId || '');
  
  useEffect(() => {
    const fetchDriver = async () => {
      if (!referralId) {
        setError('Invalid referral link');
        setLoading(false);
        return;
      }

      try {
        const driverRef = doc(db, 'drivers', referralId);
        const driverSnap = await getDoc(driverRef);
        
        if (!driverSnap.exists()) {
          setError('Driver not found');
          setLoading(false);
          return;
        }

        setDriver(driverSnap.data() as Driver);
      } catch (error) {
        console.error('Error fetching driver:', error);
        setError('Failed to load driver information');
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [referralId]);

  const handleSignup = () => {
    // Store referral ID in session storage for use during signup
    if (referralId) {
      sessionStorage.setItem('referralId', referralId);
    }
    navigate('/rider/signup');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-center mb-6">{error || 'Something went wrong'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-[#C69249] mb-8">
          Sign Up with {driver.name}'s Referral
        </h1>

        <div className="bg-neutral-800 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-6 mb-6">
            {driver.photo && (
              <img
                src={driver.photo}
                alt={driver.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold mb-2">{driver.name}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span>{driver.rating || 'New'}</span>
                </div>
                <div className="text-neutral-400">
                  {metrics.totalRides || 0} rides completed
                </div>
                <div className="text-neutral-400">
                  {driver.experience || 'New Driver'}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-neutral-300">
            <p>
              {driver.name} has invited you to join as a rider. Sign up now to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Get priority booking with {driver.name}</li>
              <li>Receive personalized service</li>
              <li>Build a trusted relationship with your driver</li>
              <li>Access exclusive ride options and rates</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSignup}
            className="flex-1 px-6 py-3 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] transition-colors text-lg font-semibold"
          >
            Sign Up Now
          </button>
          <button
            onClick={() => navigate('/rider/login')}
            className="flex-1 px-6 py-3 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors text-lg font-semibold"
          >
            Already Have an Account?
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReferralSignup;
