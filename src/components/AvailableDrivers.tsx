import { Driver } from '../types/driver';
import { Car } from 'lucide-react';

interface AvailableDriversProps {
  drivers: Driver[];
  onSelectDriver: (driver: Driver) => void;
  selectedDriver?: Driver;
}

export function AvailableDrivers({
  drivers,
  onSelectDriver,
  selectedDriver,
}: AvailableDriversProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Available Drivers</h3>
      <div className="space-y-2">
        {drivers.map((driver) => (
          <button
            key={driver.id}
            onClick={() => onSelectDriver(driver)}
            className={`w-full p-4 rounded-lg flex items-center justify-between ${
              selectedDriver?.id === driver.id
                ? 'bg-blue-500 text-white'
                : 'bg-neutral-800 hover:bg-neutral-700'
            }`}
          >
            <div className="flex items-center gap-4">
              {driver.photo && (
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <span className="sr-only">Driver photo</span>
                  <img
                    src={driver.photo}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-medium">{driver.name}</span>
                <span className="text-sm text-gray-500">
                  {driver.vehicle.make} {driver.vehicle.model}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-neutral-400">
                {driver.totalRides} rides
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
