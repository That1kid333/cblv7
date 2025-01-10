import React, { useState } from 'react';
import { MapPin, Calendar, Clock, MessageCircle } from 'lucide-react';
import { ChatBox } from './ChatBox';

const DEMO_RIDES = [
  {
    id: 1,
    customerName: 'Alice Johnson',
    phone: '(412) 555-0123',
    pickup: 'Downtown Pittsburgh',
    dropoff: 'Pittsburgh International Airport',
    date: '2024-03-20',
    time: '09:00 AM',
    status: 'pending',
    messages: [
      { text: 'Hi, I need to be at the airport by 10:30 AM', sender: 'customer', timestamp: '08:30 AM' }
    ]
  },
  {
    id: 2,
    customerName: 'Bob Wilson',
    phone: '(412) 555-0124',
    pickup: 'South Side',
    dropoff: 'North Shore',
    date: '2024-03-20',
    time: '11:30 AM',
    status: 'confirmed',
    messages: []
  },
  {
    id: 3,
    customerName: 'Carol Martinez',
    phone: '(412) 555-0125',
    pickup: 'Oakland',
    dropoff: 'Downtown Pittsburgh',
    date: '2024-03-20',
    time: '02:00 PM',
    status: 'pending',
    messages: [
      { text: 'Do you have space for luggage?', sender: 'customer', timestamp: '09:15 AM' }
    ]
  },
];

export function RidesSection() {
  const [rides] = useState(DEMO_RIDES);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  const filteredRides = selectedStatus === 'all'
    ? rides
    : rides.filter(ride => ride.status === selectedStatus);

  const selectedRide = rides.find(ride => ride.id === selectedChat);

  return (
    <div>
      <div className="mb-6 flex gap-2">
        {(['all', 'pending', 'confirmed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg capitalize ${
              selectedStatus === status
                ? 'bg-[#F5A623] text-white'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredRides.map((ride) => (
          <div
            key={ride.id}
            className="bg-neutral-900 rounded-lg p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-1">{ride.customerName}</h3>
                <p className="text-neutral-400">{ride.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                {ride.messages.length > 0 && (
                  <span className="px-2 py-1 bg-[#F5A623] text-white text-xs rounded-full">
                    {ride.messages.length}
                  </span>
                )}
                <button
                  onClick={() => setSelectedChat(ride.id)}
                  className="p-2 text-neutral-400 hover:text-[#F5A623] transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <span className={`px-3 py-1 rounded-full text-sm capitalize ${
                  ride.status === 'confirmed'
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {ride.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-neutral-400">
                  <MapPin className="w-4 h-4" />
                  <span>Pickup</span>
                </div>
                <p>{ride.pickup}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-neutral-400">
                  <MapPin className="w-4 h-4" />
                  <span>Dropoff</span>
                </div>
                <p>{ride.dropoff}</p>
              </div>
            </div>

            <div className="flex gap-6 pt-2">
              <div className="flex items-center gap-2 text-neutral-400">
                <Calendar className="w-4 h-4" />
                <span>{ride.date}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <Clock className="w-4 h-4" />
                <span>{ride.time}</span>
              </div>
            </div>

            {ride.status === 'pending' && (
              <button className="w-full mt-4 py-2 bg-[#F5A623] text-white rounded-lg hover:bg-[#E09612] transition-colors">
                Accept Ride
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedChat && selectedRide && (
        <ChatBox
          title={`Chat with ${selectedRide.customerName}`}
          messages={selectedRide.messages}
          onClose={() => setSelectedChat(null)}
        />
      )}
    </div>
  );
}