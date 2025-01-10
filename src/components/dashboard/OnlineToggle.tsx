import { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Switch } from '../ui/Switch';

interface OnlineToggleProps {
  driverId: string;
  isOnline: boolean;
}

export function OnlineToggle({ driverId, isOnline: initialIsOnline }: OnlineToggleProps) {
  const [isOnline, setIsOnline] = useState(initialIsOnline);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;

    const setupOnlineListener = async () => {
      try {
        const driverRef = doc(db, 'drivers', driverId);
        unsubscribe = onSnapshot(driverRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setIsOnline(docSnapshot.data()?.isOnline || false);
          }
          setLoading(false);
        }, (error) => {
          console.error('Error in online status listener:', error);
          setError('Failed to get online status');
          setLoading(false);
        });
      } catch (error) {
        console.error('Error setting up online listener:', error);
        setError('Failed to setup online status');
        setLoading(false);
      }
    };

    setupOnlineListener();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [driverId]);

  const toggleOnline = async () => {
    try {
      setError(null);
      const driverRef = doc(db, 'drivers', driverId);
      const newStatus = !isOnline;
      
      await updateDoc(driverRef, {
        isOnline: newStatus,
        lastOnlineChange: new Date().toISOString(),
        // Also update the driver's status to active if they're going online
        ...(newStatus ? { status: 'active' } : {})
      });

      // No need to setIsOnline here as the onSnapshot listener will handle it
    } catch (error) {
      console.error('Error toggling online status:', error);
      setError('Failed to update online status');
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-neutral-800 h-8 w-16 rounded" />;
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  return (
    <div className="flex items-center gap-3">
      <Switch
        checked={isOnline}
        onCheckedChange={toggleOnline}
        className={`${isOnline ? 'bg-green-600' : 'bg-neutral-600'}`}
      />
      <span className={`text-sm font-medium ${isOnline ? 'text-green-500' : 'text-neutral-400'}`}>
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
}
