import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  available: boolean;
  photo: string;
}

interface Ride {
  id: number;
  customerName: string;
  pickup: string;
  dropoff: string;
}

interface ForwardRideModalProps {
  ride: Ride;
  currentDriverId: string;
  onForward: (ride: Ride, newDriverId: string) => void;
  onClose: () => void;
}

export function ForwardRideModal({ ride, currentDriverId, onForward, onClose }: ForwardRideModalProps) {
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>('');

  useEffect(() => {
    // Load available drivers from localStorage
    const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
    const filtered = drivers.filter((d: Driver) => 
      d.id !== currentDriverId && d.available
    );
    setAvailableDrivers(filtered);
  }, [currentDriverId]);

  const handleForward = () => {
    if (selectedDriver) {
      onForward(ride, selectedDriver);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="font-semibold text-white">Forward Ride</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-sm font-medium text-neutral-400 mb-2">Ride Details</h4>
            <div className="bg-neutral-800 p-4 rounded-lg">
              <p className="font-semibold">{ride.customerName}</p>
              <p className="text-sm text-neutral-400">From: {ride.pickup}</p>
              <p className="text-sm text-neutral-400">To: {ride.dropoff}</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-neutral-400 mb-2">Select Driver</h4>
            <div className="space-y-2">
              {availableDrivers.map((driver) => (
                <label
                  key={driver.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                    selectedDriver === driver.id
                      ? 'bg-[#F5A623] text-white'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="driver"
                    value={driver.id}
                    checked={selectedDriver === driver.id}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    className="hidden"
                  />
                  <img
                    src={driver.photo}
                    alt={driver.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="flex-1">{driver.name}</span>
                </label>
              ))}

              {availableDrivers.length === 0 && (
                <p className="text-center text-neutral-400 py-4">
                  No other drivers are currently available
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleForward}
              disabled={!selectedDriver}
              className="flex-1 px-4 py-2 bg-[#F5A623] text-white rounded-lg hover:bg-[#E09612] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Forward Ride
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}