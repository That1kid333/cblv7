import React from 'react';
import { Shield, Check } from 'lucide-react';

interface SubscriptionPlanProps {
  onSubscribe: () => Promise<void>;
  isLoading: boolean;
}

export function SubscriptionPlan({ onSubscribe, isLoading }: SubscriptionPlanProps) {
  const benefits = [
    "Priority ride matching",
    "Lower commission rates",
    "24/7 premium support",
    "Monthly performance bonuses",
    "Exclusive driver events",
    "Advanced booking access"
  ];

  return (
    <div className="bg-neutral-900 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="w-8 h-8 text-[#F5A623]" />
        <h2 className="text-2xl font-bold">Elite Drivers Club</h2>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline mb-4">
          <span className="text-4xl font-bold">$25</span>
          <span className="text-neutral-400 ml-2">/month</span>
        </div>
        
        <p className="text-neutral-400">
          Join our elite drivers program and unlock premium benefits
        </p>
      </div>

      <ul className="space-y-3 mb-6">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-center space-x-3">
            <Check className="w-5 h-5 text-[#F5A623]" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSubscribe}
        disabled={isLoading}
        className="w-full py-3 bg-[#F5A623] text-white rounded-lg font-semibold hover:bg-[#E09612] transition-colors disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Subscribe Now"}
      </button>

      <p className="text-sm text-neutral-400 text-center mt-4">
        Cancel anytime. No long-term commitment required.
      </p>
    </div>
  );
}