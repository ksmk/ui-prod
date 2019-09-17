import * as React from 'react';
import AsyncSelect from 'react-select/lib/Async';
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';

import { Link } from 'gatsby';
import { graphql, Query } from 'react-apollo';
import CButton from '../_Components/Fields/CButton';
import gql from 'graphql-tag';
import CImg from '../_Components/CImg/CImg';
import { withTranslation } from 'react-i18next';

import CHeadline from '../_Components/Text/CHeadline';
import StarList from '../_Components/Fields/StarList';

import { navigate } from '@reach/router';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Layout from '../_Components/Layout';

import DefaultLogoImg from '../_Components/CImg/DefaultLogoImg';
import BannerQuickSearch from '../assets/img/banner-main.jpg';

import { BoxHeader, BoxContent, BoxImage } from './HomePage/_Components/Box';
// import Slider from '../assets/img/costam.jpg';


const QuickSearch = styled.div`
  display: flex;
  align-items: center;
  background: url(${BannerQuickSearch}) no-repeat 50% 50%;
  // background: url(${Slider}) 50% 50%;
  min-height: 300px;
  min-width: 800px;
  color: #fff;
`;

const QuickSearchInput = styled(Form.Control)`
  font-size: 17px !important;
  padding: 23px 15px !important;
  height: 58px !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  color: #606060 !important;
  margin-right: 3px;

  max-width: ${({ type }) =>
    type === 'category'
      ? '430px'
      : type === 'place'
      ? '430px'
      : '50px'} !important;
`;

const QuickSearchSubmit = styled(CButton)`
  margin-left: 8px !important;
`;

const StyledForm = styled(Form)`
  margin-top: 20px;
  display: flex;
`;

const Page = styled.div``;

const Recommended = styled.section`
  padding: 30px 0;
`;

const Categories = styled.p`
  color: #858585;
  font-weight: 600;
  font-size: 13px;
  margin-top: 6px;
  margin-bottom: 0;
`;

const ExtraInfo = styled.p`
  margin: 0;
  font-size: 18px;
  color: #858585;
`;

const Title = styled.h2`
  margin: 0 0 25px;
  font-size: 22px;
  font-weight: 700;
`;

const Subtitle = styled.h5`
  margin-top: 10px;
  font-size: 0.875em;
  font-weight: 700;
  margin-bottom: 3px;
`;

const Business = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const LinkUnstyled = styled(Link)`
  color: inherit !important;
  text-decoration: none !important;
  margin-right: 10px;
`;

const Bests = styled.section`
  margin: 30px 0;
  font-size: 19px;
`;

const SpecialistTitle = styled.h3`
  font-weight: 700;
  line-height: 1.4;
  font-size: 29px;
`;

const Reviews = styled.section`
  margin-top: 70px;
`;
const Review = styled.div`
  background: #fff;
  border: 5px solid #fff;
  margin-bottom: 30px;
`;
const ReviewHeader = styled.div`
  background: #f8f9fa;
  padding: 20px 15px;
  text-align: center;
`;
const ReviewContent = styled.div`
  padding: 15px;
`;
const ReviewQuote = styled.div`
  font-style: italic;
  font-size: 14px;
  margin-bottom: 10px;
`;
const ReviewAuthor = styled.div`
  font-style: italic;
  font-size: 14px;
  color: #959595;
`;

const SmallInfo = styled.div`
  font-size: 11px;
`;

const LogoImg = styled.div`
  max-width: 100%;
  text-align: center;
  background: #fff;
  border: 5px solid #ededed;
  border-radius: 8px;
  height: 161px;
`;

const StyledCImg = styled(CImg)`
  object-fit: contain;
  max-width: none;
  max-height: none;
  width: 100%;
  height: 100%;
`;

const WelcomeContent = styled.div`
  position: relative;
  font-size: 29px;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 200px 50px 50px;
  min-height: 440px;

  &::after {
    z-index: -1;
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 36px;
    left: 30px;
    background-color: #f8f5fc;
  }

  @media (max-width: 6002px) {
    flex-direction: column;
  }
`;

