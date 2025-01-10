import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { MessageCircle, CheckCircle, XCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Ride {
  id: string;
  riderId?: string;
  customerName?: string;
  phone?: string;
  rider?: {
    name: string;
    photo?: string;
  };
  pickup: string;
  dropoff: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  timestamp: string;
}

interface RidesManagementProps {
  driverId: string;
}

export function RidesManagement({ driverId }: RidesManagementProps) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!driverId) return;

    const ridesQuery = query(
      collection(db, 'rides'),
      where('driverId', '==', driverId)
    );

    const unsubscribe = onSnapshot(ridesQuery, (snapshot) => {
      const ridesList = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Ride))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setRides(ridesList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [driverId]);

  const handleAcceptRide = async (rideId: string) => {
    try {
      await updateDoc(doc(db, 'rides', rideId), {
        status: 'accepted'
      });
    } catch (error) {
      console.error('Error accepting ride:', error);
    }
  };

  const handleDeclineRide = async (rideId: string) => {
    try {
      await updateDoc(doc(db, 'rides', rideId), {
        status: 'cancelled'
      });
    } catch (error) {
      console.error('Error declining ride:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const pendingRides = rides.filter(ride => ride.status === 'pending');
  const pastRides = rides.filter(ride => ride.status !== 'pending');

  return (
    <div className="space-y-6">
      <h2 className="text-[#C69249] text-2xl font-semibold">New Ride Requests</h2>
      <div className="space-y-4">
        {pendingRides.map(ride => (
          <div key={ride.id} className="bg-neutral-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center">
                  {ride.rider?.photo ? (
                    <img
                      src={ride.rider.photo}
                      alt={ride.rider?.name || ride.customerName || 'Rider'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="text-2xl">👤</div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {ride.rider?.name || ride.customerName || 'Guest Rider'}
                  </h3>
                  {ride.phone && (
                    <a href={`tel:${ride.phone}`} className="text-neutral-400 flex items-center gap-1">
                      <Phone size={14} />
                      {ride.phone}
                    </a>
                  )}
                </div>
              </div>
              <span className="px-3 py-1 bg-[#8B5E34] text-white rounded-full">
                Pending
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex gap-2">
                <span className="text-neutral-400">From:</span>
                <span>{ride.pickup}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-neutral-400">To:</span>
                <span>{ride.dropoff}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {ride.riderId ? (
                <Link
                  to={`/messages/${ride.riderId}?rideId=${ride.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors"
                >
                  <MessageCircle size={20} />
                  Message Rider
                </Link>
              ) : ride.phone && (
                <a
                  href={`tel:${ride.phone}`}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors"
                >
                  <Phone size={20} />
                  Call Rider
                </a>
              )}
              <button
                onClick={() => handleAcceptRide(ride.id)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle size={20} />
                Accept
              </button>
              <button
                onClick={() => handleDeclineRide(ride.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle size={20} />
                Decline
              </button>
            </div>
          </div>
        ))}
        {pendingRides.length === 0 && (
          <div className="text-center text-neutral-400 py-8">
            No new ride requests
          </div>
        )}
      </div>

      <h2 className="text-[#C69249] text-2xl font-semibold mt-8">Past Rides</h2>
      <div className="space-y-4">
        {pastRides.map(ride => (
          <div key={ride.id} className="bg-neutral-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center">
                  {ride.rider?.photo ? (
                    <img
                      src={ride.rider.photo}
                      alt={ride.rider?.name || ride.customerName || 'Rider'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="text-2xl">👤</div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {ride.rider?.name || ride.customerName || 'Guest Rider'}
                  </h3>
                  {ride.phone && (
                    <a href={`tel:${ride.phone}`} className="text-neutral-400 flex items-center gap-1">
                      <Phone size={14} />
                      {ride.phone}
                    </a>
                  )}
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full ${
                  ride.status === 'accepted'
                    ? 'bg-green-600'
                    : ride.status === 'cancelled'
                    ? 'bg-red-600'
                    : 'bg-neutral-600'
                }`}
              >
                {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="text-neutral-400">From:</span>
                <span>{ride.pickup}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-neutral-400">To:</span>
                <span>{ride.dropoff}</span>
              </div>
            </div>
          </div>
        ))}
        {pastRides.length === 0 && (
          <div className="text-center text-neutral-400 py-8">
            No past rides
          </div>
        )}
      </div>
    </div>
  );
}