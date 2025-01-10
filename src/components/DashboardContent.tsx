import React, { useState } from 'react';
import { RideCard } from './RideCard';
import { Archive } from 'lucide-react';

interface Ride {
  id: string;
  customerName: string;
  pickup: string;
  dropoff: string;
  time: string;
  date: string;
  status: string;
  phone: string;
  archived?: boolean;
}

interface DashboardContentProps {
  rides: Ride[];
  isSubmitting: boolean;
  onMessage: (rideId: string) => void;
  onAccept: (ride: Ride) => void;
  onTransfer: (ride: Ride) => void;
  onDecline: (ride: Ride) => void;
}

export function DashboardContent({
  rides,
  isSubmitting,
  onMessage,
  onAccept,
  onTransfer,
  onDecline
}: DashboardContentProps) {
  const [showArchived, setShowArchived] = useState(false);
  const [archivedRides, setArchivedRides] = useState<string[]>(() => {
    const stored = localStorage.getItem('archivedRides');
    return stored ? JSON.parse(stored) : [];
  });

  const handleArchive = (ride: Ride) => {
    const newArchivedRides = archivedRides.includes(ride.id)
      ? archivedRides.filter(id => id !== ride.id)
      : [...archivedRides, ride.id];
    
    setArchivedRides(newArchivedRides);
    localStorage.setItem('archivedRides', JSON.stringify(newArchivedRides));
  };

  const filteredRides = rides.filter(ride => 
    showArchived ? archivedRides.includes(ride.id) : !archivedRides.includes(ride.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#F5A623]">
          {showArchived ? 'Archived Rides' : 'Upcoming Rides'}
        </h2>
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
        >
          <Archive className="w-4 h-4" />
          {showArchived ? 'Show Active' : 'Show Archived'}
        </button>
      </div>

      <div className="grid gap-4">
        {filteredRides.map((ride) => (
          <RideCard
            key={ride.id}
            ride={{ ...ride, archived: archivedRides.includes(ride.id) }}
            isSubmitting={isSubmitting}
            onMessage={onMessage}
            onAccept={onAccept}
            onTransfer={onTransfer}
            onDecline={onDecline}
            onArchive={handleArchive}
          />
        ))}
        
        {filteredRides.length === 0 && (
          <div className="text-center text-neutral-400 py-8">
            {showArchived ? 'No archived rides' : 'No active rides available'}
          </div>
        )}
      </div>
    </div>
  );
}