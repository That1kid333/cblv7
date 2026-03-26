import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';
import { BsCalendar, BsChatDots } from 'react-icons/bs';
import styled from 'styled-components';
import {
  PageContainer,
  Header,
  Logo,
  Title,
  IconButton,
  CircleButton
} from '../styles/shared';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  width: 100%;
  max-width: 600px;
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid ${props => props.theme.colors?.primary || '#F4A340'};
  overflow: hidden;
  margin: 20px 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DriverInfo = styled.div`
  text-align: center;
  margin: 20px 0;
  
  h2 {
    color: ${props => props.theme.colors?.primary || '#F4A340'};
    font-size: 1.5rem;
    margin: 10px 0;
  }
  
  p {
    color: ${props => props.theme.colors?.textSecondary || '#999999'};
    font-size: 0.9rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
`;

const BottomNav = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 15px 0;
  background: ${props => props.theme.colors?.surface || '#222222'};
  border-top: 1px solid ${props => props.theme.colors?.border || '#333333'};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  
  a {
    color: ${props => props.theme.colors?.textSecondary || '#999999'};
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

const RiderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const driverInfo = {
    name: 'KEITH SCHMIEDLIN',
    vehicle: '2023 KIA SORENTO (SILVER)',
    id: 'LCV1414'
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

      <Title>RIDER</Title>
      <Title style={{ fontSize: '1.2rem' }}>DASHBOARD</Title>

      <DashboardContainer>
        <ProfileSection>
          <ProfileImage>
            <img src="/path/to/driver-image.jpg" alt="Driver" />
          </ProfileImage>

          <DriverInfo>
            <p>YOUR PREFERED INDEPENDENT</p>
            <p>CONTRACTOR/DRIVER</p>
            <h2>{driverInfo.name}</h2>
            <p>{driverInfo.vehicle}</p>
            <p>{driverInfo.id}</p>
            <p>DRIVER REFERAL LINK</p>
          </DriverInfo>

          <ActionButtons>
            <CircleButton onClick={() => navigate('/schedule')}>
              <BsCalendar />
            </CircleButton>
            <CircleButton onClick={() => navigate('/messages')}>
              <BsChatDots />
            </CircleButton>
          </ActionButtons>
        </ProfileSection>
      </DashboardContainer>

      <BottomNav>
        <a href="/drivers">
          Drivers
        </a>
        <a href="/history">
          History
        </a>
        <a href="/referrals">
          Referrals
        </a>
        <a href="/settings">
          Settings
        </a>
      </BottomNav>
    </PageContainer>
  );
};

export default RiderDashboard;
