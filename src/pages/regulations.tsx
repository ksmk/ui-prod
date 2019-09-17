import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import Helmet from 'react-helmet';

const Wrapper = styled.div`
  padding: 40px;
`;

const StyledLink = styled(Link)`
  color: #f5606d;
`;

const Regulations = () => (
  <Wrapper>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Regulamin</title>
    </Helmet>
    <StyledLink to="/">&lt; Powrót</StyledLink>
    <br />
    <br />
    <p>&sect;.1 Postanowienia Og&oacute;lne</p>
    <ol>
      <li>
        <p>Regulamin świadczenia usług ****.</p>
      </li>
    </ol>
    {/* <div dangerouslySetInnerHTML={{ __html: copy }} /> */}
  </Wrapper>
);

export default Regulations;
