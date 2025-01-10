import React from 'react';
import { Shield, CreditCard, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface SubscriptionProps {
  status: 'active' | 'inactive' | 'cancelled';
  nextBilling: string;
  onManage: () => void;
}

export function SubscriptionManagement({ status, nextBilling, onManage }: SubscriptionProps) {
  return (
    <div className="bg-neutral-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#F5A623]" />
          <div>
            <h2 className="text-xl font-semibold">Elite Drivers Club</h2>
            <p className="text-neutral-400">$25/month</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          status === 'active' ? 'bg-green-500/20 text-green-500' :
          status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
          'bg-yellow-500/20 text-yellow-500'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-400">
            <CreditCard className="w-4 h-4" />
            <span>Payment Method</span>
          </div>
          <span>•••• 4242</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-400">
            <Calendar className="w-4 h-4" />
            <span>Next Billing Date</span>
          </div>
          <span>{format(new Date(nextBilling), 'MMMM d, yyyy')}</span>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={onManage}
          className="w-full py-2 bg-[#F5A623] text-white rounded-lg hover:bg-[#E09612] transition-colors"
        >
          Manage Subscription
        </button>
        
        <div className="text-sm text-center text-neutral-400">
          Your subscription helps maintain our premium service quality
        </div>
      </div>
    </div>
  );
}