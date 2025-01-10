import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { riderService } from '../lib/services/rider.service';
import { authService } from '../lib/services/auth.service';
import { FormInput } from './FormInput';
import { locations } from '../types/location';

interface SettingsForm {
  name: string;
  email: string;
  phone: string;
  locationId: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export function RiderSettings() {
  const { user, rider } = useAuth();
  const [activeTab, setActiveTab] = useState<'basic' | 'security' | 'location' | 'notifications'>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<SettingsForm>({
    name: rider?.name || '',
    email: rider?.email || '',
    phone: rider?.phone || '',
    locationId: rider?.serviceLocations?.[0] || locations[0].id,
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    notifications: {
      email: rider?.notifications?.email ?? true,
      push: rider?.notifications?.push ?? true,
      sms: rider?.notifications?.sms ?? true,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleBasicInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !rider) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const updates = {
        name: formData.name,
        phone: formData.phone,
      };

      await riderService.updateBasicInfo(rider.id, updates);
      setSuccess('Basic information updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update basic information');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !rider) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Update email if changed
      if (formData.email !== rider.email) {
        await riderService.updateEmail(rider.id, user, formData.email);
      }

      // Update password if provided
      if (formData.newPassword) {
        if (formData.newPassword.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        if (formData.newPassword !== formData.confirmNewPassword) {
          throw new Error('New passwords do not match');
        }
        await riderService.updatePassword(user, formData.newPassword);
      }

      setSuccess('Security information updated successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update security information');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !rider) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Update the location
      const updatedRider = await riderService.updateLocation(rider.id, formData.locationId);
      
      // Update the auth context
      await authService.updateRiderDoc(rider.id, updatedRider);
      
      // Find the selected location name
      const selectedLocation = locations.find(loc => loc.id === formData.locationId);
      
      setSuccess(
        `Location updated successfully! You will now see drivers in ${selectedLocation?.name || formData.locationId}`
      );

      // Wait a bit for the database update to propagate
      setTimeout(() => {
        // Reload the page to ensure all components reflect the new location
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update location');
      setIsSubmitting(false);
    }
  };

  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !rider) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await riderService.updateNotificationPreferences(rider.id, formData.notifications);
      setSuccess('Notification preferences updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update notification preferences');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleNotification = (type: 'email' | 'push' | 'sms') => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  useEffect(() => {
    if (rider) {
      setFormData(prev => ({
        ...prev,
        name: rider.name || '',
        email: rider.email || '',
        phone: rider.phone || '',
        locationId: rider.serviceLocations?.[0] || locations[0].id,
        notifications: {
          email: rider.notifications?.email ?? true,
          push: rider.notifications?.push ?? true,
          sms: rider.notifications?.sms ?? true,
        },
      }));
    }
  }, [rider]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Mobile Tab Selection */}
      <div className="md:hidden mb-6">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as typeof activeTab)}
          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C69249]"
        >
          <option value="basic">Basic Information</option>
          <option value="security">Security</option>
          <option value="location">Location</option>
          <option value="notifications">Notifications</option>
        </select>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'basic'
              ? 'bg-[#C69249] text-white'
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
          }`}
        >
          Basic Information
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'security'
              ? 'bg-[#C69249] text-white'
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
          }`}
        >
          Security
        </button>
        <button
          onClick={() => setActiveTab('location')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'location'
              ? 'bg-[#C69249] text-white'
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
          }`}
        >
          Location
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'notifications'
              ? 'bg-[#C69249] text-white'
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
          }`}
        >
          Notifications
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded text-green-200 text-sm">
          {success}
        </div>
      )}

      {activeTab === 'basic' && (
        <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
          <FormInput
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {activeTab === 'security' && (
        <form onSubmit={handleSecuritySubmit} className="space-y-6">
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Current Password"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
          />
          <FormInput
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <FormInput
            label="Confirm New Password"
            name="confirmNewPassword"
            type="password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {activeTab === 'location' && (
        <form onSubmit={handleLocationSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <select
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C69249]"
              required
            >
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}, {location.region}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {activeTab === 'notifications' && (
        <form onSubmit={handleNotificationsSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-neutral-400">Receive ride updates and important alerts via email</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleNotification('email')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#C69249] focus:ring-offset-2 focus:ring-offset-black ${
                  formData.notifications.email ? 'bg-[#C69249]' : 'bg-neutral-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.notifications.email ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-neutral-400">Get instant updates about your rides</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleNotification('push')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#C69249] focus:ring-offset-2 focus:ring-offset-black ${
                  formData.notifications.push ? 'bg-[#C69249]' : 'bg-neutral-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.notifications.push ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg">
              <div>
                <h3 className="font-medium">SMS Notifications</h3>
                <p className="text-sm text-neutral-400">Get text messages for ride status updates</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleNotification('sms')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#C69249] focus:ring-offset-2 focus:ring-offset-black ${
                  formData.notifications.sms ? 'bg-[#C69249]' : 'bg-neutral-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}
    </div>
  );
}
