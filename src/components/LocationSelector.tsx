import React from 'react';
import { MapPin } from 'lucide-react';
import { Location } from '../types/location';

interface LocationSelectorProps {
  locations: Location[];
  selectedLocation: string;
  onLocationChange: (locationId: string) => void;
}

export function LocationSelector({ 
  locations, 
  selectedLocation, 
  onLocationChange 
}: LocationSelectorProps) {
  return (
    <div className="flex items-center space-x-4">
      <MapPin className="w-5 h-5 text-[#C69249]" />
      <select
        value={selectedLocation}
        onChange={(e) => onLocationChange(e.target.value)}
        className="bg-neutral-800 text-white px-4 py-2 rounded-lg border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#C69249]"
      >
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}, {location.region}
          </option>
        ))}
      </select>
    </div>
  );
}