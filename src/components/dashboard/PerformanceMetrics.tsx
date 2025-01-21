import React from 'react';
import { Clock, Car, DollarSign } from 'lucide-react';

interface Performance {
  hoursOnline: number;
  totalRides: number;
  todayRides: number;
  earnings: {
    total: number;
    today: number;
  };
}

interface Review {
  id: string;
  customerName: string;
  date: string;
  comment: string;
}

const PerformanceMetrics: React.FC = () => {
  const performance = {
    hoursOnline: 120,
    totalRides: 450,
    todayRides: 5,
    earnings: {
      total: 12500,
      today: 350
    }
  };

  const recentReviews = [
    {
      id: '1',
      customerName: 'John D.',
      date: '2024-01-15',
      comment: 'Excellent service, very professional.'
    },
    {
      id: '2',
      customerName: 'Sarah M.',
      date: '2024-01-14',
      comment: 'Great experience!'
    }
  ];

  return (
    <div className="bg-neutral-900 rounded-lg p-6 space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hours Online */}
        <div className="bg-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Hours Online</span>
            <Clock className="text-[#C69249]" />
          </div>
          <div className="text-3xl font-bold mb-2">{performance.hoursOnline}</div>
          <div className="text-sm text-neutral-400">Total hours on platform</div>
        </div>

        {/* Total Rides */}
        <div className="bg-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Total Rides</span>
            <Car className="text-[#C69249]" />
          </div>
          <div className="text-3xl font-bold mb-2">{performance.totalRides}</div>
          <div className="text-sm text-neutral-400">Completed rides</div>
        </div>

        {/* Total Earnings */}
        <div className="bg-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Total Earnings</span>
            <DollarSign className="text-[#C69249]" />
          </div>
          <div className="text-3xl font-bold mb-2">${performance.earnings.total}</div>
          <div className="text-sm text-neutral-400">Platform earnings</div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Recent Reviews</h3>
        <div className="space-y-4">
          {recentReviews.map(review => (
            <div key={review.id} className="bg-neutral-800 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">{review.customerName}</div>
                  <div className="text-sm text-neutral-400">{review.date}</div>
                </div>
              </div>
              <p className="text-sm text-neutral-300">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips for Success */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Tips for Success</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-neutral-800 rounded-lg p-4">
            <h4 className="font-medium mb-2">Stay Active</h4>
            <p className="text-sm text-neutral-300">
              Regular activity helps maintain visibility and increases booking opportunities.
            </p>
          </div>
          <div className="bg-neutral-800 rounded-lg p-4">
            <h4 className="font-medium mb-2">Professional Service</h4>
            <p className="text-sm text-neutral-300">
              Maintain high standards of service and professionalism with every client.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;