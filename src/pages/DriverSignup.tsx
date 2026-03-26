import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';
import { FaShoppingCart } from 'react-icons/fa';
import {
  PageContainer,
  Header,
  Logo,
  Title,
  Subtitle,
  Input,
  Button,
  Form,
  MembershipSeal,
  SmallText,
  Link,
  IconButton
} from '../styles/shared';
import styled from 'styled-components';

const SubscriptionText = styled.div`
  text-align: center;
  margin: 20px 0;
  
  .price {
    color: ${props => props.theme.colors?.primary || '#F4A340'};
    font-size: 1.2rem;
    font-weight: bold;
    margin: 10px 0;
  }
  
  .description {
    font-size: 0.9rem;
    color: #999;
    line-height: 1.4;
  }
`;

interface SignupForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  driversLicense: {
    number: string;
    expirationDate: string;
  };
  vehicle: {
    make: string;
    model: string;
    year: string;
    color: string;
    plate: string;
  };
  locationId: string;
}

const initialSignupForm: SignupForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  driversLicense: {
    number: '',
    expirationDate: ''
  },
  vehicle: {
    make: '',
    model: '',
    year: '',
    color: '',
    plate: ''
  },
  locationId: ''
};

const DriverSignup: React.FC = () => {
  const [formData, setFormData] = useState<SignupForm>(initialSignupForm);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const now = new Date().toISOString();

      // Create driver profile
      const driverData = {
        id: userCredential.user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        photo: '', // Add default photo URL if needed
        driversLicense: {
          ...formData.driversLicense,
          documentUrl: '' // Add document upload functionality
        },
        vehicle: {
          ...formData.vehicle,
          insurance: {
            provider: '',
            policyNumber: '',
            expirationDate: '',
            documentUrl: ''
          },
          registration: {
            number: '',
            expirationDate: '',
            documentUrl: ''
          }
        },
        rating: 5.0,
        totalRides: 0,
        isOnline: false,
        lastOnlineChange: now,
        metrics: {
          totalEarnings: 0,
          acceptanceRate: 100,
          responseTime: 0,
          hoursOnline: 0,
          todayRides: 0
        },
        backgroundCheck: {
          status: 'pending',
          submissionDate: now,
          documentUrl: ''
        },
        baseRate: 0,
        airportRate: 0,
        longDistanceRate: 0,
        serviceLocations: [formData.locationId],
        status: 'inactive' as const,
        created_at: now,
        updated_at: now
      };

      // Save to Firebase
      await setDoc(doc(db, 'drivers', userCredential.user.uid), driverData);

      // Navigate to driver portal after successful registration
      navigate('/driver/portal');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (
    category: 'driversLicense' | 'vehicle',
    field: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleLocationChange = (locationId: string) => {
    setFormData(prev => ({ ...prev, locationId }));
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
      <Subtitle>SIGNUP</Subtitle>

      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="E-Mail"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Set Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </Form>

      <SubscriptionText>
        <div className="price">$19.99 Monthly Subscription Fee</div>
        <div className="description">
          First Month is free and every month following will be billed
          accordingly. You can cancel at any time. This fee includes the digital
          driver packet w/badges & QR-Codes along with full access to the app.
        </div>
      </SubscriptionText>

      <MembershipSeal 
        src="/membership-seal.png" 
        alt="PMA Membership Seal" 
        style={{ marginTop: 'auto' }}
      />
    </PageContainer>
  );
};

export default DriverSignup;