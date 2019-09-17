import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

interface IProps {}

const Wrapper = styled.div``;

const Item = styled(Link)``;

const UserHeaderMenu: React.FunctionComponent<IProps> = () => (
  <Wrapper>
    <Item to="/zamowienia">Zamówienia</Item>
    <Item to="/konto">Konto</Item>
  </Wrapper>
);

export default UserHeaderMenu;
