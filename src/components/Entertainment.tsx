import React from 'react';
import { X, Music, Radio, Tv } from 'lucide-react';

interface Driver {
  id: number;
  name: string;
  image: string;
}

interface EntertainmentProps {
  driverId: number;
  onClose: () => void;
  driver: Driver;
}

const ENTERTAINMENT_OPTIONS = [
  {
    icon: Music,
    title: 'Music Streaming',
    description: 'Access to Spotify, Apple Music, and more',
  },
  {
    icon: Radio,
    title: 'Radio Stations',
    description: 'Local and international radio stations',
  },
  {
    icon: Tv,
    title: 'Video Content',
    description: 'Watch movies and TV shows during your ride',
  },
];

export function Entertainment({ driver, onClose }: EntertainmentProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={driver.image} alt={driver.name} className="w-10 h-10 rounded-full" />
            <span className="font-semibold">Entertainment Options</span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {ENTERTAINMENT_OPTIONS.map((option, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <option.icon className="w-6 h-6 text-[#F5A623]" />
              <div>
                <h3 className="font-semibold mb-1">{option.title}</h3>
                <p className="text-neutral-400 text-sm">{option.description}</p>
              </div>
            </div>
          ))}

          <p className="text-center text-neutral-400 text-sm mt-4">
            Entertainment options are available during your ride.
            Please discuss preferences with your driver.
          </p>
        </div>
      </div>
    </div>
  );
}