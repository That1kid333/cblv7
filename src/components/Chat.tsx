import { useState, useEffect, useRef } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: any;
  senderName?: string;
}

interface ChatProps {
  rideId: string;
  driverId: string;
}

export function Chat({ rideId, driverId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { rider } = useAuth();

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    
    try {
      // Handle Firestore Timestamp
      if (timestamp?.toDate) {
        return timestamp.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      }
      // Handle string timestamp
      return new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid Date';
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!rideId) return;

      try {
        const messagesRef = collection(db, 'messages');
        const q = query(
          messagesRef,
          where('rideId', '==', rideId),
          orderBy('timestamp', 'desc') // Change to descending order
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedMessages = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              content: data.content,
              senderId: data.senderId,
              timestamp: data.timestamp,
              senderName: data.senderName
            } as Message;
          });
          
          // Sort messages by timestamp in ascending order for display
          const sortedMessages = fetchedMessages.sort((a, b) => {
            const timeA = a.timestamp?.seconds || (new Date(a.timestamp).getTime() / 1000);
            const timeB = b.timestamp?.seconds || (new Date(b.timestamp).getTime() / 1000);
            return timeA - timeB;
          });
          
          setMessages(sortedMessages);
          // Scroll to bottom after messages update
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [rideId]);

  const handleTyping = () => {
    setIsTyping(true);
    // Emit typing event to other users
    // Use a debounce to reset typing status after a delay
    setTimeout(() => setIsTyping(false), 3000);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !rideId || !rider?.id) return;

    try {
      const messagesRef = collection(db, 'messages');
      await addDoc(messagesRef, {
        content: newMessage.trim(),
        senderId: rider.id,
        rideId,
        timestamp: serverTimestamp(),
        senderName: rider.name,
        participants: [rider.id, driverId]
      });

      setNewMessage('');
      // Scroll to bottom immediately after sending
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C69249]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-280px)]">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-neutral-700 bg-neutral-800">
        <button
          onClick={() => window.history.back()}
          className="text-neutral-400 hover:text-white mr-4"
        >
          ← Back
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-medium">Chat</h2>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-900">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === rider?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.senderId === rider?.id
                  ? 'bg-[#C69249] text-white'
                  : 'bg-neutral-700 text-white'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-75 mt-1">
                {formatTimestamp(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        {isTyping && <div className="text-sm opacity-75">User is typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 bg-neutral-800 border-t border-neutral-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 bg-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C69249] placeholder-neutral-400"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-[#C69249] text-white rounded-lg px-6 py-3 hover:bg-[#B58239] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
