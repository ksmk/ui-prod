import * as React from 'react';
import ListUnstyled from './ListUnstyled';
import CAddress from '../Text/CAddress';
import CButton from '../Fields/CButton';
import styled from 'styled-components';
import { H4 } from '../Text/CHeadline';
import StarList from '../Fields/StarList';

const StyledH4 = styled(H4)`
  display: inline-block;
`;

const StyledCAddress = styled(CAddress)`
  ${({ color }) => color && `color: ${color};`}
`;

export default ({
  name,
  categories,
  city,
  street,
  district,
  rating,
  color,
}) => (
  <React.Fragment>
    <StyledH4>{name}</StyledH4> <StarList rate={rating} />
    <ListUnstyled>
      {categories &&
        categories.map(({ id, name }) => (
          <ListUnstyled.Item key={id}>{name}</ListUnstyled.Item>
        ))}
    </ListUnstyled>
    <StyledCAddress color={color}>
      {city && city.name} / {street} / {district && district.name}
    </StyledCAddress>
  </React.Fragment>
);