const WelcomeImg = styled.img`
  padding-right: 20px;
`;

const WelcomeBox = styled(Row)`
  color: #2b2b2b;
  font-weight: 700;
  font-size: 21px;
  margin-top: 30px;
  margin-bottom: 50px;
`;

const StyledCol = styled(Col)`
  max-width: 400px !important;
`;

const StyledAsyncSelect = styled(AsyncSelect)`
  width: 300px;
  margin-right: 5px;

  & > * {
    min-height: 59px !important;
  }
`;

const StyledAsyncSelect2 = styled(AsyncSelect)`
  width: 200px;

  & > * {
    min-height: 59px !important;
  }
`;

const getLocation = () => {
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(showPosition);
  // } else {
  //   x.innerHTML = 'Geolocation is not supported by this browser.';
  // }
};

const showPosition = position => {
  alert(
    'Latitude: ' +
      position.coords.latitude +
      '\nLongitude: ' +
      position.coords.longitude,
  );
};

const INDEX_QUERY = gql`
  query BusinessesQuery {
    popularBusinesses: businesses(limit: 3) {
      id
      name
      street
      street_number
      flat_number
      logo {
        id
        hash
        ext
      }
      categories {
        id
        slug
        name
      }
      district {
        id
        name
      }
      city {
        id
        name
      }
      rating
    }
    recommendedBusinesses: businesses(limit: 6) {
      id
      name
      street
      street_number
      flat_number
      logo {
        id
        hash
        ext
      }
      categories {
        id
        slug
        name
      }
      district {
        id
        name
      }
      city {
        id
        name
      }
      rating
    }
  }
`;

const GET_FILTERED_CITIES = gql`
  query WhereQuery($where: JSON) {
    cities(where: $where) {
      id
      name
    }
  }
`;

const GET_FILTERED_DATA = gql`
  query CatQuery($whereBus: JSON, $whereCat: JSON) {
    businesses(where: $whereBus) {
      id
      name
    }
    categories(where: $whereCat) {
      id
      name
      slug
    }
  }
`;

class IndexPage extends React.Component {
  state = {
    placeInputValue: '',
    cityInputValue: '',
    place: null,
    search: null,
  };

  handleInputChange = (newValue: string) => {
    const inputValue = newValue.replace(/\W/g, '');
    this.setState({ placeInputValue: inputValue });
    // navigate()
    return inputValue;
  };

  handleInputWhereChange = (newValue: string) => {
    const inputValue = newValue.replace(/\W/g, '');
    this.setState({ cityInputValue: inputValue });
    return inputValue;
  };

  submit = ev => {
    ev.preventDefault();
    const { place, search } = this.state;

    // if (search.type === 'category') {
    //   const queryParam = place ? `?city=${place.value}` : '';
    //   navigate(`/${search.slug}${queryParam}`);
    // } else if (search.type === 'business') {
    //   navigate(`/business?id=${search.value}`);
    // }

    if (search != null) {
      if (search.type === 'category') {
        const queryParam = place ? `?city=${place.value}` : '';
        navigate(`/${search.slug}${queryParam}`);
      } else if (search.type === 'business') {
        navigate(`/business?id=${search.value}`);
      }
    } else {
      navigate(`/`);
    }
  };

  searchValueChanged = props => {
    this.setState({ search: props });
  };

  whereValueChanged = props => {
    this.setState({ place: props });
  };

  loadWhereOptions = async ({ inputValue, callback, refetch }) => {
    const {
      data: { cities },
    } = await refetch({
      where: { name_contains: inputValue },
    });
    const options = cities.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
    callback(options);
  };

  loadOptions = async ({ inputValue, cityId, callback, refetch }) => {
    const cityFilter = cityId ? { city: cityId } : null;
    const {
      data: { categories, businesses },
    } = await refetch({
      whereBus: { name_contains: inputValue, ...cityFilter },
      whereCat: { name_contains: inputValue },
    });
    const options = categories
      .map(cat => ({ ...cat, type: 'category' }))
      .concat(businesses.map(bus => ({ ...bus, type: 'business' })))
      .map(({ id, name, slug, type }) => ({
        value: id,
        label: name,
        type,
        slug,
      }));
    callback(options);
  };

