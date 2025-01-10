import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { MessageCircle } from 'lucide-react';

interface ChatThread {
  id: string;
  driverId: string;
  driverName: string;
  driverPhoto?: string;
  lastMessage: string;
  timestamp: string;
  rideId: string;
}

interface Ride {
  id: string;
  driverId: string;
  driver: {
    name: string;
    photo?: string;
  };
  timestamp: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
}

export function MessagesList() {
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);
  const { rider } = useAuth();

  useEffect(() => {
    const fetchChatThreads = async () => {
      if (!rider?.id) return;

      try {
        // First, get all rides where the user is the rider
        const ridesQuery = query(
          collection(db, 'rides'),
          where('riderId', '==', rider.id),
          where('status', 'in', ['accepted', 'in_progress', 'completed']),
          orderBy('timestamp', 'desc')
        );

        const ridesSnapshot = await getDocs(ridesQuery);
        const rides = ridesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Ride));

        // For each ride, get the latest message
        const threads = await Promise.all(
          rides.map(async (ride) => {
            const messagesQuery = query(
              collection(db, 'messages'),
              where('rideId', '==', ride.id),
              orderBy('timestamp', 'desc'),
              where('participants', 'array-contains', rider.id)
            );

            const messagesSnapshot = await getDocs(messagesQuery);
            const latestMessage = messagesSnapshot.docs[0]?.data();

            return {
              id: ride.id,
              driverId: ride.driverId,
              driverName: ride.driver?.name || 'Unknown Driver',
              driverPhoto: ride.driver?.photo,
              lastMessage: latestMessage?.content || 'No messages yet',
              timestamp: latestMessage?.timestamp || ride.timestamp,
              rideId: ride.id
            };
          })
        );

        setChatThreads(threads);
      } catch (error) {
        console.error('Error fetching chat threads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatThreads();
  }, [rider?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C69249]"></div>
      </div>
    );
  }

  if (chatThreads.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <MessageCircle className="w-16 h-16 text-[#C69249] mb-4" />
        <p className="text-center text-neutral-400">
          No messages yet.<br />
          Book a ride to start chatting with your driver.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <div className="space-y-4">
          {chatThreads.map((thread) => (
            <Link
              key={thread.id}
              to={`/messages/${thread.driverId}?rideId=${thread.rideId}`}
              className="block bg-neutral-800 rounded-lg p-4 hover:bg-neutral-700 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={thread.driverPhoto || '/default-avatar.png'}
                  alt={thread.driverName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{thread.driverName}</h3>
                  <p className="text-sm text-neutral-400 line-clamp-1">
                    {thread.lastMessage}
                  </p>
                </div>
                <p className="text-xs text-neutral-500">
                  {new Date(thread.timestamp).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MessagesList;
