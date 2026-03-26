import { useState } from 'react';
import { Driver } from '../../types/driver';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface OnlineToggleProps {
  driver: Driver;
  onUpdate: (updates: Partial<Driver>) => void;
}

export function OnlineToggle({ driver, onUpdate }: OnlineToggleProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleOnlineStatus = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    const now = new Date().toISOString();

    try {
      const updates = {
        isOnline: !driver.isOnline,
        lastOnlineChange: now,
      };

      await updateDoc(doc(db, 'drivers', driver.id), updates);
      onUpdate(updates);
    } catch (error) {
      console.error('Error updating online status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-between bg-neutral-900 p-4 rounded-lg">
      <div>
        <h3 className="font-medium">Online Status</h3>
        <p className="text-sm text-neutral-400">
          {driver.isOnline ? 'You are visible to riders' : 'You are offline'}
        </p>
      </div>
      <button
        onClick={toggleOnlineStatus}
        disabled={isUpdating}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${driver.isOnline ? 'bg-green-500' : 'bg-neutral-700'}
          ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span className="sr-only">
          {driver.isOnline ? 'Go offline' : 'Go online'}
        </span>
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${driver.isOnline ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
}
