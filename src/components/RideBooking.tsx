import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, getDoc, doc, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

interface Driver {
  id: string;
  name: string;
  photo?: string;
  vehicle: {
    make: string;
    model: string;
    year: string;
    color: string;
    plate: string;
  };
  rating: number;
  isOnline: boolean;
  status: string;
  experience?: string;
  languages?: string[];
  serviceLocations: string[];
  schedule?: {
    [day: number]: {
      start: string;
      end: string;
    }[];
  };
}

interface RideBookingProps {
  cityId: string;
}

export function RideBooking({ cityId }: RideBookingProps) {
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const { rider } = useAuth();

  useEffect(() => {
    if (!cityId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const driversQuery = query(
      collection(db, 'drivers'),
      where('serviceLocations', 'array-contains', cityId),
      where('isOnline', '==', true),
      where('status', '==', 'active'),
      limit(50)
    );

    const unsubscribe = onSnapshot(driversQuery, (snapshot) => {
      try {
        const drivers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Driver));

        setAvailableDrivers(drivers);
      } catch (err) {
        console.error('Error processing drivers:', err);
        setAvailableDrivers([]);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error('Error fetching drivers:', error);
      setLoading(false);
      setAvailableDrivers([]);
    });

    return () => unsubscribe();
  }, [cityId]);

  const handleBookRide = async () => {
    try {
      setBookingError(null);

      if (!selectedDriver) {
        setBookingError('Please select a driver');
        return;
      }
      if (!pickup) {
        setBookingError('Please enter a pickup location');
        return;
      }
      if (!dropoff) {
        setBookingError('Please enter a dropoff location');
        return;
      }
      if (!rider?.id) {
        setBookingError('You must be logged in to book a ride');
        return;
      }

      const selectedDriverData = availableDrivers.find(d => d.id === selectedDriver);
      if (!selectedDriverData) {
        setBookingError('Selected driver not found');
        return;
      }

      const riderDoc = await getDoc(doc(db, 'riders', rider.id));
      if (!riderDoc.exists()) {
        setBookingError('Rider profile not found');
        return;
      }
      const riderData = riderDoc.data();

      const rideData = {
        riderId: rider.id,
        driverId: selectedDriver,
        pickup,
        dropoff,
        status: 'pending',
        timestamp: new Date().toISOString(),
        cityId,
        driver: {
          name: selectedDriverData.name,
          photo: selectedDriverData.photo || null,
          vehicle: selectedDriverData.vehicle
        },
        rider: {
          name: riderData.name,
          photo: riderData.photo || null
        }
      };

      const rideRef = await addDoc(collection(db, 'rides'), rideData);
      console.log('Ride booked successfully');
      
      await addDoc(collection(db, 'messages'), {
        rideId: rideRef.id,
        senderId: rider.id,
        receiverId: selectedDriver,
        content: `Hi! I've booked a ride from ${pickup} to ${dropoff}. Looking forward to the trip!`,
        timestamp: new Date().toISOString(),
        read: false
      });

      window.location.href = `/ride/confirmation/${rideRef.id}`;
      
    } catch (error) {
      console.error('Error booking ride:', error);
      setBookingError('Failed to book ride. Please try again.');
    }
  };

  if (!cityId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-lg text-gray-400 mb-4">
          Please set your location in the settings to see available drivers.
        </p>
        <button
          onClick={() => window.location.href = '#settings'}
          className="px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238]"
        >
          Go to Settings
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C69249] mb-4"></div>
        <p className="text-sm text-gray-400">Loading drivers for {cityId}...</p>
      </div>
    );
  }

  if (availableDrivers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-400 mb-4">
          No drivers are currently available in your area.
        </p>
        <p className="text-sm text-gray-500">
          Location: {cityId}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Please try again later or check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Available Drivers</h2>
      
      {bookingError && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
          {bookingError}
        </div>
      )}

      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Pickup Location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C69249]"
        />
        <input
          type="text"
          placeholder="Dropoff Location"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C69249]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableDrivers.map((driver) => (
          <div
            key={driver.id}
            className={`bg-neutral-800 rounded-lg p-6 cursor-pointer transition-all ${
              selectedDriver === driver.id ? 'ring-2 ring-[#C69249]' : ''
            }`}
            onClick={() => setSelectedDriver(driver.id)}
          >
            <div className="flex items-start space-x-4">
              <img
                src={driver.photo || '/default-avatar.png'}
                alt={driver.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{driver.name}</h3>
                <div className="mt-2 space-y-1 text-neutral-300">
                  <p className="flex items-center">
                    <span className="w-24">Vehicle:</span>
                    <span className="text-white">
                      {[
                        driver.vehicle?.make,
                        driver.vehicle?.model,
                        driver.vehicle?.year && `(${driver.vehicle.year})`
                      ].filter(Boolean).join(' ')}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <span className="w-24">Color:</span>
                    <span className="text-white">{driver.vehicle?.color || 'Not specified'}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="w-24">Plate #:</span>
                    <span className="text-white">{driver.vehicle?.plate || 'Not specified'}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="w-24">Experience:</span>
                    <span className="text-white">{driver.experience || 'Not specified'}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="w-24">Languages:</span>
                    <span className="text-white">
                      {driver.languages?.join(', ') || 'Not specified'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleBookRide}
        disabled={!selectedDriver || !pickup || !dropoff}
        className="w-full px-6 py-3 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
      >
        Book Ride
      </button>
    </div>
  );
}
