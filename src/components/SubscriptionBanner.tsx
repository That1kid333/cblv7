import React from 'react';
import { Crown, Check } from 'lucide-react';

interface SubscriptionBannerProps {
  onSubscribe: () => void;
  isSubscribed: boolean;
}

export function SubscriptionBanner({ onSubscribe, isSubscribed }: SubscriptionBannerProps) {
  const benefits = [
    'Priority ride matching',
    'Lower commission rates (15% vs 20%)',
    '24/7 premium support',
    'Monthly performance bonuses',
    'Exclusive driver events'
  ];

  return (
    <div className="bg-gradient-to-r from-[#C69249] to-[#E09612] rounded-lg p-6 text-white">
      <div className="flex items-center gap-3 mb-4">
        <Crown className="w-8 h-8" />
        <div>
          <h3 className="text-xl font-bold">Elite Drivers Club</h3>
          <p className="text-sm opacity-90">Unlock premium benefits</p>
        </div>
      </div>

      <ul className="space-y-2 mb-6">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      {isSubscribed ? (
        <div className="bg-white/20 rounded-lg p-4 text-center">
          <p className="font-semibold">You're an Elite Member!</p>
          <p className="text-sm opacity-90">Enjoying premium benefits</p>
        </div>
      ) : (
        <button
          onClick={onSubscribe}
          className="w-full py-3 bg-white text-[#C69249] rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
        >
          Join Elite Drivers Club - $25/month
        </button>
      )}
    </div>
  );
}