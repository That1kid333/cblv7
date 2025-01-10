import React from 'react';
import { Car } from 'lucide-react';
import { Vehicle } from '../types/driver';

interface VehicleInfoProps {
  vehicle: Vehicle;
  isEditing: boolean;
  onVehicleChange: (field: keyof Vehicle, value: string) => void;
}

export function VehicleInfo({ vehicle, isEditing, onVehicleChange }: VehicleInfoProps) {
  const formatVehicleDisplay = (vehicle: Vehicle) => {
    if (!vehicle.make && !vehicle.model) return 'Add your vehicle';
    const parts = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean);
    return parts.join(' ');
  };

  return (
    <div className="flex items-center gap-2 text-neutral-300">
      <Car className="w-4 h-4" />
      {isEditing ? (
        <div className="grid grid-cols-2 gap-2 w-full">
          <input
            type="text"
            value={vehicle.make}
            onChange={(e) => onVehicleChange('make', e.target.value)}
            className="bg-neutral-800 px-2 py-1 rounded"
            placeholder="Make"
          />
          <input
            type="text"
            value={vehicle.model}
            onChange={(e) => onVehicleChange('model', e.target.value)}
            className="bg-neutral-800 px-2 py-1 rounded"
            placeholder="Model"
          />
          <input
            type="text"
            value={vehicle.year}
            onChange={(e) => onVehicleChange('year', e.target.value)}
            className="bg-neutral-800 px-2 py-1 rounded"
            placeholder="Year"
          />
          <input
            type="text"
            value={vehicle.color}
            onChange={(e) => onVehicleChange('color', e.target.value)}
            className="bg-neutral-800 px-2 py-1 rounded"
            placeholder="Color"
          />
        </div>
      ) : (
        <span>{formatVehicleDisplay(vehicle)}</span>
      )}
    </div>
  );
}