import * as React from 'react';
import styled from 'styled-components';
import Img from 'gatsby-image';
import { Link } from 'gatsby';
import { compose, graphql } from 'react-apollo';
import Slider from 'react-slick';
import Layout, { withLayout } from '../_Components/Layout';
import { Col, Container, Row } from 'react-bootstrap';
import { H1, H2, H3, H4 } from '../_Components/Text/CHeadline';
import CButton from '../_Components/Fields/CButton';
import CAddress from '../_Components/Text/CAddress';
import ListUnstyled from './cat';
import StarList from '../_Components/Fields/StarList';
import CImg from '../_Components/CImg/CImg';
import { withBusinessLayout } from '../_Components/BusinessLayout';
import gql from 'graphql-tag';
import { withTranslation } from 'react-i18next';
import { parseQuery } from '../_Components/utils/parseQuery';
import ServiceDialog from './Cat/ServiceDialog';
import * as moment from 'moment';
import { Button } from '@material-ui/core';
import { CImages } from '../assets/img';
import DefaultLogoImg from '../_Components/CImg/DefaultLogoImg';

const DivP = styled.div`
  text-align: justify;
`;

const Header = styled.div`
  width: 100%;
  height: 300px;
  overflow: hidden;
  background:  #908e92 url('${({ path }) => path}') no-repeat 50% 50%;
`;

const BgImg = styled(Img)`
  object-fit: cover;
  position: absolute !important;
  height: 100%;
  top: 0;
  left: -60px;
  right: -60px;
`;

const StyledH1 = styled(H1)`
  position: relative;
  color: #fff;
  line-height: 1.2;
`;

const HeaderContainer = styled(Container)`
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
`;

const CenterCol = styled(Col)`
  display: flex;
  align-items: center;
`;

const SliderWrapper = styled.div`
  max-width: 400px;
  margin: 40px auto 0;
`;

const SliderImage = styled(CImg)`
  width: 100%;
  height: 100%;
  border: 5px solid #ededed;
  object-fit: contain;
`;

const UPDATE_BUSINESS = gql`
  mutation($input: updateBusinessInput) {
    updateBusiness(input: $input) {
      business {
        id
        name
      }
    }
  }
`;

