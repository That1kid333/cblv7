import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Chat from './Chat'; // Assuming Chat component is in the same directory

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

export function MessagesTab() {
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const { rider } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const rideId = searchParams.get('rideId');
  const driverId = searchParams.get('driverId');

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

  useEffect(() => {
    // If rideId is provided in URL, select that thread
    if (rideId) {
      const thread = chatThreads.find(t => t.rideId === rideId);
      if (thread) {
        setSelectedThread(thread);
      }
    }
  }, [rideId, chatThreads]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C69249]"></div>
      </div>
    );
  }

  if (selectedThread) {
    return (
      <div className="h-[calc(100vh-200px)]">
        <div className="flex items-center space-x-4 p-4 border-b border-neutral-700">
          <button
            onClick={() => setSelectedThread(null)}
            className="text-neutral-400 hover:text-white"
          >
            ← Back
          </button>
          <div className="flex items-center space-x-3">
            {selectedThread.driverPhoto ? (
              <img
                src={selectedThread.driverPhoto}
                alt={selectedThread.driverName}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-neutral-600 flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {selectedThread.driverName[0]}
                </span>
              </div>
            )}
            <h3 className="font-medium text-white">{selectedThread.driverName}</h3>
          </div>
        </div>
        <Chat rideId={selectedThread.rideId} driverId={selectedThread.driverId} />
      </div>
    );
  }

  if (chatThreads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <MessageCircle className="w-16 h-16 text-[#C69249] mb-4" />
        <p className="text-center text-neutral-400">
          No messages yet. Your conversations with drivers will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {chatThreads.map((thread) => (
        <div
          key={thread.id}
          className={`bg-neutral-800 rounded-lg p-4 hover:bg-neutral-700 transition-colors cursor-pointer ${
            thread.rideId === rideId ? 'border-2 border-[#C69249]' : ''
          }`}
          onClick={() => setSelectedThread(thread)}
        >
          <div className="flex items-center space-x-4">
            {thread.driverPhoto ? (
              <img
                src={thread.driverPhoto}
                alt={thread.driverName}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-neutral-600 flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {thread.driverName[0]}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-medium text-white">{thread.driverName}</h3>
              <p className="text-sm text-neutral-400">{thread.lastMessage}</p>
            </div>
            <div className="text-xs text-neutral-500">
              {new Date(thread.timestamp).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessagesTab;
