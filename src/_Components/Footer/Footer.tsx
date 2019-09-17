import * as React from 'react';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import MiniFooter from '../Panel/MiniFooter';
import ListUnstyled from '../Panel/ListUnstyled';
import { withTranslation } from 'react-i18next';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { parseQuery } from '../utils/parseQuery';
import { Link } from 'gatsby';
import { groupBy } from '../../../node_modules/@types/lodash';

const Title = styled.h2`
  margin: 0 0 25px;
  font-size: 22px;
  font-weight: 700;
`;

const FooterContainer = styled(Container)`
  font-size: 12px;
  line-height: 17px;
`;
const FooterTitle = styled.h6`
  font-size: 14px;
  color: #606060;
  font-weight: 700;
  margin-bottom: 12px;
`;

const FooterItem = styled.li`
  color: #858585;
  font-size: 16px;
  margin-bottom: 4px;
  line-height: 1.2;
`;

const FOOTER_QUERY = gql`
  query CatQuery {
    categories {
      id
      name
      slug

      businesses {
        id
        city {
          id
          name
        }
      }
    }
  }
`;

const LinkUnstyled = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const Footer = ({ t, footerQuery: { categories } }) => (
  <React.Fragment>
    <FooterContainer>
      <Title>{t('Find specialist')}</Title>
      <Row>
        {categories &&
          categories.map(({ id, name, slug, businesses }) => {
            const cities = businesses.filter(
              (business, index, self) =>
                business.city &&
                index ===
                  self.findIndex(
                    t =>
                      t.city &&
                      t.city.id === business.city.id &&
                      t.city.id === business.city.id,
                  ),
            );
            return (
              <Col key={id}>
                <FooterTitle>{name}</FooterTitle>
                <ListUnstyled>
                  {cities.map(({ city }) => (
                    <FooterItem key={city.id}>
                      <LinkUnstyled to={slug + '?city=' + city.id}>
                        {city.name}
                      </LinkUnstyled>
                    </FooterItem>
                  ))}
                </ListUnstyled>
              </Col>
            );
          })}
      </Row>
    </FooterContainer>
    <MiniFooter />
    <br />
    <br />
  </React.Fragment>
);

export default graphql(FOOTER_QUERY, {
  name: 'footerQuery',
})(withTranslation('footer')(Footer));