const GET_BUSINESS = gql`
  query BusinessQuery($id: ID!) {
    business(id: $id) {
      id
      name
      about
      frequency
      how_it_works
      rating
      workdays_open_hour
      workdays_close_hour
      saturday_open
      saturday_open_hour
      saturday_close_hour
      sunday_open
      sunday_open_hour
      sunday_close_hour
      phone_number
      phone_views
      owner {
        id
      }
      city {
        id
        name
      }
      district {
        id
        name
      }
      street
      categories {
        id
        name
      }
      bg_image {
        id
        hash
        ext
      }
      gallery {
        id
        hash
        ext
      }
      logo {
        id
        hash
        ext
      }
    }
  }
`;

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const renderBusiness = (
  business,
  t,
  { dialogActive, onReservation, onClose, phoneHidden, onShowPhone },
) => {
  const {
    name,
    about,
    how_it_works,
    categories,
    city,
    rating,
    street,
    district,
    bg_image,
    logo,
    gallery,
    workdays_open_hour,
    workdays_close_hour,
    saturday_open,
    saturday_open_hour,
    saturday_close_hour,
    sunday_open,
    sunday_open_hour,
    sunday_close_hour,
    phone_number,
  } = business;
  return (
    <React.Fragment>
      <Header
        path={
          bg_image
            ? process.env.CDN_URL + '/' + bg_image.hash + bg_image.ext
            : CImages.business.defaultCover
        }
      >
        <HeaderContainer>
          <Row>
            <Col>
              {/* {categories &&
                categories.map(({ id, name }) => (
                  <StyledH1 key={id}>{name}</StyledH1>
                ))} */}
              <StyledH1>{name}</StyledH1>
            </Col>
            <CenterCol sm="auto">
              <CButton onClick={onReservation}>
                {t('Online reservation')}
              </CButton>
            </CenterCol>
          </Row>
        </HeaderContainer>
      </Header>
      <br />
      <br />
      <Container>
        <Row>
          <Col md={8}>
            <H3 id="o-nas">{t('About')}</H3>
            <div>{about}</div>
            <br />
            <br />
            <br />
            <H3 id="czym-sie-zajmujemy">{t('How it works')}</H3>
            {/* <div>{how_it_works}</div> */}
            <DivP> {how_it_works} </DivP>
            {gallery && (
              <SliderWrapper>
                <Slider {...settings}>
                  {gallery.map(img => (
                    <SliderImage path={img.hash + img.ext} />
                  ))}
                </Slider>
              </SliderWrapper>
            )}
          </Col>
          <Col md={4}>
            <H3>{name}</H3>
            <CAddress>
              {city && city.name} / {street} / {district && district.name}
            </CAddress>
            {categories &&
              categories.map(({ id, name }) => <div key={id}>{name}</div>)}
            <StarList rate={rating} />
            <br />
            <br />
            {logo ? <CImg path={logo.hash + logo.ext} /> : <DefaultLogoImg />}
            <br />
            <br />
            <div>
              Godziny otwarcia:
              <br />
              Pon-Pt Od {moment(workdays_open_hour).format('HH:mm')} do{' '}
              {moment(workdays_close_hour).format('HH:mm')}
              <br />
              Sobota:{' '}
              {saturday_open ? (
                <React.Fragment>
                  Od {moment(saturday_open_hour).format('HH:mm')} do{' '}
                  {moment(saturday_close_hour).format('HH:mm')}
                </React.Fragment>
              ) : (
                'Zamknięte'
              )}
              <br />
              Niedziela:{' '}
              {sunday_open ? (
                <React.Fragment>
                  Od {moment(sunday_open_hour).format('HH:mm')} do{' '}
                  {moment(sunday_close_hour).format('HH:mm')}
                </React.Fragment>
              ) : (
                'Zamknięte'
              )}
            </div>
            <br />
            <br />
            <div>
              Numer telefonu:&nbsp;
              {phoneHidden ? (
                <Button onClick={onShowPhone}>Odkryj</Button>
              ) : (
                phone_number
              )}
            </div>
          </Col>
        </Row>
      </Container>
      <ServiceDialog onClose={onClose} active={dialogActive} {...business} />
    </React.Fragment>
  );
};

class Business extends React.Component {
  state = {
    dialogActive: false,
    phoneHidden: true,
  };

  onReservation = () => {
    this.setState({ dialogActive: true });
  };

  onClose = () => {
    this.setState({ dialogActive: false });
  };

  onShowPhone = () => {
    const {
      updateBusiness,
      getBusiness: {
        business: { id, phone_views },
      },
    } = this.props;
    updateBusiness({
      variables: {
        input: { data: { phone_views: phone_views + 1 }, where: { id } },
      },
    });
    this.setState({ phoneHidden: false });
  };

  render() {
    const { getBusiness, t } = this.props;

    return (
      <div>
        {getBusiness.business &&
          renderBusiness(getBusiness.business, t, {
            onClose: this.onClose,
            onReservation: this.onReservation,
            onShowPhone: this.onShowPhone,
            dialogActive: this.state.dialogActive,
            phoneHidden: this.state.phoneHidden,
          })}
      </div>
    );
  }
}

export default compose(
  graphql(GET_BUSINESS, {
    name: 'getBusiness',
    options: props => {
      const query = parseQuery(props.location.search);
      return { variables: { id: query.id } };
    },
  }),
  graphql(UPDATE_BUSINESS, {
    name: 'updateBusiness',
  }),
)(withTranslation('business')(withBusinessLayout(Business)));
