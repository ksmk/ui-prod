import * as React from 'react';
import { Link } from 'gatsby';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
// import { toggleSidebar } from '../../store';
import { Container, Label, Menu, Icon } from 'semantic-ui-react';
import LanguageSwitcher from '../../_Containers/LanguageSwitcher';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { MenuProps } from '../Menu';
import styled from 'styled-components';
import { toastr } from 'react-redux-toastr';
import Button from 'react-bootstrap/Button';
import { Query, graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { login } from '../../_Resources/Auth/Actions/login';
import { logout } from '../../_Resources/Auth/Actions/logout';
import { setLoginDialogActive } from '../../_Resources/Auth/Actions/setLoginDialogActive';
import { setRegistrationDialogActive } from '../../_Resources/Auth/Actions/setRegistrationDialogActive';
import { getTokenId } from '../utils/getToken';
import { toUrl } from '../../_Utils/toUrl';
import { withTranslation } from 'react-i18next';

import LogoBlack from '../../assets/img/logo-umawiaj.png';

// import Slider from '../../assets/img/costam.jpg';

interface HeaderMenuProps extends MenuProps {
  dispatch?: Dispatch<any>;
  inverted?: boolean;
}

const Area = styled.div`
  background: #ff0000;
  width: 100%;
  min-height: 550px;
  // background: url(${Slider}) 50% 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // align-items: center;
  padding: 26px 20px 76px;
  text-align: center;
  color: #fff;
`;

const NavItem = styled(Link)`
  color: #2b2b2b;
  padding-right: 40px;
  font-size: 14px;
  text-decoration: none;
  font-weight: 600;
`;

const Slogan = styled.h2`
  font-size: 14px;
  color: #414141;
  font-weight: 700;
  margin: 0;
`;
const MainMenuNavLink = styled(Nav.Link)<{ active: boolean }>`
  font-weight: 700;
  font-size: 14px;
  color: #2b2b2b !important;
  text-decoration: none;
  padding: 3.5rem 1rem;
`;

const MainMenuContainer = styled(Container)`
  @media (min-width: 1200px) {
    max-width: 1200px !important;
  }
`;

const GET_USER = gql`
  query GET_USER($id: ID!) {
    user(id: $id) {
      id
      username
      admin_layout
      vehicle_registration_number
    }
  }
`;

const GET_CATEGORIES = gql`
  query GET_CATEGORIES {
    categories {
      id
      slug
      name
    }
  }
`;

const onLogout = dispatchLogout => {
  localStorage.removeItem('token');
  dispatchLogout();
  toastr.success('Wylogowano poprawnie!');
};

export const HeaderMenu = ({
  items,
  pathname,
  user,
  inverted,
  dispatch,
  dispatchOpenLoginDialog,
  dispatchOpenRegistrationDialog,
  onRegistration,
  dispatchLogin,
  dispatchLogout,
  profileQuery,
  getCategories,
  t,
}: HeaderMenuProps) => {
  const jwtToken = getTokenId();
  if (!user && jwtToken && profileQuery.user) {
    dispatchLogin(profileQuery.user);
  }
  return (
    <React.Fragment>
      {/* <Navbar bg="white" expand="lg"> */}
      {/* <Area> */}
      <Navbar>
        <MainMenuContainer>
          <Link to="/" className="navbar-brand">
            {/* <img src={LogoBlack} alt="" /> */}
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <LanguageSwitcher lang="pl" active="pl" />
            </Nav>
            <Nav>
              {user ? (
                <React.Fragment>
                  <MainMenuNavLink href="/">{t('Home')}</MainMenuNavLink>
                  <MainMenuNavLink>
                    <Link to="/zamowienia">{t('Panel użytkownika')}</Link>
                  </MainMenuNavLink>
                  {(user.admin_layout === 'admin' ||
                    user.admin_layout === 'editor') && (
                    <>
                      <MainMenuNavLink>
                        <Link to="/kalendarz">{t('Kalendarz')}</Link>
                      </MainMenuNavLink>
                      <MainMenuNavLink
                        onClick={() =>
                          (window.location.href = 'http://localhost:1337/admin')
                        }
                      >
                        {t('Panel sterowania')}
                      </MainMenuNavLink>
                    </>
                  )}
                  <MainMenuNavLink onClick={() => onLogout(dispatchLogout)}>
                    {t('Logout')}
                  </MainMenuNavLink>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <MainMenuNavLink href="/">{t('Home')}</MainMenuNavLink>
                  <MainMenuNavLink onClick={dispatchOpenLoginDialog} href="#">
                    {t('Sign in')}
                  </MainMenuNavLink>
                  <MainMenuNavLink
                    active
                    onClick={dispatchOpenRegistrationDialog}
                    href="#"
                  >
                    {t('Sign up')}
                  </MainMenuNavLink>
                </React.Fragment>
              )}
            </Nav>
          </Navbar.Collapse>
        </MainMenuContainer>
      </Navbar>
      <br />

      {/* <Navbar>
        <Container>
          <Nav className="mr-auto">
            {getCategories &&
              getCategories.categories &&
              getCategories.categories.map(({ id, slug, name }) => (
                <NavItem to={'/' + slug} key={id}>
                  {name}
                </NavItem>
              ))}
          </Nav>
          <Slogan>
            {t('Want to join')} <Link to="/commercial">{t('Click here')}</Link>
          </Slogan>
        </Container>
      </Navbar> */}
      {/* </Area> */}
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth: { user } }) => ({ user });
const mapDispatchToProps = dispatch => ({
  dispatchLogout: args => {
    dispatch(logout());
  },
  dispatchLogin: args => {
    dispatch(login(args));
  },
  dispatchOpenLoginDialog: () => {
    dispatch(setLoginDialogActive({ isActive: true }));
  },
  dispatchOpenRegistrationDialog: () => {
    dispatch(setRegistrationDialogActive({ isActive: true }));
  },
});

export default compose(
  graphql(GET_USER, {
    name: 'profileQuery',
    options: { variables: { id: getTokenId() } },
  }),
  graphql(GET_CATEGORIES, {
    name: 'getCategories',
  }),
)(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withTranslation('headerMenu')(HeaderMenu)),
);
