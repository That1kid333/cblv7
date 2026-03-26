import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';
import { BsCalendar, BsClock, BsGeoAlt, BsPerson } from 'react-icons/bs';
import { useAuth } from '../hooks/useAuth';
import { rideService } from '../lib/services/ride.service';
import { toast } from 'react-hot-toast';
import styled from 'styled-components';
import {
  PageContainer,
  Header,
  Logo,
  Title,
  IconButton
} from '../styles/shared';

const ScheduleContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
`;

const Card = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #333;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${props => props.theme.colors?.primary || '#F4A340'};
    margin-bottom: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
  
  input, select {
    width: 100%;
    padding: 12px;
    background: #222;
    border: 1px solid #333;
    border-radius: 8px;
    color: white;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors?.primary || '#F4A340'};
      box-shadow: 0 0 0 2px ${props => props.theme.colors?.primary + '20' || '#F4A34020'};
    }
    
    &::placeholder {
      color: #666;
    }
  }
`;

const TimeSlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 10px;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TimeSlot = styled.button<{ selected?: boolean }>`
  padding: 12px;
  background: ${props => props.selected ? props.theme.colors?.primary : '#222'};
  border: 1px solid ${props => props.selected ? props.theme.colors?.primary : '#333'};
  border-radius: 8px;
  color: ${props => props.selected ? '#000' : '#fff'};
  font-size: 0.9rem;
  font-weight: ${props => props.selected ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors?.primary + '20' || '#F4A34020'};
    border-color: ${props => props.theme.colors?.primary || '#F4A340'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: ${props => props.theme.colors?.primary || '#F4A340'};
  border: none;
  border-radius: 8px;
  color: #000;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(244, 163, 64, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #444;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LocationInput = styled.div`
  position: relative;
  
  .icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
  
  input {
    padding-left: 40px;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #333;
    border-top-color: ${props => props.theme.colors?.primary || '#F4A340'};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Schedule: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  const timeSlots = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM',
    '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get available drivers
      const drivers = await rideService.getAvailableDrivers();
      
      if (drivers.length === 0) {
        toast.error('No drivers available at this time. Please try again later.');
        return;
      }

      // Create the ride request
      const rideRequest = {
        riderId: user?.uid || '',
        driverId: drivers[0].id, // Assign to first available driver for now
        pickup: pickupLocation,
        dropoff: dropoffLocation,
        status: 'pending',
        timestamp: new Date().toISOString(),
        estimatedPickupTime: `${selectedDate} ${selectedTime}`,
        passengers: parseInt(passengers),
      };

      // Submit the ride request
      const rideId = await rideService.createRideRequest(rideRequest);
      
      // Navigate to confirmation page
      navigate(`/ride/confirmation/${rideId}`);
      toast.success('Ride scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling ride:', error);
      toast.error('Failed to schedule ride. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      {isLoading && (
        <LoadingOverlay>
          <div className="spinner" />
        </LoadingOverlay>
      )}
      
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
        SCHEDULE A RIDE
      </Title>

      <ScheduleContainer>
        <form onSubmit={handleSubmit}>
          <Card>
            <FormGroup>
              <label>
                <BsCalendar />
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>
                <BsClock />
                Select Time
              </label>
              <TimeSlotGrid>
                {timeSlots.map((time) => (
                  <TimeSlot
                    key={time}
                    selected={selectedTime === time}
                    onClick={() => setSelectedTime(time)}
                    type="button"
                  >
                    {time}
                  </TimeSlot>
                ))}
              </TimeSlotGrid>
            </FormGroup>
          </Card>

          <Card>
            <FormGroup>
              <label>
                <BsGeoAlt />
                Pickup Location
              </label>
              <LocationInput>
                <div className="icon">
                  <BsGeoAlt />
                </div>
                <input
                  type="text"
                  placeholder="Enter pickup address"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  required
                />
              </LocationInput>
            </FormGroup>

            <FormGroup>
              <label>
                <BsGeoAlt />
                Dropoff Location
              </label>
              <LocationInput>
                <div className="icon">
                  <BsGeoAlt />
                </div>
                <input
                  type="text"
                  placeholder="Enter destination address"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  required
                />
              </LocationInput>
            </FormGroup>

            <FormGroup>
              <label>
                <BsPerson />
                Number of Passengers
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                required
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
            </FormGroup>
          </Card>

          <SubmitButton
            type="submit"
            disabled={!selectedDate || !selectedTime || !pickupLocation || !dropoffLocation || isLoading}
          >
            {isLoading ? 'SCHEDULING...' : 'SCHEDULE RIDE'}
          </SubmitButton>
        </form>
      </ScheduleContainer>
    </PageContainer>
  );
};

export default Schedule;
