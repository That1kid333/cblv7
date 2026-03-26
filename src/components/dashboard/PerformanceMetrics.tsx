import React from 'react';
import { Star, Clock, TrendingUp, Award } from 'lucide-react';

interface PerformanceData {
  acceptanceRate: number;
  responseTime: number;
  hoursOnline: number;
  totalRides: number;
  rating: number;
  reviews: Array<{
    id: string;
    customerName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

export function PerformanceMetrics() {
  const [performance] = React.useState<PerformanceData>({
    acceptanceRate: 95,
    responseTime: 30,
    hoursOnline: 120,
    totalRides: 450,
    rating: 4.9,
    reviews: [
      {
        id: '1',
        customerName: 'John D.',
        rating: 5,
        comment: 'Excellent service, very professional driver',
        date: '2024-03-15'
      },
      {
        id: '2',
        customerName: 'Sarah M.',
        rating: 5,
        comment: 'Perfect timing and great conversation',
        date: '2024-03-14'
      }
    ]
  });

  const renderRatingStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'fill-[#F5A623] text-[#F5A623]'
            : 'text-neutral-600'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 p-6 rounded-lg">
          <div className="flex items-center gap-2 text-[#F5A623] mb-2">
            <Star className="w-5 h-5" />
            <span className="font-medium">Rating</span>
          </div>
          <div className="text-3xl font-bold mb-2">{performance.rating}</div>
          <div className="flex items-center gap-1">
            {renderRatingStars(Math.floor(performance.rating))}
          </div>
        </div>

        <div className="bg-neutral-900 p-6 rounded-lg">
          <div className="flex items-center gap-2 text-[#F5A623] mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Acceptance Rate</span>
          </div>
          <div className="text-3xl font-bold mb-2">{performance.acceptanceRate}%</div>
          <div className="text-sm text-neutral-400">Last 30 days</div>
        </div>

        <div className="bg-neutral-900 p-6 rounded-lg">
          <div className="flex items-center gap-2 text-[#F5A623] mb-2">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Response Time</span>
          </div>
          <div className="text-3xl font-bold mb-2">{performance.responseTime}s</div>
          <div className="text-sm text-neutral-400">Average</div>
        </div>

        <div className="bg-neutral-900 p-6 rounded-lg">
          <div className="flex items-center gap-2 text-[#F5A623] mb-2">
            <Award className="w-5 h-5" />
            <span className="font-medium">Total Rides</span>
          </div>
          <div className="text-3xl font-bold mb-2">{performance.totalRides}</div>
          <div className="text-sm text-neutral-400">Lifetime</div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-neutral-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
        <div className="space-y-4">
          {performance.reviews.map((review) => (
            <div key={review.id} className="bg-neutral-800 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{review.customerName}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {renderRatingStars(review.rating)}
                  </div>
                </div>
                <span className="text-sm text-neutral-400">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-neutral-300 mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Tips */}
      <div className="bg-neutral-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Performance Tips</h2>
        <div className="grid gap-4">
          <div className="bg-neutral-800 p-4 rounded-lg">
            <h3 className="font-semibold text-[#F5A623] mb-2">
              Maintain High Ratings
            </h3>
            <p className="text-neutral-400">
              Keep your car clean, be punctual, and provide excellent customer service
              to maintain your high rating.
            </p>
          </div>
          
          <div className="bg-neutral-800 p-4 rounded-lg">
            <h3 className="font-semibold text-[#F5A623] mb-2">
              Quick Response Time
            </h3>
            <p className="text-neutral-400">
              Respond to ride requests promptly to improve your acceptance rate
              and overall performance metrics.
            </p>
          </div>
          
          <div className="bg-neutral-800 p-4 rounded-lg">
            <h3 className="font-semibold text-[#F5A623] mb-2">
              Professional Communication
            </h3>
            <p className="text-neutral-400">
              Maintain professional communication with passengers and use the
              in-app messaging system for all ride-related conversations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}