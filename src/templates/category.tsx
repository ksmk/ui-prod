import * as React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import Img from 'gatsby-image';
import { groupBy } from 'lodash';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { times } from 'lodash';
import { StarFilled, StarOutlined } from '../_Components/Icon/Star';
import Map from '../assets/img/map.jpg';

import Layout, { withLayout } from '../_Components/Layout';
import { H1, H2, H3, H4 } from '../_Components/Text/CHeadline';
import StarList from '../_Components/Fields/StarList';
import SingleItem from '../pages/Cat/SingleItem';
import MapModal from '../pages/Cat/MapModal';
import SearchBar from './Category/Components/SearchBar';
import ListUnstyled from '../_Components/Panel/ListUnstyled';
import { Checkbox, List, ListItem } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { parseQuery } from '../_Components/utils/parseQuery';

// import bgSearch from '../assets/img/bg-search.jpg';

const FastSearch = styled.div`
    // background: 50% 0 url('${bgSearch}') no-repeat;
    width: 100%;
    height: 374px;
    background-size: 100%;
    padding: 50px 30px;
`;

const MapImg = styled.img`
  max-width: 100%;
  margin-top: -7px;
`;

const Widget = styled.div`
  margin-bottom: 2rem;
`;

const starsLimit = 5;

const CAT_QUERY = gql`
  query CatQuery($id: ID!, $whereBus: JSON) {
    cities {
      id
      name
    }
    category(id: $id) {
      id
      name

      businesses(where: $whereBus) {
        id
        name
        about
        latitude
        longitude
        rating
        street
        street_number
        flat_number
        frequency
        workdays_open_hour
        workdays_close_hour
        saturday_open
        saturday_open_hour
        saturday_close_hour
        sunday_open
        sunday_open_hour
        sunday_close_hour
        city {
          id
          name
        }
        owner {
          id
        }
        district {
          id
          name
        }
        categories {
          id
          name
        }
        latitude
        longitude
        logo {
          id
          hash
          ext
        }
        servicedetails {
          id
          price
          duration
          description
          name
        }
        providers {
          id
          name
        }
      }
    }
  }
`;

class CategoryTemplate extends React.Component<{}, { dialogActive: boolean }> {
  constructor(args) {
    super(args);
    const query = parseQuery(this.props.location.search);
    const selectedCities = query.city ? { [query.city]: true } : {};
    this.state = {
      isMapActive: false,
      selectedCities,
      selectedRating: null,
    };
  }

  onMapClose = () => this.setState({ isMapActive: false });
  onMapOpen = () => {
    this.setState({ isMapActive: true });
  };

  filterData = () => {
    const { selectedRating, selectedCities } = this.state;
    const cities =
      selectedCities &&
      Object.keys(selectedCities)
        .filter(k => selectedCities[k])
        .map(Number);

    const ratingProp = selectedRating ? { rating: selectedRating } : {};
    const citiesProp = cities && cities.length > 0 ? { city_in: cities } : {};
    this.props.catQuery.refetch({
      whereBus: { ...ratingProp, ...citiesProp },
    });
  };

  ratingChanged = selectedRating => {
    this.setState(
      {
        selectedRating:
          selectedRating !== this.state.selectedRating ? selectedRating : null,
      },
      () => this.filterData(),
    );
  };

  cityChanged = (id, checked) => {
    this.setState(
      {
        selectedCities: {
          ...this.state.selectedCities,
          [id]: checked,
        },
      },
      () => this.filterData(),
    );
  };

  getBusinesses = () => {
    const {
      catQuery: { category },
    } = this.props;
    return (category && category.businesses) || [];
  };

  getCities = () => {
    const {
      catQuery: { cities },
    } = this.props;
    const cityIds = this.getBusinesses().map(({ city }) => city && city.id);
    return cities ? cities.filter(({ id }) => cityIds.indexOf(id) > -1) : [];
  };

  render() {
    const {
      t,
      catQuery: { category },
    } = this.props;
    const { isMapActive, selectedRating, selectedCities } = this.state;
    const businesses = this.getBusinesses();

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
      <Container>
        <Row>
          <Col sm={3}>
            <Widget>
              <MapImg src={Map} alt="map" onClick={this.onMapOpen} />
            </Widget>
            <Widget>
              <H3>{t('Location')}</H3>
              <List disablePadding={true}>
                {cities.map(({ city: { id, name } }) => (
                  <ListItem key={id}>
                    <Checkbox
                      onChange={(ev, checked) => this.cityChanged(id, checked)}
                      checked={selectedCities[id]}
                    />
                    {name}
                  </ListItem>
                ))}
              </List>
            </Widget>
            <Widget>
              <H3>{t('Reviews')}</H3>
              {times(starsLimit).map((val, index) => (
                <div onClick={() => this.ratingChanged(5 - index)} key={index}>
                  <StarList key={index} rate={5 - index} />
                  {selectedRating === 5 - index && '✓'}
                </div>
              ))}
            </Widget>
          </Col>
          <Col sm={9}>
            <FastSearch>
              <H3>
                {category && category.name} {t('for now')}
              </H3>
              <SearchBar />
            </FastSearch>
            <H3>{category && category.name}</H3>
            {businesses &&
              businesses.map(business => {
                return <SingleItem {...business} key={business.id} />;
              })}
          </Col>
        </Row>
        <MapModal
          active={isMapActive}
          onClose={this.onMapClose}
          businesses={businesses}
        />
      </Container>
    );
  }
}

export default compose(
  graphql(CAT_QUERY, {
    name: 'catQuery',
    options: props => {
      const query = parseQuery(props.location.search);
      const cityProp = query.city ? { city: +query.city } : {};
      return {
        variables: {
          id: props.pageContext.id,
          whereBus: { ...cityProp },
        },
      };
    },
  }),
)(withTranslation('category')(withLayout(CategoryTemplate)));
// price
// duration
