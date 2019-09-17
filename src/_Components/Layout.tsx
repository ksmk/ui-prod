import * as React from 'react';
import ReduxToastr from 'react-redux-toastr';
import styled, { createGlobalStyle } from 'styled-components';
import HeaderMenu from './HeaderMenu/HeaderMenu';
import Footer from './Footer/Footer';
import '../../node_modules/react-redux-toastr/lib/css/react-redux-toastr.min.css';
import '../../node_modules/react-big-calendar/lib/css/react-big-calendar.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/slick-carousel/slick/slick.css';
import '../../node_modules/slick-carousel/slick/slick-theme.css';
import '../assets/css/styles.css';
import SEO from './Helmet/seo';

import LoginModal from '../pages/Login/LoginModal';
import RegistrationModal from '../pages/Registration/RegistrationModal';
import ResetPasswordModal from '../pages/ResetPassword/ResetPasswordModal';
import { connect } from 'react-redux';
import { resetPassword } from '../_Resources/Auth/Actions/resetPassword';
import { setResetPasswordDialogActive } from '../_Resources/Auth/Actions/setResetPasswordDialogActive';

const Area = styled.div``;

const Warning = styled.div`
  background-color: yellow;
  color: #000;
  padding: 1rem 5rem;
  margin-bottom: 1rem;
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

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginActive: false,
      isRegistrationActive: false,
    };
  }

  onCloseLogin = () => this.setState({ isLoginActive: false });
  onCloseRegistration = () => this.setState({ isRegistrationActive: false });
  onOpenLogin = () => this.setState({ isLoginActive: true });
  onOpenRegistration = () => this.setState({ isRegistrationActive: true });

  componentDidMount() {
    const { location, dispatchOpenDialog } = this.props;
    if (typeof document !== 'undefined') {
      let params = new URL(document.location).searchParams;
      const token = params.get('jwt');
      const code = params.get('code');

      if (!!token) {
        localStorage.setItem('token', token);
        window.location.href = 'http://umawiajonline.pl';
      } else if (!!code) {
        dispatchOpenDialog();
      }
    }
  }

  redirectUser = path => {
    console.warn(path);
    // this.props.history.push(path);
  };

  render() {
    // const { pathname } = props.location;
    // const isHome = pathname === '/';
    const { isLoginActive, isRegistrationActive } = this.state;
    return (
      <Area>
        <GlobalStyle />
        <div>
          <HeaderMenu
            items={menuItems}
            onLogin={this.onOpenLogin}
            onRegistration={this.onOpenRegistration}
          />
          {/* Render children pages */}
          <div style={{ paddingBottom: 60 }}>{this.props.children}</div>
          <Footer />
          <ReduxToastr
            timeOut={4000}
            newestOnTop={false}
            preventDuplicates
            position="bottom-right"
            transitionIn="fadeIn"
            transitionOut="fadeOut"
            progressBar
            closeOnToastrClick
          />
        </div>
        <LoginModal />
        <RegistrationModal />
        <ResetPasswordModal />
      </Area>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  dispatchOpenDialog: () => {
    dispatch(setResetPasswordDialogActive({ isActive: true }));
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(Layout);

export const withLayout = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) =>
  class WithLayout extends React.Component<P & LayoutProps> {
    render() {
      // return ;
      //  location={this.props.location}
      return (
        <Layout location={this.props.location}>
          <WrappedComponent {...this.props} />
        </Layout>
      );
    }
  };
