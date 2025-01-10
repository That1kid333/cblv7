import { Clock, MapPin, Star, Car } from 'lucide-react';
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
            <div className="flex items-center gap-2 text-neutral-400">
              <Star className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
              <span>{metrics.rating.toFixed(1)} Rating</span>
              <span>•</span>
              <span>{metrics.totalRides} Total Rides</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hours Online */}
        <div className="bg-neutral-900 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-[#F5A623] mb-2">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Hours Online</span>
          </div>
          <div className="text-2xl font-bold">
            {metrics.todayHours}h
          </div>
          <div className="text-sm text-neutral-400 mt-1">
            Total: {metrics.hoursOnline}h
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

        {/* Rating */}
        <div className="bg-neutral-900 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <Star className="w-5 h-5" />
            <span className="font-medium">Rating</span>
          </div>
          <div className="text-2xl font-bold">
            {metrics.rating.toFixed(1)}
          </div>
        </div>

        {/* Rides */}
        <div className="bg-neutral-900 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-purple-500 mb-2">
            <Car className="w-5 h-5" />
            <span className="font-medium">Completed Rides</span>
          </div>
          <div className="text-2xl font-bold">
            {metrics.todayRides}
          </div>
          <div className="text-sm text-neutral-400 mt-1">
            Total: {metrics.totalRides}
          </div>
        </div>
      </div>
    </div>
  );
}