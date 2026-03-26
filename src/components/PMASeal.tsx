import React from 'react';
import styled from 'styled-components';
import pmaSealImage from '../assets/images/pma-seal.png';

const SealContainer = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  text-align: center;

  img {
    width: ${props => {
      switch (props.size) {
        case 'small':
          return '60px';
        case 'large':
          return '150px';
        default:
          return '100px';
      }
    }};
    height: auto;
    margin-bottom: 10px;
  }

  p {
    color: ${props => props.theme.colors?.textSecondary || '#999999'};
    font-size: ${props => props.size === 'small' ? '0.8rem' : '0.9rem'};
    margin: 0;
    line-height: 1.4;
  }
`;

interface PMASealProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const PMASeal: React.FC<PMASealProps> = ({ size = 'medium', showText = true }) => {
  return (
    <SealContainer size={size}>
      <img src={pmaSealImage} alt="Private Membership Association Seal" />
      {showText && (
        <p>
          Private Membership Association
          <br />
          All Rights Reserved
        </p>
      )}
    </SealContainer>
  );
};

export default PMASeal;
