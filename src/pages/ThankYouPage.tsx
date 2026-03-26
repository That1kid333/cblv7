import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';
import styled from 'styled-components';
import {
  PageContainer,
  Header,
  Logo,
  Title,
  Button,
  MembershipSeal,
  IconButton
} from '../styles/shared';

const DiscountVoucher = styled.div`
  background: #E6F7FF;
  padding: 20px;
  border-radius: 10px;
  margin: 30px auto;
  max-width: 300px;
  width: 100%;
  text-align: center;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: #000;
    border-radius: 50%;
    top: 50%;
    transform: translateY(-50%);
  }
  
  &::before {
    left: -10px;
  }
  
  &::after {
    right: -10px;
  }
  
  .percentage {
    font-size: 3rem;
    font-weight: bold;
    color: #000;
    line-height: 1;
    margin: 10px 0;
  }
  
  .text {
    font-size: 0.8rem;
    color: #666;
    text-transform: uppercase;
  }
`;

const ThankYouText = styled.p`
  text-align: center;
  color: #999;
  font-size: 0.9rem;
  margin: 20px 0;
  line-height: 1.4;
  max-width: 300px;
  margin: 20px auto;
`;

const DriverButton = styled(Button)`
  background: transparent;
  border: 2px solid ${props => props.theme.colors?.primary || '#F4A340'};
  color: ${props => props.theme.colors?.primary || '#F4A340'};
  margin-top: 20px;
  
  &:hover {
    background: ${props => props.theme.colors?.primary || '#F4A340'}20;
  }
`;

const DriverText = styled.p`
  text-align: center;
  color: #666;
  font-size: 0.8rem;
  margin-top: 10px;
`;

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();

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

      <Title>THANKS!</Title>
      <Title style={{ color: '#F4A340', fontSize: '1.2rem' }}>
        FOR BECOMING A MEMBER
      </Title>

      <DiscountVoucher>
        <div className="text">CITYBUCKETLIST.COM</div>
        <div className="percentage">10%</div>
        <div className="text">OFF NEXT RIDE</div>
        <div className="text">RIDE-SHARES</div>
        <div className="text" style={{ marginTop: '10px' }}>
          10% CREDIT TOWARDS YOUR NEXT RIDE
        </div>
      </DiscountVoucher>

      <ThankYouText>
        AS A THANK YOU FOR SIGNING UP AS A MEMBER,
        YOU CAN USE THIS 10% CREDIT TOWARDS YOUR
        NEXT SCHEDULED RIDE.
      </ThankYouText>

      <Button onClick={() => navigate('/schedule')}>
        SCHEDULE A RIDE
      </Button>

      <DriverButton onClick={() => navigate('/driver/signup')}>
        DRIVER SIGNUP
      </DriverButton>

      <DriverText>
        DRIVER (INDEPENDENT CONTRACTOR), SIGN-UP HERE
      </DriverText>

      <MembershipSeal 
        src="/membership-seal.png" 
        alt="PMA Membership Seal" 
        style={{ marginTop: 'auto', width: '100px', height: '100px' }}
      />
    </PageContainer>
  );
};

export default ThankYouPage;