import React, { useState, useEffect, useRef } from 'react';
import { FaInstagram } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';
import { BsMic, BsChatDots } from 'react-icons/bs';
import { IoAttach } from 'react-icons/io5';
import styled from 'styled-components';
import {
  PageContainer,
  Header,
  Logo,
  IconButton
} from '../styles/shared';

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
    background: ${props => props.theme.colors?.primary || '#F4A340'};
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
  background: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
`;

const Message = styled.div<{ isDriver?: boolean }>`
  max-width: 80%;
  align-self: ${props => props.isDriver ? 'flex-start' : 'flex-end'};
  display: flex;
  gap: 10px;
  
  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .message-content {
    .header {
      color: ${props => props.theme.colors?.primary || '#F4A340'};
      font-weight: bold;
      margin-bottom: 5px;
      font-size: 0.9rem;
    }
    
    .content {
      background: ${props => props.isDriver ? '#333' : '#222'};
      padding: 12px 16px;
      border-radius: 12px;
      color: white;
      font-size: 0.95rem;
      line-height: 1.4;
    }
  }
`;

const InputArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 8px 15px;
  border-radius: 25px;
  margin-top: auto;
  
  input {
    flex: 1;
    background: none;
    border: none;
    color: #333;
    font-size: 0.95rem;
    padding: 8px;
    
    &::placeholder {
      color: #999;
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
      color: ${props => props.theme.colors?.primary || '#F4A340'};
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
      color: ${props => props.theme.colors?.primary || '#F4A340'};
    }
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isDriver: boolean;
  avatar?: string;
}

const DriverMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'KEITH SCHMIEDLIN',
      content: 'Good morning Joe and I did see that. I\'ll keep an eye on it.',
      timestamp: new Date(),
      isDriver: true,
      avatar: '/path/to/keith-avatar.jpg'
    },
    {
      id: '2',
      sender: 'JOE SMO',
      content: 'Flight just landed. I\'ll be about 25 min. Text you when I get my bags and heading to door 4.',
      timestamp: new Date(),
      isDriver: false
    },
    {
      id: '3',
      sender: 'KEITH SCHMIEDLIN',
      content: 'Sounds good my friend. See you shortly.',
      timestamp: new Date(),
      isDriver: true,
      avatar: '/path/to/keith-avatar.jpg'
    },
    {
      id: '4',
      sender: 'JOE SMO',
      content: 'Looking forward to the ride.',
      timestamp: new Date(),
      isDriver: false
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      sender: 'KEITH SCHMIEDLIN',
      content: newMessage,
      timestamp: new Date(),
      isDriver: true,
      avatar: '/path/to/keith-avatar.jpg'
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <PageContainer>
      <Header>
        <IconButton onClick={() => window.open('https://instagram.com', '_blank')}>
          <FaInstagram />
        </IconButton>
        <Logo>CITYBUCKETLIST.COM</Logo>
        <IconButton>
          <RxHamburgerMenu />
        </IconButton>
      </Header>

      <ChatContainer>
        <ChatTitle>
          <div className="icon">
            <BsChatDots />
          </div>
          <div className="text">
            <h1>DRIVER</h1>
            <h2>MESSAGE YOUR RIDER</h2>
          </div>
        </ChatTitle>

        <MessagesContainer>
          {messages.map(message => (
            <Message 
              key={message.id} 
              isDriver={message.isDriver}
            >
              {message.avatar && (
                <div className="avatar">
                  <img src={message.avatar} alt={message.sender} />
                </div>
              )}
              <div className="message-content">
                <div className="header">{message.sender}</div>
                <div className="content">{message.content}</div>
              </div>
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
            onKeyPress={e => e.key === 'Enter' && handleSend()}
          />
          <button>
            <BsMic />
          </button>
        </InputArea>
      </ChatContainer>

      <BottomNav>
        <a href="/history">
          History
        </a>
        <a href="/schedule">
          Schedule
        </a>
        <a href="/messages" className="active">
          Messages
        </a>
        <a href="/settings">
          Settings
        </a>
      </BottomNav>
    </PageContainer>
  );
};

export default DriverMessages;
