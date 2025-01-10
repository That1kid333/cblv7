import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'driver' | 'rider';
  timestamp: string;
}

interface DriverChatBoxProps {
  ride: {
    id: string;
    customerName: string;
  };
  onClose: () => void;
}

export function DriverChatBox({ ride, onClose }: DriverChatBoxProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentDriver = JSON.parse(localStorage.getItem('currentDriver') || '{}');

  useEffect(() => {
    // Load existing messages
    const allRides = JSON.parse(localStorage.getItem('pendingRides') || '[]');
    const thisRide = allRides.find((r: any) => r.id === ride.id);
    if (thisRide?.messages) {
      setMessages(thisRide.messages);
    }

    // Set up storage event listener
    const handleStorageChange = () => {
      const updatedRides = JSON.parse(localStorage.getItem('pendingRides') || '[]');
      const updatedRide = updatedRides.find((r: any) => r.id === ride.id);
      if (updatedRide?.messages) {
        setMessages(updatedRide.messages);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [ride.id]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      sender: 'driver',
      timestamp: new Date().toLocaleTimeString()
    };

    // Update messages in state
    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Update messages in localStorage
    const allRides = JSON.parse(localStorage.getItem('pendingRides') || '[]');
    const updatedRides = allRides.map((r: any) => {
      if (r.id === ride.id) {
        return {
          ...r,
          messages: [...(r.messages || []), newMessage]
        };
      }
      return r;
    });
    localStorage.setItem('pendingRides', JSON.stringify(updatedRides));

    // Update driver's rides
    const driverRides = JSON.parse(localStorage.getItem(`driver_${currentDriver.id}_rides`) || '[]');
    const updatedDriverRides = driverRides.map((r: any) => {
      if (r.id === ride.id) {
        return {
          ...r,
          messages: [...(r.messages || []), newMessage]
        };
      }
      return r;
    });
    localStorage.setItem(`driver_${currentDriver.id}_rides`, JSON.stringify(updatedDriverRides));

    // Trigger storage event
    window.dispatchEvent(new Event('storage'));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="font-semibold text-white">Chat with {ride.customerName}</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="h-96 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'driver' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender === 'driver'
                    ? 'bg-[#F5A623] text-white'
                    : 'bg-neutral-800 text-white'
                }`}
              >
                <div className="text-sm">{msg.text}</div>
                <div className="text-xs opacity-75 mt-1">{msg.timestamp}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-neutral-800">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent text-white placeholder-neutral-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#F5A623] text-white rounded-lg hover:bg-[#E09612] transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}