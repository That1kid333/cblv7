import { Clock, MapPin, Car } from 'lucide-react';
import { Driver } from '../../types/driver';
import { PhotoUpload } from '../PhotoUpload';
import { locations } from '../../types/location';
import { useDriverMetrics } from '../../hooks/useDriverMetrics';

interface OverviewProps {
  driver: Driver;
  onUpdate: (updates: Partial<Driver>) => void;
}

export function Overview({ driver, onUpdate }: OverviewProps) {
  const metrics = useDriverMetrics(driver.id);

  const handlePhotoChange = (photoUrl: string) => {
    onUpdate({ photo: photoUrl });
  };

  const getServiceAreaName = () => {
    if (!driver.serviceLocations?.length) return 'Not Set';
    const locationNames = driver.serviceLocations.map(locId => {
      const location = locations.find(loc => loc.id === locId);
      return location ? location.name : 'Not Set';
    });
    return locationNames.join(', ');
  };

  const getVehicleInfo = () => {
    const vehicle = driver.vehicle || {};
    return {
      make: vehicle.make || 'Not Set',
      model: vehicle.model || 'Not Set',
      year: vehicle.year || 'Not Set',
      color: vehicle.color || 'Not Set',
      licensePlate: vehicle.licensePlate || 'Not Set',
      insurance: vehicle.insurance || {}
    };
  };

  const vehicleInfo = getVehicleInfo();

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center justify-between bg-neutral-900 p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <PhotoUpload
            currentPhotoUrl={driver.photo}
            onPhotoChange={handlePhotoChange}
            userId={driver.id}
          />
          <div>
            <h2 className="text-xl font-semibold">{driver.name}</h2>
            <div className="flex items-center gap-2 text-neutral-400">
              <span>{metrics.totalRides} Total Rides</span>
              <span>•</span>
              <span>{metrics.hoursOnline} Hours Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Rides */}
        <div className="bg-neutral-900 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-400">Total Rides</div>
            <Car className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold">{metrics.totalRides}</div>
        </div>

        {/* Hours Online */}
        <div className="bg-neutral-900 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-400">Hours Online</div>
            <Clock className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold">{metrics.hoursOnline}</div>
        </div>

        {/* Service Area */}
        <div className="bg-neutral-900 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-400">Service Area</div>
            <MapPin className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold">{getServiceAreaName()}</div>
        </div>

        {/* Today's Rides */}
        <div className="bg-neutral-900 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-400">Today's Rides</div>
            <Car className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold">{metrics.todayRides}</div>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="bg-neutral-900 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-neutral-400">Vehicle</div>
            <div className="font-medium">
              {vehicleInfo.make} {vehicleInfo.model} ({vehicleInfo.year})
            </div>
          </div>
          <div>
            <div className="text-sm text-neutral-400">Color</div>
            <div className="font-medium">{vehicleInfo.color}</div>
          </div>
          <div>
            <div className="text-sm text-neutral-400">License Plate</div>
            <div className="font-medium">{vehicleInfo.licensePlate}</div>
          </div>
          <div>
            <div className="text-sm text-neutral-400">Insurance</div>
            <div className="font-medium">{vehicleInfo.insurance.provider || 'Not Set'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}