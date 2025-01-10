import React, { useState, useEffect, useRef } from 'react';
import { addDoc, collection, query, where, orderBy, getDocs, doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  conversationId: string;
  participants: string[];
  senderName?: string;
  senderPhoto?: string;
}

interface ChatThread {
  driverId: string;
  driverName: string;
  driverPhoto: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  conversationId: string;
  rideId: string;
}

interface Driver {
  id: string;
  name: string;
  photo?: string;
  isOnline: boolean;
}

export function ChatHistory() {
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [onlineDrivers, setOnlineDrivers] = useState<Driver[]>([]);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchChatThreads = async () => {
      if (!currentUser) return;

      try {
        // First, get all rides where the user is the rider
        const ridesQuery = query(
          collection(db, 'rides'),
          where('riderId', '==', currentUser.uid),
          where('status', 'in', ['accepted', 'in_progress', 'completed'])
        );

        const ridesSnapshot = await getDocs(ridesQuery);
        const rides = ridesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Create a map of driver IDs to ride IDs
        const driverRideMap = new Map(
          rides.map(ride => [ride.driverId, ride.id])
        );

        // Get messages only for booked drivers
        const driverIds = Array.from(driverRideMap.keys());
        if (driverIds.length === 0) {
          setChatThreads([]);
          setIsLoading(false);
          return;
        }

        const messagesQuery = query(
          collection(db, 'messages'),
          where('participants', 'array-contains', currentUser.uid),
          orderBy('timestamp', 'desc')
        );

        const querySnapshot = await getDocs(messagesQuery);
        const messages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Group messages by driver and create chat threads
        const threads = new Map<string, ChatThread>();
        
        for (const message of messages) {
          const driverId = message.senderId === currentUser.uid 
            ? message.receiverId 
            : message.senderId;

          // Only create thread if driver is in driverRideMap
          if (driverRideMap.has(driverId) && !threads.has(driverId)) {
            try {
              const driverDocRef = doc(db, 'drivers', driverId);
              const driverSnap = await getDoc(driverDocRef);
              
              if (driverSnap.exists()) {
                const driverData = driverSnap.data();
                threads.set(driverId, {
                  driverId,
                  driverName: driverData?.name || 'Unknown Driver',
                  driverPhoto: driverData?.photo || '',
                  lastMessage: message.text,
                  lastMessageTime: message.timestamp,
                  unreadCount: message.senderId !== currentUser.uid && !message.read ? 1 : 0,
                  conversationId: message.conversationId,
                  rideId: driverRideMap.get(driverId)!
                });
              }
            } catch (error) {
              console.error(`Error fetching driver ${driverId}:`, error);
            }
          }
        }

        setChatThreads(Array.from(threads.values()));
      } catch (error) {
        console.error('Error fetching chat threads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchChatThreads();
    }
  }, [currentUser]);

  useEffect(() => {
    if (!selectedThread || !currentUser) return;

    const conversationId = [currentUser.uid, selectedThread].sort().join('_');

    const messagesQuery = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
      const newMessages: Message[] = [];
      
      for (const doc of snapshot.docs) {
        const messageData = doc.data();
        const senderId = messageData.senderId;
        
        // Get sender info
        let senderName = '';
        let senderPhoto = '';
        
        if (senderId === currentUser.uid) {
          const userDoc = await getDoc(doc(db, 'riders', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            senderName = userData.name || 'You';
            senderPhoto = userData.photo || '';
          } else {
            senderName = 'You';
          }
        } else {
          const driverDoc = await getDoc(doc(db, 'drivers', senderId));
          if (driverDoc.exists()) {
            const driverData = driverDoc.data();
            senderName = driverData.name;
            senderPhoto = driverData.photo;
          }
        }
        
        newMessages.push({
          id: doc.id,
          ...messageData,
          senderName,
          senderPhoto
        } as Message);
      }
      
      setMessages(newMessages);
    }, (error) => {
      console.error('Error fetching messages:', error);
    });

    return () => unsubscribe();
  }, [selectedThread, currentUser]);

  const handleSendMessage = async () => {
    if (!selectedThread || !newMessage.trim() || !currentUser) return;

    try {
      const conversationId = [currentUser.uid, selectedThread].sort().join('_');
      
      const messageData = {
        senderId: currentUser.uid,
        receiverId: selectedThread,
        text: newMessage.trim(),
        timestamp: new Date().toISOString(),
        read: false,
        conversationId,
        participants: [currentUser.uid, selectedThread]
      };

      await addDoc(collection(db, 'messages'), messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C69249]"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-400">Please sign in to view your messages.</p>
      </div>
    );
  }

  if (chatThreads.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-400 mb-4">No messages yet.</p>
        <p className="text-sm text-gray-500">
          Book a ride to start chatting with your driver.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Chat threads list */}
      <div className="w-1/3 border-r border-neutral-800 overflow-y-auto">
        {chatThreads.map((thread) => (
          <div
            key={thread.driverId}
            onClick={() => setSelectedThread(thread.driverId)}
            className={`p-4 cursor-pointer hover:bg-neutral-800 ${
              selectedThread === thread.driverId ? 'bg-neutral-800' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={thread.driverPhoto || '/default-avatar.png'}
                  alt={thread.driverName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {onlineDrivers.some(d => d.id === thread.driverId) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium truncate">{thread.driverName}</h3>
                  <span className="text-xs text-neutral-400">
                    {new Date(thread.lastMessageTime).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-neutral-400 truncate">{thread.lastMessage}</p>
              </div>
              {thread.unreadCount > 0 && (
                <div className="ml-2 bg-[#C69249] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {thread.unreadCount}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Messages area */}
      <div className="flex-1 flex flex-col">
        {selectedThread ? (
          <>
            {/* Messages list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.senderId !== currentUser?.uid && (
                    <img
                      src={message.senderPhoto || '/default-avatar.png'}
                      alt={message.senderName}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.senderId === currentUser?.uid
                        ? 'bg-[#C69249] text-white ml-2'
                        : 'bg-neutral-800 text-white'
                    }`}
                  >
                    <div className="text-xs opacity-70 mb-1">
                      {message.senderName}
                    </div>
                    <p>{message.text}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  {message.senderId === currentUser?.uid && (
                    <img
                      src={message.senderPhoto || '/default-avatar.png'}
                      alt={message.senderName}
                      className="w-8 h-8 rounded-full ml-2"
                    />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-neutral-800">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-neutral-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C69249]"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-[#C69249] text-white rounded-lg hover:bg-[#B58238] disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
