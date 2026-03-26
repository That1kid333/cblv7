import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';
import { BsCalendar, BsClock, BsArrowRight, BsChevronRight } from 'react-icons/bs';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { rideService } from '../lib/services/ride.service';
import { toast } from 'react-hot-toast';
import {
  PageContainer,
  Header,
  Logo,
  Title,
  IconButton
} from '../styles/shared';

const HistoryContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ active?: boolean }>`
  flex: 1;
  padding: 12px;
  background: ${props => props.active ? props.theme.colors?.primary : '#1a1a1a'};
  border: 1px solid ${props => props.active ? props.theme.colors?.primary : '#333'};
  border-radius: 8px;
  color: ${props => props.active ? '#000' : '#fff'};
  font-size: 0.9rem;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? props.theme.colors?.primary : props.theme.colors?.primary + '20'};
  }
`;

const RideCard = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const RideHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  
  .date {
    color: ${props => props.theme.colors?.primary};
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .status {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: uppercase;
    
    &.completed {
      background: #1a472a;
      color: #4ade80;
    }
    
    &.pending {
      background: #854d0e;
      color: #fbbf24;
    }
    
    &.cancelled {
      background: #7f1d1d;
      color: #f87171;
    }
    
    &.active {
      background: #1e40af;
      color: #60a5fa;
    }
  }
`;

const RideRoute = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  
  .location {
    flex: 1;
    
    .label {
      color: #666;
      font-size: 0.8rem;
      margin-bottom: 4px;
    }
    
    .address {
      color: white;
      font-size: 0.95rem;
    }
  }
  
  .arrow {
    color: ${props => props.theme.colors?.primary};
  }
`;

const RideFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #333;
  
  .driver {
    display: flex;
    align-items: center;
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
    
    .info {
      .name {
        color: white;
        font-size: 0.9rem;
        margin-bottom: 2px;
      }
      
      .vehicle {
        color: #666;
        font-size: 0.8rem;
      }
    }
  }
  
  .action {
    color: ${props => props.theme.colors?.primary};
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #333;
    border-top-color: ${props => props.theme.colors?.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

interface Ride {
  id: string;
  riderId: string;
  driverId: string;
  pickup: string;
  dropoff: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  estimatedPickupTime: string;
  passengers: number;
  driver: {
    name: string;
    vehicle: string;
    photo: string;
  };
}

const RideHistory: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      if (!user?.uid) return;

      try {
        const ridesList = await rideService.getUserRides(user.uid, activeTab);
        setRides(ridesList as Ride[]);
      } catch (error) {
        console.error('Error fetching rides:', error);
        toast.error('Failed to load ride history');
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [user?.uid, activeTab]);

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'pending':
        return 'pending';
      case 'cancelled':
        return 'cancelled';
      case 'active':
        return 'active';
      default:
        return '';
    }
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

      <Title style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <BsCalendar size={24} />
        RIDE HISTORY
      </Title>

      <HistoryContainer>
        <TabsContainer>
          <Tab
            active={activeTab === 'upcoming'}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </Tab>
          <Tab
            active={activeTab === 'past'}
            onClick={() => setActiveTab('past')}
          >
            Past
          </Tab>
        </TabsContainer>

        {loading ? (
          <LoadingSpinner>
            <div className="spinner" />
          </LoadingSpinner>
        ) : rides.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
            No {activeTab} rides found
          </div>
        ) : (
          rides.map((ride) => {
            const { date, time } = formatDateTime(ride.estimatedPickupTime);
            return (
              <RideCard
                key={ride.id}
                onClick={() => navigate(`/ride/confirmation/${ride.id}`)}
              >
                <RideHeader>
                  <div className="date">
                    <BsCalendar />
                    {date} • <BsClock /> {time}
                  </div>
                  <div className={`status ${getStatusClass(ride.status)}`}>
                    {ride.status}
                  </div>
                </RideHeader>

                <RideRoute>
                  <div className="location">
                    <div className="label">Pickup</div>
                    <div className="address">{ride.pickup}</div>
                  </div>
                  <div className="arrow">
                    <BsArrowRight size={20} />
                  </div>
                  <div className="location">
                    <div className="label">Dropoff</div>
                    <div className="address">{ride.dropoff}</div>
                  </div>
                </RideRoute>

                <RideFooter>
                  <div className="driver">
                    <div className="avatar">
                      <img src={ride.driver.photo} alt={ride.driver.name} />
                    </div>
                    <div className="info">
                      <div className="name">{ride.driver.name}</div>
                      <div className="vehicle">{ride.driver.vehicle}</div>
                    </div>
                  </div>
                  <div className="action">
                    <BsChevronRight size={20} />
                  </div>
                </RideFooter>
              </RideCard>
            );
          })
        )}
      </HistoryContainer>
    </PageContainer>
  );
};

export default RideHistory;
