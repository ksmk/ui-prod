import * as React from 'react';
import styled from 'styled-components';
import { CImages } from '../../assets/img';

const StyledImg = styled.img`
  max-width: 150px;
  max-height: 100%;
`;

const DefaultLogoImg = ({ className }) => {
  return (
    <StyledImg
      src={CImages.business.defaultLogo}
      alt="logo"
      className={className}
    />
  );
};
export default DefaultLogoImg;
