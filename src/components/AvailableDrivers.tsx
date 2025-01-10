import { Driver } from '../types/driver';
import { Car, Star, MapPin } from 'lucide-react';
import { locations } from '../types/location';

interface AvailableDriversProps {
  drivers: Driver[];
  onSelect: (driver: Driver) => void;
}

export function AvailableDrivers({ drivers, onSelect }: AvailableDriversProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Available Drivers</h3>
      {drivers.length === 0 ? (
        <p className="text-neutral-400">No drivers available in your area</p>
      ) : (
        drivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-neutral-800 rounded-lg p-4 hover:bg-neutral-700 cursor-pointer transition-colors"
            onClick={() => onSelect(driver)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {driver.photo ? (
                  <img
                    src={driver.photo}
                    alt={driver.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-neutral-600 flex items-center justify-center">
                    <span className="text-xl text-white">
                      {driver.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="font-medium">{driver.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-neutral-400">
                    <Car className="w-4 h-4" />
                    <span>
                      {driver.vehicle.make} {driver.vehicle.model} ({driver.vehicle.color})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-neutral-400">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {locations.find(loc => loc.id === driver.serviceLocations[0])?.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-neutral-400">
                    <Car className="w-4 h-4" />
                    <span>TAG# {driver.vehicle.licensePlate}</span>
                  </div>
                  <div className="text-sm text-neutral-400">
                    License Plate: {driver.vehicle.licensePlate || 'Not provided'}
                  </div>
                  <div className="text-sm text-neutral-400">
                    License Plate: {driver.vehicle.licensePlate || 'Not provided'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{driver.rating.toFixed(1)}</span>
                </div>
                <div className="text-sm text-neutral-400">
                  {driver.totalRides} rides
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
