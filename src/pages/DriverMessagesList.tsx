import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import DriverChat from '../components/DriverChat';

interface ChatThread {
  id: string;
  riderId: string;
  riderName: string;
  riderPhoto?: string;
  lastMessage: string;
  timestamp: string;
  rideId: string;
}

interface Ride {
  id: string;
  riderId: string;
  rider: {
    name: string;
    photo?: string;
  };
  timestamp: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
}

export function DriverMessagesList() {
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [loading, setLoading] = useState(true);
  const { driver } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const rideId = searchParams.get('rideId');
  const riderId = searchParams.get('riderId');

  useEffect(() => {
    const fetchChatThreads = async () => {
      if (!driver?.id) return;

      try {
        // First, get all rides where the user is the driver
        const ridesQuery = query(
          collection(db, 'rides'),
          where('driverId', '==', driver.id),
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
              orderBy('timestamp', 'desc')
            );

            const messagesSnapshot = await getDocs(messagesQuery);
            const latestMessage = messagesSnapshot.docs[0]?.data();

            return {
              id: ride.id,
              riderId: ride.riderId,
              riderName: ride.rider?.name || 'Anonymous Rider',
              riderPhoto: ride.rider?.photo,
              lastMessage: latestMessage?.content || 'No messages yet',
              timestamp: latestMessage?.timestamp || ride.timestamp,
              rideId: ride.id
            };
          })
        );

        setChatThreads(threads);

        // If rideId is provided in URL, select that thread
        if (rideId) {
          const thread = threads.find(t => t.rideId === rideId);
          if (thread) {
            setSelectedThread(thread);
          }
        }
      } catch (error) {
        console.error('Error fetching chat threads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatThreads();
  }, [driver?.id, rideId]);

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
            {selectedThread.riderPhoto ? (
              <img
                src={selectedThread.riderPhoto}
                alt={selectedThread.riderName}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-neutral-600 flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {selectedThread.riderName[0]}
                </span>
              </div>
            )}
            <h3 className="font-medium text-white">{selectedThread.riderName}</h3>
          </div>
        </div>
        <DriverChat rideId={selectedThread.rideId} riderId={selectedThread.riderId} />
      </div>
    );
  }

  if (chatThreads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <MessageCircle className="w-16 h-16 text-[#C69249] mb-4" />
        <p className="text-center text-neutral-400">
          No messages yet. Your conversations with riders will appear here.
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
            {thread.riderPhoto ? (
              <img
                src={thread.riderPhoto}
                alt={thread.riderName}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-neutral-600 flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {thread.riderName[0]}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-medium text-white">{thread.riderName}</h3>
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

export default DriverMessagesList;
