import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';

interface Message {
  id: string;
  senderId: string;
  senderType: 'driver' | 'rider';
  content: string;
  timestamp: string;
  read: boolean;
}

interface Chat {
  id: string;
  riderId: string;
  riderName: string;
  riderPhoto: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

interface CommunicationHubProps {
  driverId?: string;
}

export function CommunicationHub({ driverId }: CommunicationHubProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentDriver = JSON.parse(localStorage.getItem('currentDriver') || '{}');
    const rides = JSON.parse(localStorage.getItem(`driver_${driverId || currentDriver.id}_rides`) || '[]');
    
    const loadedChats: Chat[] = rides.map((ride: any) => ({
      id: ride.id,
      riderId: ride.customerId,
      riderName: ride.customerName || 'Unknown Rider',
      riderPhoto: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
      lastMessage: ride.messages?.[ride.messages.length - 1]?.content || 'No messages yet',
      lastMessageTime: ride.messages?.[ride.messages.length - 1]?.timestamp || ride.created_at,
      unreadCount: ride.messages?.filter((m: Message) => !m.read && m.senderType === 'rider').length || 0,
      messages: ride.messages || []
    }));

    setChats(loadedChats);
  }, [driverId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: 'driver',
        senderType: 'driver',
        content: message,
        timestamp: new Date().toISOString(),
        read: true
      };
      const updatedChats = chats.map(chat =>
        chat.id === selectedChat.id
          ? { ...chat, messages: [...chat.messages, newMessage], lastMessage: newMessage.content, lastMessageTime: newMessage.timestamp }
          : chat
      );
      setChats(updatedChats);
      setMessage('');
    }
  };

  return (
    <div className="flex h-full">
      <aside className="w-1/3 bg-neutral-800 p-4">
        <input
          type="text"
          placeholder="Search riders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 rounded-lg bg-neutral-700 text-white placeholder-neutral-400"
        />
        <ul className="space-y-2">
          {chats.filter(chat => chat.riderName.toLowerCase().includes(searchTerm.toLowerCase())).map(chat => (
            <li key={chat.id} onClick={() => setSelectedChat(chat)} className={`p-2 rounded-lg cursor-pointer ${selectedChat?.id === chat.id ? 'bg-neutral-700' : 'bg-neutral-900'} hover:bg-neutral-700 transition-colors`}>
              <div className="flex items-center">
                <img src={chat.riderPhoto} alt={chat.riderName} className="w-10 h-10 rounded-full mr-2" />
                <div>
                  <h4 className="text-white font-semibold">{chat.riderName}</h4>
                  <p className="text-neutral-400 text-sm">{chat.lastMessage}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 bg-neutral-900 p-4 flex flex-col">
        {selectedChat ? (
          <>
            <div className="flex-1 overflow-y-auto">
              {selectedChat.messages.map(msg => (
                <div key={msg.id} className={`p-2 rounded-lg mb-2 ${msg.senderType === 'driver' ? 'bg-[#C69249] text-white self-end' : 'bg-neutral-700 text-white self-start'}`}>
                  <p>{msg.content}</p>
                  <span className="text-xs text-neutral-400">{format(new Date(msg.timestamp), 'p')}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="mt-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full p-2 rounded-lg bg-neutral-800 text-white placeholder-neutral-400"
              />
              <button onClick={handleSendMessage} className="mt-2 px-4 py-2 bg-[#C69249] text-white rounded-lg">Send</button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-400">
            Select a chat to start messaging
          </div>
        )}
      </main>
    </div>
  );
}