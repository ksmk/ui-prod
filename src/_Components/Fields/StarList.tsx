import * as React from 'react';
import ReactStars from 'react-stars';
import styled from 'styled-components';

const StyledReactStars = styled(ReactStars)`
  display: inline-block;
`;

const StarList = ({ rate, ratingChanged, onClick, edit }) => (
  <StyledReactStars
    onClick={onClick}
    count={5}
    value={rate}
    onChange={ratingChanged}
    size={24}
    half={true}
    edit={!!edit}
  />
);

export default StarList;
