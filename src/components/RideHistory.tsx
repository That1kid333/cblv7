import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Ride {
  id: string;
  driverId: string;
  driver: {
    name: string;
    photo?: string;
  };
  pickup: string;
  dropoff: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  timestamp: string;
}

export function RideHistory() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { rider } = useAuth();

  useEffect(() => {
    if (!rider?.id) return;

    const ridesQuery = query(
      collection(db, 'rides'),
      where('riderId', '==', rider.id)
    );

    const unsubscribe = onSnapshot(ridesQuery, (snapshot) => {
      const ridesList = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Ride))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setRides(ridesList);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [rider?.id]);

  const getPendingRides = () => rides.filter(ride => ride.status === 'pending' || ride.status === 'accepted');
  const getCurrentRides = () => rides.filter(ride => ride.status === 'in_progress');
  const getPastRides = () => rides.filter(ride => ride.status === 'completed' || ride.status === 'cancelled');

  const getStatusStyle = (status: Ride['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/50 text-yellow-200';
      case 'accepted':
        return 'bg-blue-900/50 text-blue-200';
      case 'in_progress':
        return 'bg-purple-900/50 text-purple-200';
      case 'completed':
        return 'bg-green-900/50 text-green-200';
      case 'cancelled':
        return 'bg-red-900/50 text-red-200';
      default:
        return 'bg-neutral-900/50 text-neutral-200';
    }
  };

  const RideCard = ({ ride }: { ride: Ride }) => (
    <div className="bg-neutral-800 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <img
            src={ride.driver.photo || '/default-avatar.png'}
            alt={ride.driver.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{ride.driver.name}</h3>
            <p className="text-sm text-neutral-400">
              {new Date(ride.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-sm ${getStatusStyle(ride.status)}`}>
          {ride.status.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </span>
      </div>
      
      <div className="space-y-2 text-sm">
        <p>
          <span className="text-neutral-400">From:</span> {ride.pickup}
        </p>
        <p>
          <span className="text-neutral-400">To:</span> {ride.dropoff}
        </p>
      </div>

      <div className="pt-3 border-t border-neutral-700 flex justify-end">
        {(ride.status === 'accepted' || ride.status === 'in_progress' || ride.status === 'completed') ? (
          <Link
            to={`/messages/${ride.driverId}?rideId=${ride.id}`}
            className="inline-flex items-center space-x-2 text-[#C69249] hover:text-[#B58239] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message Driver</span>
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex items-center space-x-2 text-neutral-500 cursor-not-allowed"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message Driver</span>
          </button>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#C69249]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Pending Rides */}
      {getPendingRides().length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 text-[#C69249]">Pending Rides</h2>
          <div className="grid gap-4">
            {getPendingRides().map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        </section>
      )}

      {/* Current Rides */}
      {getCurrentRides().length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 text-[#C69249]">Current Rides</h2>
          <div className="grid gap-4">
            {getCurrentRides().map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        </section>
      )}

      {/* Past Rides */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-[#C69249]">Past Rides</h2>
        {getPastRides().length === 0 ? (
          <p className="text-neutral-400">No past rides found.</p>
        ) : (
          <div className="grid gap-4">
            {getPastRides().map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default RideHistory;
