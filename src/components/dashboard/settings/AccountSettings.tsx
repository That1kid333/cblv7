import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { Driver } from '../../../types/driver';
import { locations } from '../../../types/location';

interface AccountSettingsProps {
  driver: Driver;
  onUpdate: (updates: Partial<Driver>) => void;
}

export function AccountSettings({ driver, onUpdate }: AccountSettingsProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: driver.name,
    email: driver.email,
    phone: driver.phone,
    serviceLocations: driver.serviceLocations || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const currentLocation = locations.find(loc => 
    driver.serviceLocations && 
    driver.serviceLocations.length > 0 && 
    loc.id === driver.serviceLocations[0]
  );

  return (
    <div className="bg-neutral-900 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Account Information</h2>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Full Name</label>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-neutral-500" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="flex-1 bg-neutral-800 px-3 py-2 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Email Address</label>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-neutral-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="flex-1 bg-neutral-800 px-3 py-2 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Phone Number</label>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-neutral-500" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="flex-1 bg-neutral-800 px-3 py-2 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Service Location</label>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-neutral-500" />
              <select
                value={formData.serviceLocations[0] || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  serviceLocations: e.target.value ? [e.target.value] : [] 
                }))}
                className="flex-1 bg-neutral-800 px-3 py-2 rounded-lg text-white"
              >
                <option value="">Select your city</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}, {location.region}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-neutral-500" />
              <span className="text-white">{driver.name}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-neutral-500" />
              <span className="text-white">{driver.email}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-neutral-500" />
              <span className="text-white">{driver.phone}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-neutral-500" />
              <span className="text-white">
                {currentLocation ? `${currentLocation.name}, ${currentLocation.region}` : 'No location set'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] transition-colors"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}