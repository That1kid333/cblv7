import React from 'react';
import { FormInput } from '../FormInput';
import { Driver } from '../../types/driver';
import { Camera } from 'lucide-react';

interface PersonalInfoFormProps {
  driver: Driver;
  onChange: (updates: Partial<Driver>) => void;
  onPhotoUpload: (file: File) => Promise<void>;
}

export function PersonalInfoForm({ driver, onChange, onPhotoUpload }: PersonalInfoFormProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await onPhotoUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="relative">
          <img
            src={driver.photo || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop'}
            alt="Profile"
            className="w-32 h-32 rounded-lg object-cover"
          />
          <label className="absolute bottom-2 right-2 p-2 bg-[#F5A623] rounded-full cursor-pointer hover:bg-[#E09612] transition-colors">
            <Camera className="w-4 h-4 text-white" />
            <input
              type="file"
              accept="image/png"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <FormInput
        label="Full Name"
        type="text"
        value={driver.name}
        onChange={(e) => onChange({ name: e.target.value })}
        required
      />

      <FormInput
        label="Email Address"
        type="email"
        value={driver.email}
        onChange={(e) => onChange({ email: e.target.value })}
        required
      />

      <FormInput
        label="Phone Number"
        type="tel"
        value={driver.phone}
        onChange={(e) => onChange({ phone: e.target.value })}
        required
      />

      <FormInput
        label="Driver's License Number"
        type="text"
        value={driver.driversLicense.number}
        onChange={(e) => onChange({ 
          driversLicense: { 
            ...driver.driversLicense, 
            number: e.target.value 
          } 
        })}
        required
      />

      <FormInput
        label="License Expiration Date"
        type="date"
        value={driver.driversLicense.expirationDate.split('T')[0]}
        onChange={(e) => onChange({ 
          driversLicense: { 
            ...driver.driversLicense, 
            expirationDate: new Date(e.target.value).toISOString() 
          } 
        })}
        required
      />
    </div>
  );
}