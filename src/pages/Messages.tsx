import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { collection, query, where, onSnapshot, addDoc, getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Send, ArrowLeft } from 'lucide-react';
import styled from 'styled-components';

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

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
`;

const ChatTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  
  .icon {
    width: 40px;
    height: 40px;
    background: #F4A340;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 24px;
      height: 24px;
      color: white;
    }
  }
  
  .text {
    h1 {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
      margin: 0;
    }
    h2 {
      font-size: 1rem;
      color: #999;
      margin: 0;
    }
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Message = styled.div<{ isUser?: boolean }>`
  max-width: 80%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  
  .header {
    color: #F4A340;
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 0.9rem;
  }
  
  .content {
    background: ${props => props.isUser ? '#333' : '#222'};
    padding: 12px 16px;
    border-radius: 12px;
    color: white;
    font-size: 0.95rem;
    line-height: 1.4;
  }
  
  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 8px;
  }
`;

const InputArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #222;
  padding: 10px;
  border-radius: 25px;
  margin-top: auto;
  
  input {
    flex: 1;
    background: none;
    border: none;
    color: white;
    font-size: 0.95rem;
    padding: 8px;
    
    &::placeholder {
      color: #666;
    }
    
    &:focus {
      outline: none;
    }
  }
  
  button {
    background: none;
    border: none;
    color: #666;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      color: #F4A340;
    }
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const BottomNav = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 15px 0;
  background: #111;
  border-top: 1px solid #222;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  
  a {
    color: #666;
    text-decoration: none;
    font-size: 0.8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    
    &.active {
      color: #F4A340;
    }
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

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
    <ChatContainer>
      <ChatTitle>
        <div className="icon">
          <ArrowLeft className="w-6 h-6" />
        </div>
        <div className="text">
          <h1>{contactName || 'Customer'}</h1>
          <h2>MESSAGE YOUR DRIVER</h2>
        </div>
      </ChatTitle>

      <MessagesContainer>
        {messages.map(message => (
          <Message 
            key={message.id} 
            isUser={message.senderId === rider?.id}
          >
            <div className="header">{message.senderId === rider?.id ? 'You' : contactName}</div>
            <div className="content">{message.content}</div>
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputArea>
        <button>
          <IoAttach />
        </button>
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
        />
        <button>
          <Send className="w-6 h-6" />
        </button>
      </InputArea>
    </ChatContainer>
  );
}

export default Messages;
