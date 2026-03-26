import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';
import { FcGoogle } from 'react-icons/fc';
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
  Link,
  IconButton
} from '../styles/shared';
import NavigationMenu from '../components/NavigationMenu';
import PMASeal from '../components/PMASeal';
import { authService } from '../lib/services/auth.service';
import { toast } from 'react-hot-toast';
import styled from 'styled-components';

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0;
  color: #666;
  font-size: 0.9rem;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: ${props => props.theme.colors?.primary};
  }
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin: 10px 0;
  
  a {
    color: ${props => props.theme.colors?.primary};
    font-size: 0.9rem;
    text-decoration: none;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1a1a1a;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  
  h2 {
    margin: 0 0 20px;
    color: white;
  }
  
  p {
    color: #666;
    margin-bottom: 20px;
  }
`;

interface FormData {
  email: string;
  password: string;
}

const DriverLogin: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.login(formData.email, formData.password, rememberMe);
      toast.success('Login successful!');
      navigate('/driver/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await authService.signInWithGoogle();
      toast.success('Login successful!');
      navigate('/driver/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      await authService.sendPasswordResetEmail(resetEmail);
      toast.success('Password reset email sent! Please check your inbox.');
      setShowResetModal(false);
      setResetEmail('');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to send password reset email.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <PageContainer>
      <Header>
        <IconButton onClick={() => window.open('https://instagram.com', '_blank')}>
          <FaInstagram />
        </IconButton>
        <Logo onClick={() => navigate('/')} />
        <IconButton onClick={() => setShowMenu(true)}>
          <RxHamburgerMenu />
        </IconButton>
      </Header>

      {showMenu && <NavigationMenu onClose={() => setShowMenu(false)} />}

      <Title>DRIVER LOGIN</Title>
      <Subtitle>Welcome back! Please login to continue.</Subtitle>

      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        
        <Checkbox>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label>Remember me</label>
        </Checkbox>

        <ForgotPassword>
          <a onClick={() => setShowResetModal(true)}>Forgot Password?</a>
        </ForgotPassword>

        <Button type="submit" disabled={loading}>
          {loading ? 'LOGGING IN...' : 'LOGIN'}
        </Button>
        <Button type="button" onClick={handleGoogleSignIn} disabled={loading}>
          <FcGoogle style={{ marginRight: '8px' }} />
          {loading ? 'SIGNING IN...' : 'SIGN IN WITH GOOGLE'}
        </Button>
      </Form>

      <MembershipSeal>
        Not a driver yet?{' '}
        <Link onClick={() => navigate('/driver/signup')}>
          Join our team
        </Link>
      </MembershipSeal>

      <PMASeal size="medium" />

      {showResetModal && (
        <Modal onClick={() => setShowResetModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2>Reset Password</h2>
            <p>Enter your email address and we'll send you instructions to reset your password.</p>
            <form onSubmit={handlePasswordReset}>
              <Input
                type="email"
                placeholder="Email Address"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={resetLoading}>
                {resetLoading ? 'SENDING...' : 'SEND RESET LINK'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowResetModal(false)}>
                CANCEL
              </Button>
            </form>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default DriverLogin;