import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Header } from '../components/Header';
import { Phone, MessageCircle } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  photo?: string;
  vehicle?: {
    make: string;
    model: string;
    color: string;
  };
}

export function GuestRideConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get the ride details from location state
  const ride = location.state?.ride;

  useEffect(() => {
    const fetchDriver = async () => {
      if (!ride?.driverId) {
        setError('No driver information available');
        setLoading(false);
        return;
      }

      try {
        const driverDoc = await getDoc(doc(db, 'drivers', ride.driverId));
        if (driverDoc.exists()) {
          setDriver({
            id: driverDoc.id,
            ...driverDoc.data()
          } as Driver);
        } else {
          setError('Driver not found');
        }
      } catch (err) {
        console.error('Error fetching driver:', err);
        setError('Failed to load driver information');
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [ride?.driverId]);

  if (!ride) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500">Error</h1>
            <p className="mt-2">No ride information available</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#C69249] mb-2">Ride Confirmed!</h1>
            <p className="text-xl text-gray-300">
              Your ride request has been sent to the driver
            </p>
          </div>

          <div className="bg-neutral-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Pickup Location</p>
                <p className="text-white">{ride.pickup || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-gray-400">Drop-off Location</p>
                <p className="text-white">{ride.dropoff || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-gray-400">Scheduled Time</p>
                <p className="text-white">{new Date(ride.scheduled_time).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C69249] mx-auto"></div>
              <p className="mt-2 text-gray-400">Loading driver information...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : driver && (
            <div className="bg-neutral-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Your Driver</h2>
              <div className="flex items-center gap-4 mb-4">
                {driver.photo && (
                  <img
                    src={driver.photo}
                    alt={driver.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-lg font-medium">{driver.name}</h3>
                  {driver.vehicle && (
                    <p className="text-gray-400">
                      {driver.vehicle.color} {driver.vehicle.make} {driver.vehicle.model}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-neutral-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
              <div className="space-y-6">
                <div>
                  <p className="mb-2">Your driver will contact you at:</p>
                  <div className="flex items-center gap-2 text-[#C69249]">
                    <Phone className="w-5 h-5" />
                    <span>{ride.phone}</span>
                  </div>
                </div>
                
                <div className="border-t border-neutral-700 pt-6">
                  <p className="mb-4">Want to message your driver directly?</p>
                  <button
                    onClick={() => navigate('/rider/signup', { 
                      state: { 
                        redirectTo: '/messages',
                        rideId: ride.id,
                        driverId: ride.driverId
                      }
                    })}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#C69249] text-white rounded-lg hover:bg-[#B58239] transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Sign up to message driver
                  </button>
                  <p className="text-sm text-gray-400 text-center mt-2">
                    Create an account to access in-app messaging and more features
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GuestRideConfirmation;
