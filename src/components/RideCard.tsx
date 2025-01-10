import { MapPin, Clock, MessageCircle, Archive, Phone } from 'lucide-react';
import { RideActions } from './RideActions';
import { useNavigate } from 'react-router-dom';

interface Ride {
  id: string;
  customerName: string;  // Using customerName instead of riderId for display
  pickup: string;
  dropoff: string;
  time: string;
  date: string;
  status: string;
  phone: string;
  archived?: boolean;
  riderId?: string;  // Optional since guest riders won't have an ID
  created_at: string;
}

interface RideCardProps {
  ride: Ride;
  isSubmitting: boolean;
  onAccept: (ride: Ride) => void;
  onTransfer: (ride: Ride) => void;
  onDecline: (ride: Ride) => void;
  onArchive: (ride: Ride) => void;
}

export function RideCard({
  ride,
  isSubmitting,
  onAccept,
  onTransfer,
  onDecline,
  onArchive
}: RideCardProps) {
  const navigate = useNavigate();

  const handleMessageClick = () => {
    if (ride.riderId) {
      navigate(`/messages/${ride.riderId}?rideId=${ride.id}`);
    } else {
      // For guest riders, show phone number in a more prominent way
      // or handle differently since they don't have a messaging account
      window.location.href = `tel:${ride.phone}`;
    }
  };

  return (
    <>
      <div className={`bg-neutral-800 rounded-lg p-6 ${ride.archived ? 'opacity-75' : ''}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">
              {ride.customerName}
            </h3>
            <div className="flex flex-col gap-1">
              {ride.phone && (
                <p className="text-gray-400 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {ride.phone}
                </p>
              )}
              <p className="text-gray-400 text-sm">
                {new Date(ride.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm ${
              ride.status === 'pending' ? 'bg-yellow-600' :
              ride.status === 'accepted' ? 'bg-green-600' :
              ride.status === 'declined' ? 'bg-red-600' :
              'bg-neutral-600'
            }`}>
              {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
            </span>
            {!ride.riderId && (
              <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                Guest
              </span>
            )}
            {ride.archived && (
              <span className="px-3 py-1 bg-neutral-700 text-white text-sm rounded-full">
                Archived
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-2 mb-4">
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-4 h-4" />
            <span>From: {ride.pickup || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-4 h-4" />
            <span>To: {ride.dropoff || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-4 h-4" />
            <span>{ride.date} at {ride.time}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleMessageClick}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {ride.riderId ? (
              <>
                <MessageCircle className="w-4 h-4" />
                Message Customer
              </>
            ) : (
              <>
                <Phone className="w-4 h-4" />
                Call Customer
              </>
            )}
          </button>
          
          {ride.status === 'pending' && (
            <RideActions
              status={ride.status}
              isSubmitting={isSubmitting}
              onAccept={() => onAccept(ride)}
              onDecline={() => onDecline(ride)}
              onTransfer={() => onTransfer(ride)}
            />
          )}

          {ride.status !== 'pending' && (
            <button
              onClick={() => onArchive(ride)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors"
            >
              <Archive className="w-4 h-4" />
              {ride.archived ? 'Unarchive' : 'Archive'}
            </button>
          )}
        </div>
      </div>
    </>
  );
}