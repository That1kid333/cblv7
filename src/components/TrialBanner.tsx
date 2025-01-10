import React from 'react';
import { Gift, Calendar } from 'lucide-react';

interface TrialBannerProps {
  onStartTrial: () => void;
  isTrialAvailable: boolean;
}

export function TrialBanner({ onStartTrial, isTrialAvailable }: TrialBannerProps) {
  if (!isTrialAvailable) return null;

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-lg p-6 text-white">
      <div className="flex items-center gap-3 mb-4">
        <Gift className="w-8 h-8" />
        <div>
          <h3 className="text-xl font-bold">Special Holiday Offer!</h3>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Starting December 2024</span>
          </div>
        </div>
      </div>

      <p className="mb-6 text-white/90">
        Try Elite Drivers Club free for 30 days! Experience all premium benefits with no commitment.
        Cancel anytime during your trial.
      </p>

      <button
        onClick={onStartTrial}
        className="w-full py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
      >
        Start Your Free Trial
      </button>

      <p className="text-sm text-center mt-4 text-white/80">
        After trial ends, subscription continues at $25/month unless canceled
      </p>
    </div>
  );
}