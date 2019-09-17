import * as React from 'react';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import { Link } from 'gatsby';
import { withLayout } from '../../Layout';
import { connect } from 'react-redux';

interface IProps {}

const Wrapper = styled.div`
  min-height: 400px;
`;

const Nav = styled.div``;

const Item = styled(Link)`
  margin-right: 2rem;
`;

const UserLayout: React.FunctionComponent<IProps> = ({
  children,
  admin_layout,
}) =>
  console.warn(admin_layout) || (
    <Wrapper>
      <Container>
        <Nav>
          <Item to="/zamowienia">Zamówienia</Item>
          <Item to="/konto">Konto</Item>
          {admin_layout === 'editor' && <Item to="/kalendarz">Kalendarz</Item>}
        </Nav>
        {children}
      </Container>
    </Wrapper>
  );

const mapStateToProps = ({ auth: { user } }) => ({
  admin_layout: user && user.admin_layout,
});

export default connect(mapStateToProps)(withLayout(UserLayout));
