import React from 'react';
import { FormInput } from '../FormInput';
import { Driver } from '../../types/driver';

interface VehicleInfoFormProps {
  driver: Driver;
  onChange: (updates: Partial<Driver>) => void;
}

export function VehicleInfoForm({ driver, onChange }: VehicleInfoFormProps) {
  const handleVehicleChange = (field: string, value: string) => {
    onChange({
      vehicle: {
        ...driver.vehicle,
        [field]: value
      }
    });
  };

  const handleInsuranceChange = (field: string, value: string) => {
    onChange({
      vehicle: {
        ...driver.vehicle,
        insurance: {
          ...driver.vehicle.insurance,
          [field]: value
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Make"
            type="text"
            value={driver.vehicle.make}
            onChange={(e) => handleVehicleChange('make', e.target.value)}
            required
          />

          <FormInput
            label="Model"
            type="text"
            value={driver.vehicle.model}
            onChange={(e) => handleVehicleChange('model', e.target.value)}
            required
          />

          <FormInput
            label="Year"
            type="text"
            pattern="\d{4}"
            value={driver.vehicle.year}
            onChange={(e) => handleVehicleChange('year', e.target.value)}
            required
          />

          <FormInput
            label="Color"
            type="text"
            value={driver.vehicle.color}
            onChange={(e) => handleVehicleChange('color', e.target.value)}
            required
          />

          <FormInput
            label="License Plate"
            type="text"
            value={driver.vehicle.plate}
            onChange={(e) => handleVehicleChange('plate', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="bg-neutral-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Insurance Information</h3>
        <div className="space-y-4">
          <FormInput
            label="Insurance Provider"
            type="text"
            value={driver.vehicle.insurance.provider}
            onChange={(e) => handleInsuranceChange('provider', e.target.value)}
            required
          />

          <FormInput
            label="Policy Number"
            type="text"
            value={driver.vehicle.insurance.policyNumber}
            onChange={(e) => handleInsuranceChange('policyNumber', e.target.value)}
            required
          />

          <FormInput
            label="Expiration Date"
            type="date"
            value={driver.vehicle.insurance.expirationDate.split('T')[0]}
            onChange={(e) => handleInsuranceChange('expirationDate', new Date(e.target.value).toISOString())}
            required
          />
        </div>
      </div>
    </div>
  );
}