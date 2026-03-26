import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';
import { BsCalendar, BsChatDots, BsPeople, BsCar } from 'react-icons/bs';
import { QRCodeSVG } from 'qrcode.react';
import styled, { keyframes } from 'styled-components';
import {
  PageContainer,
  Header,
  Logo,
  Title,
  IconButton,
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
  position: relative;
  z-index: 2;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const rotateIn = keyframes`
  from {
    transform: rotate(-180deg) scale(0);
    opacity: 0;
  }
  to {
    transform: rotate(0) scale(1);
    opacity: 1;
  }
`;

const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(244, 163, 64, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(244, 163, 64, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(244, 163, 64, 0);
  }
`;

const ActionButtonsCircle = styled.div`
  position: relative;
  width: 280px;
  height: 280px;
  margin: -60px 0 20px;
  animation: ${rotateIn} 0.6s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border: 2px dashed ${props => props.theme.colors?.primary || '#F4A340'};
    border-radius: 50%;
    opacity: 0.5;
    animation: ${rotateIn} 0.8s ease-out;
  }
`;

const CircleButton = styled(IconButton)<{ position: string; delay: number }>`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.colors?.primary || '#F4A340'};
  background: ${props => props.theme.colors?.background || '#000000'};
  opacity: 0;
  animation: ${rotateIn} 0.5s ease-out forwards;
  animation-delay: ${props => props.delay}s;
  
  ${props => {
    switch (props.position) {
      case 'top':
        return 'top: 0; left: 50%; transform: translateX(-50%);';
      case 'right':
        return 'right: 0; top: 50%; transform: translateY(-50%);';
      case 'bottom':
        return 'bottom: 0; left: 50%; transform: translateX(-50%);';
      case 'left':
        return 'left: 0; top: 50%; transform: translateY(-50%);';
      default:
        return '';
    }
  }}
  
  &:hover {
    background: ${props => props.theme.colors?.primary + '20' || '#F4A34020'};
    animation: ${pulseGlow} 1.5s infinite;
  }
  
  svg {
    width: 30px;
    height: 30px;
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
    margin: 5px 0;
  }
`;

const QRCodeContainer = styled.div`
  background: white;
  padding: 15px;
  border-radius: 10px;
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

const DriverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const driverInfo = {
    name: 'KEITH SCHMIEDLIN',
    id: 'PITT DRIVER 1',
    vehicle: '2023 KIA SORENTO (SILVER)',
    licenseId: 'LCV1414',
    qrCode: 'KEITH.CBL.MOBI'
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

      <Title>DRIVER</Title>
      <Title style={{ fontSize: '1.2rem' }}>DASHBOARD</Title>

      <DashboardContainer>
        <ProfileSection>
          <ProfileImage>
            <img src="/path/to/driver-image.jpg" alt="Driver" />
          </ProfileImage>

          <ActionButtonsCircle>
            <CircleButton position="top" delay={0.2} onClick={() => navigate('/schedule')}>
              <BsCalendar />
            </CircleButton>
            <CircleButton position="right" delay={0.4} onClick={() => navigate('/clients')}>
              <BsPeople />
            </CircleButton>
            <CircleButton position="bottom" delay={0.6} onClick={() => navigate('/rides')}>
              <BsCar />
            </CircleButton>
            <CircleButton position="left" delay={0.8} onClick={() => navigate('/messages')}>
              <BsChatDots />
            </CircleButton>
          </ActionButtonsCircle>

          <DriverInfo>
            <h2>{driverInfo.id}</h2>
            <h2>{driverInfo.name}</h2>
            <p>{driverInfo.vehicle} {driverInfo.licenseId}</p>
          </DriverInfo>

          <QRCodeContainer>
            <QRCodeSVG 
              value={driverInfo.qrCode}
              size={200}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/path/to/logo.png",
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </QRCodeContainer>
        </ProfileSection>
      </DashboardContainer>

      <BottomNav>
        <a href="/referrals">
          Referrals
        </a>
        <a href="/history">
          History
        </a>
        <a href="/settings">
          Settings
        </a>
      </BottomNav>
    </PageContainer>
  );
};

export default DriverDashboard;
