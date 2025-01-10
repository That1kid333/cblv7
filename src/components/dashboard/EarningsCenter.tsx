import React from 'react';
import { DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

interface EarningsSummary {
  today: number;
  week: number;
  month: number;
  total: number;
  rides: number;
  commission: number;
}

const defaultEarnings: EarningsSummary = {
  today: 0,
  week: 0,
  month: 0,
  total: 0,
  rides: 0,
  commission: 20
};

export function EarningsCenter() {
  const [earnings] = React.useState<EarningsSummary>(defaultEarnings);

  const handleUpdatePayment = () => {
    // Implement payment update logic
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400">Today's Earnings</span>
            <DollarSign className="w-5 h-5 text-[#F5A623]" />
          </div>
          <div className="text-2xl font-bold">${earnings.today.toFixed(2)}</div>
        </div>

        <div className="bg-neutral-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400">This Week</span>
            <Calendar className="w-5 h-5 text-[#F5A623]" />
          </div>
          <div className="text-2xl font-bold">${earnings.week.toFixed(2)}</div>
        </div>

        <div className="bg-neutral-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400">This Month</span>
            <TrendingUp className="w-5 h-5 text-[#F5A623]" />
          </div>
          <div className="text-2xl font-bold">${earnings.month.toFixed(2)}</div>
        </div>

        <div className="bg-neutral-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400">Total Earnings</span>
            <DollarSign className="w-5 h-5 text-[#F5A623]" />
          </div>
          <div className="text-2xl font-bold">${earnings.total.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Commission Structure</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Standard Rate</span>
              <span className="text-[#F5A623]">20%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Elite Member Rate</span>
              <span className="text-green-500">15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Your Current Rate</span>
              <span className="text-2xl font-bold text-[#F5A623]">
                {earnings.commission}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Direct Deposit Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Deposits</p>
                <p className="text-sm text-neutral-400">
                  Every Monday at 12:00 AM
                </p>
              </div>
              <button
                onClick={handleUpdatePayment}
                className="flex items-center gap-2 px-4 py-2 bg-[#F5A623] text-white rounded-lg hover:bg-[#E09612] transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                Update Payment
              </button>
            </div>
            <div className="text-sm text-neutral-400">
              Next deposit: {format(new Date(), 'MMMM d, yyyy')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}