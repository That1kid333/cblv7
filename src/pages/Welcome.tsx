import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';
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
  Link
} from '../styles/shared';
import styled from 'styled-components';

const IconButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
`;

interface FormData {
  name: string;
  phone: string;
  email: string;
}

const Welcome: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement membership signup
    console.log('Form submitted:', formData);
    navigate('/thank-you');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

      <Title>WELCOME</Title>
      <Subtitle>Private Membership Association</Subtitle>

      <MembershipSeal 
        src="/membership-seal.png" 
        alt="PMA Membership Seal" 
      />

      <Link onClick={() => navigate('/about')}>
        ABOUT PMA MEMBERSHIP & TERMS
      </Link>

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
        <Button type="submit">
          BECOME A MEMBER
        </Button>
      </Form>

      <SmallText>
        BY SUBMITTING YOU WILL RECEIVE<br />
        A SPECIAL THANK YOU!
      </SmallText>
    </PageContainer>
  );
};

export default Welcome;
