import { Clock, MapPin, Car, DollarSign } from 'lucide-react';
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
            <div className="flex flex-col gap-1">
              <span>{metrics.totalRides} Rides</span>
              <span>{metrics.hoursOnline} Hours Online</span>
              <span>${metrics.totalEarnings} Earned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hours Online */}
        <div className="bg-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Hours Online</span>
            <Clock className="text-[#C69249]" />
          </div>
          <div className="text-2xl font-bold">
            {metrics.hoursOnline}
          </div>
        </div>

        {/* Service Area */}
        <div className="bg-neutral-900 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-green-500 mb-2">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">Service Area</span>
          </div>
          <div className="text-2xl font-bold">
            {getServiceAreaName()}
          </div>
        </div>

        {/* Total Rides */}
        <div className="bg-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Total Rides</span>
            <Car className="text-[#C69249]" />
          </div>
          <div className="text-2xl font-bold">
            {metrics.totalRides}
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Total Earnings</span>
            <DollarSign className="text-[#C69249]" />
          </div>
          <div className="text-2xl font-bold">
            ${metrics.totalEarnings}
          </div>
        </div>
      </div>
    </div>
  );
}