import { useState } from 'react';
import { MapPin, Phone, Mail, Car, CalendarDays } from 'lucide-react';
import { Driver } from '../types/driver';
import { locations } from '../types/location';
import { PhotoUpload } from './PhotoUpload';

interface ProfileSectionProps {
  driver: Driver;
  onUpdate: (updates: Partial<Driver>) => void;
}

export function ProfileSection({ driver, onUpdate }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Driver>(driver);

  const handleSave = () => {
    onUpdate(profile);
    setIsEditing(false);
  };

  const handlePhotoChange = (photoUrl: string) => {
    setProfile(prev => ({ ...prev, photo: photoUrl }));
    // Auto-save the photo update
    onUpdate({ photo: photoUrl });
  };

  const handleVehicleUpdate = (field: keyof Driver['vehicle'], value: string) => {
    setProfile(prev => ({
      ...prev,
      vehicle: {
        ...prev.vehicle,
        [field]: value
      }
    }));
  };

  return (
    <div className="bg-neutral-900 rounded-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-4">
          <PhotoUpload
            currentPhotoUrl={profile.photo}
            onPhotoChange={handlePhotoChange}
            userId={profile.id}
          />
          <div>
            <h2 className="text-2xl font-semibold">{profile.name}</h2>
            <div className="flex items-center space-x-1 text-neutral-400">
              <span className="text-sm">{profile.rating.toFixed(1)} Rating</span>
              <span>•</span>
              <span className="text-sm">{profile.totalRides} Rides</span>
            </div>
          </div>
        </div>
        
        {isEditing ? (
          <div className="space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-[#C69249] text-white rounded-lg hover:bg-[#B58239]"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm bg-[#C69249] text-white rounded-lg hover:bg-[#B58239]"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-neutral-300">
            <MapPin className="w-4 h-4" />
            {isEditing ? (
              <select
                value={profile.serviceLocations[0] || ''}
                onChange={(e) => setProfile(prev => ({ 
                  ...prev, 
                  serviceLocations: e.target.value ? [e.target.value] : [] 
                }))}
                className="bg-neutral-800 text-white px-2 py-1 rounded flex-1"
              >
                <option value="">Select a location</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            ) : (
              <span>
                {locations.find(loc => loc.id === profile.serviceLocations[0])?.name || 'Add your location'}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-neutral-300">
            <Phone className="w-4 h-4" />
            {isEditing ? (
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-neutral-800 text-white px-2 py-1 rounded flex-1"
              />
            ) : (
              <span>{profile.phone}</span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-neutral-300">
            <Mail className="w-4 h-4" />
            <span>{profile.email}</span>
          </div>

          <div className="flex items-center space-x-2 text-neutral-300">
            <Car className="w-4 h-4" />
            {isEditing ? (
              <input
                type="text"
                value={profile.vehicle.plate}
                onChange={(e) => handleVehicleUpdate('plate', e.target.value)}
                placeholder="Vehicle Tag/License Plate"
                className="bg-neutral-800 text-white px-2 py-1 rounded flex-1"
              />
            ) : (
              <span>TAG# {profile.vehicle.plate || 'Not provided'}</span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-neutral-800 p-4 rounded-lg">
            <div className="text-sm text-neutral-400">Rating</div>
            <div className="text-xl font-semibold">{profile.rating.toFixed(1)}</div>
          </div>
          <div className="bg-neutral-800 p-4 rounded-lg">
            <div className="text-sm text-neutral-400">Total Rides</div>
            <div className="text-xl font-semibold">{profile.totalRides}</div>
          </div>
          <div className="bg-neutral-800 p-4 rounded-lg">
            <div className="text-sm text-neutral-400">Acceptance Rate</div>
            <div className="text-xl font-semibold">{profile.metrics.acceptanceRate}%</div>
          </div>
          <div className="bg-neutral-800 p-4 rounded-lg">
            <div className="text-sm text-neutral-400">Response Time</div>
            <div className="text-xl font-semibold">{profile.metrics.responseTime}s</div>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Vehicle Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-neutral-300">
              <Car className="w-4 h-4" />
              {isEditing ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={profile.vehicle.make}
                    onChange={(e) => handleVehicleUpdate('make', e.target.value)}
                    placeholder="Make"
                    className="w-full bg-neutral-800 text-white px-2 py-1 rounded"
                  />
                  <input
                    type="text"
                    value={profile.vehicle.model}
                    onChange={(e) => handleVehicleUpdate('model', e.target.value)}
                    placeholder="Model"
                    className="w-full bg-neutral-800 text-white px-2 py-1 rounded"
                  />
                </div>
              ) : (
                <span>{`${profile.vehicle.make} ${profile.vehicle.model}`}</span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-neutral-300">
              <CalendarDays className="w-4 h-4" />
              {isEditing ? (
                <input
                  type="text"
                  value={profile.vehicle.year}
                  onChange={(e) => handleVehicleUpdate('year', e.target.value)}
                  placeholder="Year"
                  className="bg-neutral-800 text-white px-2 py-1 rounded flex-1"
                />
              ) : (
                <span>{profile.vehicle.year}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