  render() {
    const { t, indexQuery } = this.props;
    const { cityId } = this.state;
    getLocation();
    return (
      <Layout title="Umawiaj Online">
        <QuickSearch>
          <Container>
            <SpecialistTitle>{t('Book with the bests')}</SpecialistTitle>
            <StyledForm>
              <Query query={GET_FILTERED_DATA} variables={{ name: '' }}>
                {({ loading, error, data, refetch }) => {
                  return (
                    <StyledAsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={(inputValue, callback) =>
                        this.loadOptions({
                          inputValue,
                          callback,
                          refetch,
                        })
                      }
                      onChange={this.searchValueChanged}
                      onInputChange={this.handleInputChange}
                      type="category"
                      placeholder={t('Service or Category')}
                    />
                  );
                }}
              </Query>
              <Query query={GET_FILTERED_CITIES} variables={{ name: '' }}>
                {({ loading, error, data, refetch }) => {
                  return (
                    <StyledAsyncSelect2
                      cacheOptions
                      loadOptions={(inputValue, callback) =>
                        this.loadWhereOptions({ inputValue, callback, refetch })
                      }
                      onChange={this.whereValueChanged}
                      onInputChange={this.handleInputWhereChange}
                      type="place"
                      placeholder={t('Location')}
                    />
                  );
                }}
              </Query>
              <QuickSearchSubmit
                onClick={this.submit}
                type="submit"
                variant="primary"
              >
                {t('Search')}
              </QuickSearchSubmit>
            </StyledForm>
          </Container>
        </QuickSearch>

        <Page>
          <Recommended>
            <Container>
              <Title>{t('The most popular')}</Title>
              <Row className="justify-content-md-start">
                {indexQuery.popularBusinesses &&
                  indexQuery.popularBusinesses.map(
                    ({
                      id,
                      name,
                      logo,
                      rating,
                      categories,
                      city,
                      street,
                      district,
                    }) => (
                      <StyledCol key={id}>
                        <Business>
                          <LogoImg>
                            <Link to={'/business?id=' + id}>
                              {logo ? (
                                <StyledCImg path={logo.hash + logo.ext} />
                              ) : (
                                <DefaultLogoImg />
                              )}
                            </Link>
                          </LogoImg>
                          <Subtitle>{name}</Subtitle>
                          <ExtraInfo>
                            {street} / {district && district.name} /{' '}
                            {city && city.name}
                          </ExtraInfo>
                          <Categories>
                            {categories &&
                              categories.map(({ id, name, slug }) => (
                                <LinkUnstyled
                                  to="uroda?query=Warszawa"
                                  key={id}
                                >
                                  {name}
                                </LinkUnstyled>
                              ))}
                          </Categories>
                          <StarList rate={rating} />
                        </Business>
                      </StyledCol>
                    ),
                  )}
              </Row>
            </Container>
          </Recommended>

          <Bests>
            <Container>
              <Title>{t('Recommended')}</Title>
              <Row className="justify-content-md-start">
                {indexQuery.recommendedBusinesses &&
                  indexQuery.recommendedBusinesses.map(
                    ({
                      id,
                      name,
                      logo,
                      rating,
                      categories,
                      city,
                      street,
                      district,
                    }) => (
                      <StyledCol key={id}>
                        <Business>
                          <LogoImg>
                            <Link to={'/business?id=' + id}>
                              {logo ? (
                                <StyledCImg path={logo.hash + logo.ext} />
                              ) : (
                                <DefaultLogoImg />
                              )}
                            </Link>
                          </LogoImg>
                          <Subtitle>{name}</Subtitle>
                          <ExtraInfo>
                            {street} / {district && district.name} /{' '}
                            {city && city.name}
                          </ExtraInfo>
                          <Categories>
                            {categories &&
                              categories.map(({ id, name, slug }) => (
                                <LinkUnstyled to={slug} key={id}>
                                  {name}
                                </LinkUnstyled>
                              ))}
                          </Categories>
                          <StarList rate={rating} />
                        </Business>
                      </StyledCol>
                    ),
                  )}
              </Row>
            </Container>
          </Bests>

          <br />

          {/* <GlobalStyle /> */}

          {/* <Container>
            <Row>
              <Col md={4}>
                <WelcomeBox>
                  <Col md={8}>{t('Online reservation 24/7')}</Col>
                </WelcomeBox>
                <WelcomeBox>
                  <Col md={8}>{t('Reservation reminder')}</Col>
                </WelcomeBox>
                <WelcomeBox>
                  <Col md={8}>{t('Client reviews')}</Col>
                </WelcomeBox>
              </Col>
              <Col md={8}>
                <WelcomeContent>{t('Welcome content')}</WelcomeContent>
              </Col>
            </Row>
          </Container> */}

          <br />
          <br />
          <CHeadline>{t('Why UmawiajOnline?')}</CHeadline>
          <Container>
            <Row>
              <Col sm="4">
                <BoxHeader>
                  {/* <BoxImage>
                    <img
                      src={AutomatyzacjaRezerwacji}
                      alt="Automatyzacja rezerwacji"
                    />
                  </BoxImage> */}
                  {t('Automatic reservation title')}
                </BoxHeader>
                <BoxContent>
                  {t('Automatic reservation description')}
                </BoxContent>
              </Col>
              <Col sm="4">
                <BoxHeader>
                  {/* <BoxImage>
                    <img src={Wizualizacja} alt="Wizualizacja" />
                  </BoxImage> */}
                  {t('Notify about every change title')}
                </BoxHeader>
                <BoxContent>
                  {t('Notify about every change description')}
                </BoxContent>
              </Col>
              <Col sm="4">
                <BoxHeader>
                  {/* <BoxImage>
                    <img src={Kalendarz} alt="Kalendarz" />
                  </BoxImage> */}
                  {t('Availability 24/7 title')}
                </BoxHeader>
                <BoxContent>{t('Availability 24/7 description')}</BoxContent>
              </Col>
            </Row>
          </Container>

          {/* <JoinUs onActionCall={this.openModal} /> */}

          <br />
          <br />
          <Container>
            <Row>
              <Col sm="4">
                <BoxHeader>
                  <BoxImage empty />
                  {t('Sell reports title')}
                </BoxHeader>
                <BoxContent>{t('Sell reports description')}</BoxContent>
              </Col>
              <Col sm="4">
                <BoxHeader>
                  <BoxImage empty />
                  {t('History of visits title')}
                </BoxHeader>
                <BoxContent>{t('History of visits description')}</BoxContent>
              </Col>
              <Col sm="4">
                <BoxHeader>
                  <BoxImage empty />
                  {t('Website title')}
                </BoxHeader>
                <BoxContent>{t('Website description')}</BoxContent>
              </Col>
            </Row>
            <Row>
              <Col sm="4">
                <BoxHeader>
                  <BoxImage empty />
                  {t('Customer acquisition title')}
                </BoxHeader>
                <BoxContent>{t('Customer acquisition description')}</BoxContent>
              </Col>
              <Col sm="4">
                <BoxHeader>
                  <BoxImage empty />
                  {t('Notifies title')}
                </BoxHeader>
                <BoxContent>{t('Notifies description')}</BoxContent>
              </Col>
              <Col sm="4">
                <BoxHeader>
                  <BoxImage empty />
                  {t('Payment title')}
                </BoxHeader>
                <BoxContent>{t('Payment description')}</BoxContent>
              </Col>
            </Row>
          </Container>
          <br />
          <br />
        </Page>
      </Layout>
    );
  }
}

export default graphql(INDEX_QUERY, { name: 'indexQuery' })(
  withTranslation('homePage')(IndexPage),
);
