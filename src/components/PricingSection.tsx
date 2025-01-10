import React from 'react';
import { DollarSign } from 'lucide-react';

interface PricingSectionProps {
  baseRate: number;
  airportRate: number;
  longDistanceRate: number;
  isEditing: boolean;
  onRateChange: (field: string, value: number) => void;
}

export function PricingSection({ 
  baseRate, 
  airportRate, 
  longDistanceRate, 
  isEditing, 
  onRateChange 
}: PricingSectionProps) {
  const handleRateChange = (field: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      onRateChange(field, numValue);
    }
  };

  return (
    <div className="border-t border-neutral-800 pt-6">
      <h3 className="text-lg font-semibold text-white mb-4">Pricing</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PriceCard
          title="Base Rate"
          value={baseRate}
          suffix="/mile"
          isEditing={isEditing}
          onChange={(value) => handleRateChange('baseRate', value)}
        />
        <PriceCard
          title="Airport Rate"
          value={airportRate}
          isEditing={isEditing}
          onChange={(value) => handleRateChange('airportRate', value)}
        />
        <PriceCard
          title="Long Distance"
          value={longDistanceRate}
          suffix="/mile"
          isEditing={isEditing}
          onChange={(value) => handleRateChange('longDistanceRate', value)}
        />
      </div>
    </div>
  );
}

interface PriceCardProps {
  title: string;
  value: number;
  suffix?: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

function PriceCard({ title, value, suffix = '', isEditing, onChange }: PriceCardProps) {
  return (
    <div className="bg-neutral-800 p-4 rounded-lg">
      <div className="flex items-center gap-2 text-[#F5A623] mb-2">
        <DollarSign className="w-4 h-4" />
        <span className="font-medium">{title}</span>
      </div>
      {isEditing ? (
        <input
          type="number"
          min="0"
          step="0.01"
          value={value.toString()}
          onChange={(e) => onChange(e.target.value)}
          className="bg-neutral-700 px-2 py-1 rounded w-full"
        />
      ) : (
        <p className="text-2xl font-bold text-white">
          ${value}{suffix}
        </p>
      )}
    </div>
  );
}