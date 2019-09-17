import { Link } from 'gatsby';
import * as React from 'react';
import ReduxToastr from 'react-redux-toastr';
import styled, { createGlobalStyle } from 'styled-components';
import { Nav, Navbar } from 'react-bootstrap';
import { Provider } from 'react-redux';
import { Container } from 'semantic-ui-react';
import { store } from '../store';
import MiniFooter from './Panel/MiniFooter';
import CImg from './CImg/CImg';

import '../../node_modules/react-redux-toastr/lib/css/react-redux-toastr.min.css';
import '../assets/css/styles.css';
import RegistrationModal from '../pages/Registration/RegistrationModal';
import LoginModal from '../pages/Login/LoginModal';

import DefaultLogoImg from './CImg/DefaultLogoImg';

const Area = styled.div``;

const LogoImg = styled(CImg)`
  max-width: 150px;
  margin: 20px 40px 8px;
`;

const Anchor = styled.a`
  color: #2b2b2b;
  font-weight: 600;
  padding: 24px 15px;
  text-decoration: none;
`;

const StyledNavbar = styled(Navbar)`
  padding: 0 !important;
  background-color: #f8f5fc !important;
`;

const HeaderContainer = styled(Container)`
  max-width: 1200px !important;
`;

const StyledLink = styled(Link)`
  display: block;
  margin: 1rem 0;
`;

const GlobalStyle = createGlobalStyle`
  @media (max-width: 576px) {
    .modal-dialog {
      margin: 0 !important;
    }
  }
`;

export const menuItems = [
  { name: 'Home', path: '/', exact: true, icon: 'home', inverted: true },
  { name: 'About', path: '/about/', exact: true, icon: 'info circle' },
  { name: 'Blog', path: '/blog/', exact: false, icon: 'newspaper' },
];

export interface LayoutProps {
  location: {
    pathname: string;
  };
  children: any;
}

const BusinessLayout = ({ children, isHeader, logo, t }) => {
  return (
    <Provider store={store}>
      <Area>
        <GlobalStyle />
        {/*<SEO*/}
        {/*title={title}*/}
        {/*keywords={[`blog`, `gatsby`, `javascript`, `react`]}*/}
        {/*/>*/}
        <div>
          {isHeader && (
            <HeaderContainer>
              {/* <StyledLink to="/">
                {logo ? (
                  <LogoImg path={logo.hash + logo.ext} />
                ) : (
                  <DefaultLogoImg />
                )}
              </StyledLink> */}
              <StyledNavbar expand="lg">
                <Container>
                  <Nav className="mr-auto">
                    <Anchor href="#o-nas">{t('About')}</Anchor>
                    <Anchor href="#czym-sie-zajmujemy">
                      {t('What we do')}
                    </Anchor>
                    <Anchor href="#kontakt">{t('Contact')}</Anchor>
                    <Anchor href="/">{t('Home')}</Anchor>
                  </Nav>
                </Container>
              </StyledNavbar>
            </HeaderContainer>
          )}
          {/* Render children pages */}
          <div style={{ paddingBottom: 60 }}>{children}</div>
          <MiniFooter />
          <LoginModal />
          <RegistrationModal />
          <ReduxToastr
            timeOut={4000}
            newestOnTop={false}
            preventDuplicates
            position="top-right"
            transitionIn="fadeIn"
            transitionOut="fadeOut"
            progressBar
            closeOnToastrClick
          />
        </div>
      </Area>
    </Provider>
  );
};

export default BusinessLayout;

export const withBusinessLayout = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) =>
  class WithLayout extends React.Component<P & LayoutProps> {
    render() {
      const {
        getBusiness: { business },
        t,
      } = this.props;
      return (
        <BusinessLayout
          isHeader={true}
          location={this.props.location}
          logo={business && business.logo}
          t={t}
        >
          <WrappedComponent {...this.props} />
        </BusinessLayout>
      );
    }
  };

export const withBusinessLPLayout = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) =>
  class WithLayout extends React.Component<P & LayoutProps> {
    render() {
      // return ;
      //  location={this.props.location}
      return (
        <BusinessLayout location={this.props.location}>
          <WrappedComponent {...this.props} />
        </BusinessLayout>
      );
    }
  };
