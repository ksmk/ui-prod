import * as React from 'react';
import styled from 'styled-components';

const StyledImg = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const CImg = ({ path, alt, className }) => {
  const url = `${process.env.CDN_URL}/${path}`;
  return <StyledImg src={url} alt={alt} className={className} />;
};
export default CImg;
