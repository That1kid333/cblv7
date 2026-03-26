import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaInstagram, FaCheckCircle } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';
import { BsCalendar, BsClock, BsGeoAlt, BsPerson, BsChatDots } from 'react-icons/bs';
import styled, { keyframes } from 'styled-components';
import { rideService } from '../lib/services/ride.service';
import { toast } from 'react-hot-toast';
import {
  PageContainer,
  Header,
  Logo,
  IconButton
} from '../styles/shared';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ConfirmationContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const SuccessIcon = styled.div`
  color: ${props => props.theme.colors?.primary || '#F4A340'};
  font-size: 64px;
  margin: 20px 0;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  font-size: 1.5rem;
  margin: 10px 0;
`;

const Subtitle = styled.h2`
  color: ${props => props.theme.colors?.textSecondary || '#999'};
  text-align: center;
  font-size: 1rem;
  margin-bottom: 30px;
`;

const Card = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
  animation: ${fadeIn} 0.6s ease-out;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #333;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  
  .icon {
    color: ${props => props.theme.colors?.primary || '#F4A340'};
    font-size: 20px;
  }
  
  .content {
    flex: 1;
    
    .label {
      color: ${props => props.theme.colors?.textSecondary || '#999'};
      font-size: 0.8rem;
      margin-bottom: 4px;
    }
    
    .value {
      color: white;
      font-size: 0.95rem;
    }
  }
`;

const DriverCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 15px;
  
  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid ${props => props.theme.colors?.primary || '#F4A340'};
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .info {
    flex: 1;
    
    .name {
      color: white;
      font-size: 1.1rem;
      margin-bottom: 4px;
    }
    
    .vehicle {
      color: ${props => props.theme.colors?.textSecondary || '#999'};
      font-size: 0.9rem;
    }
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 10px;
  
  ${props => props.variant === 'primary' ? `
    background: ${props.theme.colors?.primary || '#F4A340'};
    color: #000;
    
    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  ` : `
    background: transparent;
    border: 2px solid ${props.theme.colors?.primary || '#F4A340'};
    color: ${props.theme.colors?.primary || '#F4A340'};
    
    &:hover {
      background: ${props.theme.colors?.primary + '20' || '#F4A34020'};
    }
  `}
`;

interface RideDetails {
  id: string;
  riderId: string;
  driverId: string;
  pickup: string;
  dropoff: string;
  status: string;
  estimatedPickupTime: string;
  passengers: number;
  driver: {
    name: string;
    vehicle: string;
    photo: string;
  };
}

const RideConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { rideId } = useParams<{ rideId: string }>();
  const [loading, setLoading] = useState(true);
  const [rideDetails, setRideDetails] = useState<RideDetails | null>(null);
  const [rideStatus, setRideStatus] = useState<string>('');

  useEffect(() => {
    let unsubscribe: () => void;

    if (rideId) {
      unsubscribe = rideService.subscribeToRideStatus(rideId, (status) => {
        setRideStatus(status);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [rideId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4ade80';
      case 'pending':
        return '#fbbf24';
      case 'cancelled':
        return '#f87171';
      case 'active':
        return '#60a5fa';
      default:
        return '#fff';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Ride Completed';
      case 'pending':
        return 'Driver Assigned';
      case 'cancelled':
        return 'Ride Cancelled';
      case 'active':
        return 'In Progress';
      default:
        return 'Unknown Status';
    }
  };

  useEffect(() => {
    const fetchRideDetails = async () => {
      if (!rideId) {
        toast.error('Ride ID not found');
        navigate('/schedule');
        return;
      }

      try {
        const details = await rideService.getRideDetails(rideId);
        if (!details) {
          toast.error('Ride not found');
          navigate('/schedule');
          return;
        }
        setRideDetails(details);
      } catch (error) {
        console.error('Error fetching ride details:', error);
        toast.error('Failed to load ride details');
        navigate('/schedule');
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideId, navigate]);

  if (loading) {
    return (
      <PageContainer>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C69249]"></div>
        </div>
      </PageContainer>
    );
  }

  if (!rideDetails) {
    return null;
  }

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const { date, time } = formatDateTime(rideDetails.estimatedPickupTime);

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

      <ConfirmationContainer>
        <SuccessIcon style={{ color: getStatusColor(rideStatus) }}>
          <FaCheckCircle />
        </SuccessIcon>
        <Title>{getStatusText(rideStatus)}</Title>
        <Subtitle>
          {rideStatus === 'pending' && 'Your ride has been scheduled successfully'}
          {rideStatus === 'active' && 'Your driver is on the way'}
          {rideStatus === 'completed' && 'Thanks for riding with us!'}
          {rideStatus === 'cancelled' && 'This ride has been cancelled'}
        </Subtitle>

        <Card>
          <DetailRow>
            <div className="icon">
              <BsCalendar />
            </div>
            <div className="content">
              <div className="label">Date</div>
              <div className="value">{date}</div>
            </div>
          </DetailRow>
          <DetailRow>
            <div className="icon">
              <BsClock />
            </div>
            <div className="content">
              <div className="label">Time</div>
              <div className="value">{time}</div>
            </div>
          </DetailRow>
          <DetailRow>
            <div className="icon">
              <BsGeoAlt />
            </div>
            <div className="content">
              <div className="label">Pickup Location</div>
              <div className="value">{rideDetails.pickup}</div>
            </div>
          </DetailRow>
          <DetailRow>
            <div className="icon">
              <BsGeoAlt />
            </div>
            <div className="content">
              <div className="label">Dropoff Location</div>
              <div className="value">{rideDetails.dropoff}</div>
            </div>
          </DetailRow>
          <DetailRow>
            <div className="icon">
              <BsPerson />
            </div>
            <div className="content">
              <div className="label">Passengers</div>
              <div className="value">{rideDetails.passengers} Passengers</div>
            </div>
          </DetailRow>
        </Card>

        <DriverCard>
          <div className="avatar">
            <img src={rideDetails.driver.photo} alt={rideDetails.driver.name} />
          </div>
          <div className="info">
            <div className="name">{rideDetails.driver.name}</div>
            <div className="vehicle">{rideDetails.driver.vehicle}</div>
          </div>
        </DriverCard>

        <Button 
          variant="primary" 
          onClick={() => navigate(`/messages/${rideDetails.driverId}`)}
        >
          <BsChatDots style={{ marginRight: '8px' }} />
          MESSAGE DRIVER
        </Button>
        <Button variant="secondary" onClick={() => navigate('/schedule')}>
          SCHEDULE ANOTHER RIDE
        </Button>
      </ConfirmationContainer>
    </PageContainer>
  );
};

export default RideConfirmation;
