import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Driver } from '../types/driver';

interface DriverSelectionProps {
  locationId: string;
  onDriverSelect: (driverId: string) => void;
  selectedDriver: string;
}

export function DriverSelection({ locationId, onDriverSelect, selectedDriver }: DriverSelectionProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const driversRef = collection(db, 'drivers');
        const q = query(
          driversRef,
          where('serviceLocations', 'array-contains', locationId),
          where('isOnline', '==', true),
          where('status', '==', 'active')
        );
        
        const querySnapshot = await getDocs(q);
        const availableDrivers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Driver));
        
        setDrivers(availableDrivers);
      } catch (err) {
        console.error('Error fetching drivers:', err);
        setError('Failed to load available drivers');
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [locationId]);

  if (loading) {
    return <div className="text-center py-4">Loading available drivers...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (drivers.length === 0) {
    return <div className="text-center py-4">No drivers available in this area</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Select a Driver</h3>
      <div className="grid grid-cols-1 gap-4">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedDriver === driver.id
                ? 'border-[#C69249] bg-[#C69249]/10'
                : 'border-neutral-700 hover:border-[#C69249]/50'
            }`}
            onClick={() => onDriverSelect(driver.id)}
          >
            <div className="flex items-center space-x-4">
              {driver.photo && (
                <img
                  src={driver.photo}
                  alt={driver.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <h4 className="font-medium">{driver.name}</h4>
                <p className="text-sm text-neutral-400">
                  {driver.vehicle?.make} {driver.vehicle?.model} • {driver.vehicle?.color}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
