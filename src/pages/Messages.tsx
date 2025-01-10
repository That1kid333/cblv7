import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { collection, query, where, onSnapshot, addDoc, getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Send, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  read: boolean;
  participants: string[];
  rideId?: string;
}

export function Messages() {
  const { contactId } = useParams<{ contactId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { rider } = useAuth();
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const rideId = new URLSearchParams(location.search).get('rideId');
  const [contactName, setContactName] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch contact name
    const fetchContactName = async () => {
      if (!contactId) return;
      try {
        const userDoc = await getDoc(doc(db, 'riders', contactId));
        if (userDoc.exists()) {
          setContactName(userDoc.data().name || 'Customer');
        }
      } catch (error) {
        console.error('Error fetching contact name:', error);
      }
    };
    fetchContactName();
  }, [contactId]);

  useEffect(() => {
    if (!contactId || !rider?.id) return;

    let messagesQuery;

    if (rideId) {
      // If rideId is present, fetch messages for specific ride
      messagesQuery = query(
        collection(db, 'messages'),
        where('rideId', '==', rideId),
        where('senderId', 'in', [rider.id, contactId]),
        where('receiverId', 'in', [rider.id, contactId])
      );
    } else {
      // Otherwise fetch all messages between these users
      const q1 = query(
        collection(db, 'messages'),
        where('senderId', '==', rider.id),
        where('receiverId', '==', contactId)
      );

      const q2 = query(
        collection(db, 'messages'),
        where('senderId', '==', contactId),
        where('receiverId', '==', rider.id)
      );

      // Listen to both queries
      const unsubscribe1 = onSnapshot(q1, (snapshot) => {
        const messagesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Message));
        updateMessages(messagesList);
      });

      const unsubscribe2 = onSnapshot(q2, (snapshot) => {
        const messagesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Message));
        updateMessages(messagesList);
      });

      return () => {
        unsubscribe1();
        unsubscribe2();
      };
    }

    // For ride-specific messages
    if (rideId) {
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messagesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Message));
        setMessages(messagesList.sort((a, b) => {
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          return timeA - timeB;
        }));
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [contactId, rider?.id, rideId]);

  const updateMessages = (newMessages: Message[]) => {
    setMessages(current => {
      const messageMap = new Map(current.map(msg => [msg.id, msg]));
      newMessages.forEach(msg => messageMap.set(msg.id, msg));
      return Array.from(messageMap.values())
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    });
    setLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !rider?.id || !contactId) return;

    try {
      console.log('Sending message with data:', {
        content: newMessage.trim(),
        senderId: rider.id,
        receiverId: contactId,
        timestamp: new Date().toISOString(),
        read: false,
        participants: [rider.id, contactId],
        ...(rideId ? { rideId } : {})
      });

      await addDoc(collection(db, 'messages'), {
        content: newMessage.trim(),
        senderId: rider.id,
        receiverId: contactId,
        timestamp: new Date().toISOString(),
        read: false,
        participants: [rider.id, contactId],
        ...(rideId ? { rideId } : {})
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C69249]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-neutral-900 p-4 flex items-center space-x-4">
        <Link to="/rider/portal" className="text-[#C69249] hover:text-[#B58239]">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-semibold">Messages</h1>
      </div>

      <div className="p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-neutral-900 rounded-lg shadow-lg h-[calc(100vh-8rem)]">
            {/* Messages Container */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Link to="/rides" className="p-2 hover:bg-neutral-700 rounded-full">
                  <ArrowLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-xl font-semibold">{contactName || 'Customer'}</h2>
              </div>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === rider?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.senderId === rider?.id
                        ? 'bg-[#C69249] text-white'
                        : 'bg-neutral-800 text-neutral-100'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="h-20 border-t border-neutral-800 p-4 flex items-center gap-4"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-neutral-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C69249]"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-[#C69249] text-white p-2 rounded-lg hover:bg-[#B58239] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
