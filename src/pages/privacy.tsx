import * as React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { withLayout } from '../_Components/Layout';
import CLink from '../_Components/Text/CLink';

import Helmet from 'react-helmet';

const Wrapper = styled.div`
  padding: 40px;
`;

const StyledLink = styled(Link)`
  color: #f5606d;
`;

const PrivacyPolicy = () => (
  <Wrapper>
    {/* <Helmet>
      <meta charSet="utf-8" />
      <title>Polityka Prywatności</title>
    </Helmet> */}
    <StyledLink to="/">&lt; Powrót</StyledLink>
    <br />
    <br />
    <p>&sect;.1 Postanowienia Og&oacute;lne</p>
    <ol>
      <li>
        <p>Administratorem danych jest ****.</p>
      </li>
    </ol>
  </Wrapper>
);

export default PrivacyPolicy;
