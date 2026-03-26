import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';
import { BsPeople, BsCalendar, BsPhone, BsEnvelope, BsHouse } from 'react-icons/bs';
import { QRCodeSVG } from 'qrcode.react';
import styled from 'styled-components';
import {
  PageContainer,
  Header,
  Logo,
  Title,
  IconButton
} from '../styles/shared';

const ClientsContainer = styled.div`
  flex: 1;
  display: flex;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  position: relative;
`;

const AlphabetList = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.7rem;
  color: ${props => props.theme.colors?.textSecondary || '#999'};
  
  .letter {
    padding: 2px 4px;
    cursor: pointer;
    
    &.active {
      color: ${props => props.theme.colors?.primary || '#F4A340'};
      font-weight: bold;
    }
  }
`;

const ClientCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  margin-right: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .search {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #666;
      
      svg {
        width: 20px;
        height: 20px;
      }
    }
    
    .actions {
      display: flex;
      gap: 10px;
      
      button {
        background: none;
        border: none;
        padding: 5px;
        cursor: pointer;
        color: #666;
        
        svg {
          width: 20px;
          height: 20px;
        }
        
        &:hover {
          color: ${props => props.theme.colors?.primary || '#F4A340'};
        }
      }
    }
  }
  
  .title {
    color: #333;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .subtitle {
    color: #666;
    font-size: 0.8rem;
    margin-bottom: 20px;
  }
`;

const QRSection = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
  
  .info-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #666;
    font-size: 0.9rem;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const NotesSection = styled.div`
  background: #fafad2;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  
  .notes-header {
    color: #666;
    font-size: 0.9rem;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .notes-content {
    color: #333;
    font-size: 0.9rem;
    line-height: 1.4;
  }
  
  .note-line {
    position: relative;
    padding-left: 20px;
    margin-bottom: 8px;
    
    &::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 8px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #666;
    }
  }
`;

const Clients: React.FC = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const clientInfo = {
    name: 'Brian Uhler',
    title: 'CO-FOUNDER OF CBL',
    phone: '(724) 216-2672',
    email: 'BUHLER@CBL.MOBI',
    address: '107 HILLENDALE RD. PITTSBURGH, PA. 15237',
    notes: ['Brian Pays $80 Cash to Airport']
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

      <Title style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <BsPeople size={24} />
        CLIENTS
      </Title>

      <ClientsContainer>
        <ClientCard>
          <div className="header">
            <div className="search">
              RIDES / DELIVERIES
            </div>
            <div className="actions">
              <button>
                <BsCalendar />
              </button>
            </div>
          </div>

          <div className="title">{clientInfo.name}</div>
          <div className="subtitle">{clientInfo.title}</div>

          <QRSection>
            <QRCodeSVG 
              value="https://example.com/referral"
              size={150}
              level="H"
              includeMargin={true}
            />
          </QRSection>

          <ContactInfo>
            <div className="info-item">
              <BsPhone />
              {clientInfo.phone}
            </div>
            <div className="info-item">
              <BsEnvelope />
              {clientInfo.email}
            </div>
            <div className="info-item">
              <BsHouse />
              {clientInfo.address}
            </div>
          </ContactInfo>

          <NotesSection>
            <div className="notes-header">NOTES:</div>
            <div className="notes-content">
              {clientInfo.notes.map((note, index) => (
                <div key={index} className="note-line">
                  {note}
                </div>
              ))}
            </div>
          </NotesSection>
        </ClientCard>

        <AlphabetList>
          {alphabet.map((letter, index) => (
            <div 
              key={letter} 
              className={`letter ${letter === 'B' ? 'active' : ''}`}
            >
              {letter}
            </div>
          ))}
        </AlphabetList>
      </ClientsContainer>
    </PageContainer>
  );
};

export default Clients;
