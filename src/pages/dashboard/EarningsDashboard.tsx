import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { EarningsCenter } from '../../components/dashboard/EarningsCenter';
import { SubscriptionManagement } from '../../components/dashboard/SubscriptionManagement';

export function EarningsDashboard() {
  const [earnings] = useState({
    today: 245.50,
    week: 1234.75,
    month: 4567.80,
    total: 12345.90,
    rides: 156,
    commission: 15
  });

  const handleUpdatePayment = () => {
    // Implement payment update logic
  };

  const handleManageSubscription = () => {
    // Implement subscription management logic
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#F5A623] mb-8">Earnings Dashboard</h1>
          
          <div className="grid gap-8">
            <EarningsCenter
              earnings={earnings}
              onUpdatePayment={handleUpdatePayment}
            />
            
            <SubscriptionManagement
              status="active"
              nextBilling={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}
              onManage={handleManageSubscription}
            />
          </div>
        </div>
      </main>
    </div>
  );
}