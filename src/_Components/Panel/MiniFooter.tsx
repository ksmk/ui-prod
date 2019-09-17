import * as React from 'react';
import iconFb from '../../assets/img/icon-fb.png';
import { Col, Container, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { withTranslation } from 'react-i18next';

const Footer = styled.section`
  margin-top: 50px;
  padding-top: 24px;
  border-top: 4px solid #f8f5fc;
`;

const FooterLink = styled(Link)`
  color: #2b2b2b;
  text-decoration: none;
  padding-right: 20px;
`;

const MiniFooter = ({ t }) => (
  <Footer>
    <Container>
      <Row>
        <Col>
          <FooterLink to="/privacy">{t('Privacy policy')}</FooterLink>
          <FooterLink to="/regulations">{t('Regulations')}</FooterLink>
          <br />
          &copy; {t('All rights reserved')}
        </Col>
        <Col sm="auto">
          <a href="https://web.facebook.com/" target="_blank">
            <img src={iconFb} alt="Facebook" />
          </a>
        </Col>
      </Row>
    </Container>
    <br />
  </Footer>
);
export default withTranslation('footer')(MiniFooter);
