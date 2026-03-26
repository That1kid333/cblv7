import styled from 'styled-components';
import logoImage from '../assets/images/logo.png';

export const theme = {
  colors: {
    primary: '#F4A340',
    background: '#000000',
    surface: '#222222',
    text: '#FFFFFF',
    textSecondary: '#999999',
    border: '#333333'
  },
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  }
};

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors?.background || '#000000'};
  color: ${props => props.theme.colors?.text || '#FFFFFF'};
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: ${props => props.theme.colors?.background || '#000000'};
  border-bottom: 1px solid ${props => props.theme.colors?.border || '#333333'};
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const Logo = styled.div`
  background-image: url(${logoImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 180px;
  height: 40px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors?.text || '#FFFFFF'};
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors?.primary || '#F4A340'};
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors?.text || '#FFFFFF'};
  text-align: center;
  margin: 20px 0 10px;
`;

export const Subtitle = styled.h2`
  font-size: 1.2rem;
  color: ${props => props.theme.colors?.primary || '#F4A340'};
  text-align: center;
  margin-bottom: 20px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 15px;
  background: ${props => props.theme.colors?.surface || '#222222'};
  border: 1px solid ${props => props.theme.colors?.border || '#333333'};
  border-radius: 8px;
  color: ${props => props.theme.colors?.text || '#FFFFFF'};
  font-size: 1rem;
  
  &::placeholder {
    color: ${props => props.theme.colors?.textSecondary || '#999999'};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors?.primary || '#F4A340'};
  }
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'google' }>`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: transparent;
          border: 2px solid ${props.theme.colors?.primary || '#F4A340'};
          color: ${props.theme.colors?.primary || '#F4A340'};
          
          &:hover {
            background: ${props.theme.colors?.primary + '20' || '#F4A34020'};
          }
        `;
      case 'google':
        return `
          background: white;
          color: #333;
          
          &:hover {
            background: #f5f5f5;
          }
        `;
      default:
        return `
          background: ${props.theme.colors?.primary || '#F4A340'};
          color: white;
          
          &:hover {
            background: ${props.theme.colors?.primary + 'dd' || '#F4A340dd'};
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Link = styled.a`
  color: ${props => props.theme.colors?.primary || '#F4A340'};
  text-decoration: none;
  text-align: center;
  margin: 10px 0;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const SmallText = styled.p`
  color: ${props => props.theme.colors?.textSecondary || '#999999'};
  font-size: 0.8rem;
  text-align: center;
  margin: 10px 0;
  line-height: 1.4;
`;

export const MembershipSeal = styled.img`
  width: 150px;
  height: 150px;
  object-fit: contain;
  margin: 20px auto;
`;

export const CircleButton = styled(IconButton)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.colors?.primary || '#F4A340'};
  background: transparent;
  margin: 10px;
  
  &:hover {
    background: ${props => props.theme.colors?.primary + '20' || '#F4A34020'};
  }
  
  svg {
    width: 30px;
    height: 30px;
  }
`;

export const Badge = styled.div`
  background: ${props => props.theme.colors?.primary || '#F4A340'};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
`;

export const Card = styled.div`
  background: ${props => props.theme.colors?.surface || '#222222'};
  border-radius: 12px;
  padding: 20px;
  margin: 10px 0;
  
  h3 {
    color: ${props => props.theme.colors?.primary || '#F4A340'};
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
  
  p {
    color: ${props => props.theme.colors?.textSecondary || '#999999'};
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;
