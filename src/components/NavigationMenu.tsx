import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
`;

const MenuContainer = styled.div`
  background: #1a1a1a;
  width: 300px;
  height: 100%;
  padding: 20px;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

const MenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #333;

  h2 {
    margin: 0;
    color: ${props => props.theme.colors?.primary};
    font-size: 1.2rem;
  }

  button {
    background: none;
    border: none;
    color: #666;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;

    &:hover {
      color: #fff;
    }
  }
`;

const MenuSection = styled.div`
  margin-bottom: 30px;

  h3 {
    color: #666;
    font-size: 0.9rem;
    margin: 0 0 15px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const MenuItem = styled.button`
  display: block;
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 8px;
  background: #222;
  border: 1px solid #333;
  border-radius: 8px;
  color: white;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
    border-color: ${props => props.theme.colors?.primary};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

interface NavigationMenuProps {
  onClose: () => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <MenuOverlay onClick={onClose}>
      <MenuContainer onClick={e => e.stopPropagation()}>
        <MenuHeader>
          <h2>MENU</h2>
          <button onClick={onClose}>&times;</button>
        </MenuHeader>

        <MenuSection>
          <h3>Riders</h3>
          <MenuItem onClick={() => handleNavigation('/rider/login')}>
            Rider Login
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/rider/signup')}>
            Sign Up as Rider
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <h3>Drivers</h3>
          <MenuItem onClick={() => handleNavigation('/driver/login')}>
            Driver Login
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/driver/signup')}>
            Join as Driver
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <h3>Help & Support</h3>
          <MenuItem onClick={() => handleNavigation('/support')}>
            Contact Support
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/faq')}>
            FAQ
          </MenuItem>
        </MenuSection>
      </MenuContainer>
    </MenuOverlay>
  );
};

export default NavigationMenu;
