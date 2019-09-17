import { Link } from 'gatsby';
import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import styled from 'styled-components';
import Img from 'gatsby-image';
import CLink from '../../_Components/Text/CLink';
import ServiceInfo from '../../_Components/Panel/ServiceInfo';
import CButtonOutlined from '../../_Components/Fields/CButtonOutlined';
import CButton from '../../_Components/Fields/CButton';
import ServiceDialog from './ServiceDialog';
import IconInfo from '../../assets/img/icon-info.png';
import CImg from '../../_Components/CImg/CImg';
import Calendar from '../../_Components/Calendar';
import { withTranslation } from 'react-i18next';
import DefaultLogoImg from '../../_Components/CImg/DefaultLogoImg';

const ServicesList = styled.ul`
  list-style: none;
  padding: 30px 40px;
  margin: 30px 0 0 0;
  background: #f8f8f8; /* Old browsers */
  background: -moz-linear-gradient(
    top,
    #f8f8f8 0%,
    #ffffff 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    top,
    #f8f8f8 0%,
    #ffffff 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to bottom,
    #f8f8f8 0%,
    #ffffff 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f8f8f8', endColorstr='#ffffff',GradientType=0 ); /* IE6-9 */
`;

const InfoRow = styled(Row)`
  margin: 22px 0;
`;

const LogoImg = styled(CImg)`
  max-width: 100%;
  border: 5px solid #ededed;
  border-radius: 8px;
`;

const Wrapper = styled.div`
  padding-bottom: 30px;
  border-bottom: 2px solid #ededed;
`;

class SingleItem extends React.Component {
  state = {
    dialogActive: false,
    selectedServiceDetail: null,
  };

  onReservationService = serviceDetail => {
    this.setState({ dialogActive: true, selectedServiceDetail: serviceDetail });
  };

  onReservation = () => {
    this.setState({ dialogActive: true, selectedServiceDetail: null });
  };

  onClose = () => this.setState({ dialogActive: false });

  render() {
    const {
      id,
      name,
      rating,
      city,
      street,
      district,
      logo,
      servicedetails,
      categories,
      t,
    } = this.props;
    const { dialogActive, selectedServiceDetail } = this.state;

    return (
      <Wrapper>
        <br />
        <br />
        <Row>
          <Col sm={4}>
            <Link to={'/business?id=' + id}>
              {logo ? (
                <LogoImg path={logo.hash + logo.ext} />
              ) : (
                <DefaultLogoImg />
              )}
            </Link>
          </Col>
          <Col sm={8}>
            <ServiceInfo
              name={name}
              rating={rating}
              categories={categories}
              city={city}
              street={street}
              district={district}
            />
            <br />
            <CButton onClick={this.onReservation}>{t('Book now')}</CButton>
          </Col>
        </Row>
        {/*<InfoRow>*/}
        {/*<Col sm="auto">*/}
        {/*<img src={IconInfo} alt="" />*/}
        {/*</Col>*/}
        {/*<Col>*/}
        {/*Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam a*/}
        {/*tempor turpis. Etiam sit amet turpis obortis, porttitor mi sed,*/}
        {/*ullamcorper.*/}
        {/*</Col>*/}
        {/*</InfoRow>*/}
        <ServicesList>
          {servicedetails &&
            servicedetails.map(serviceDetail => {
              const { id, name } = serviceDetail;
              return (
                <li key={id}>
                  <Row>
                    {/*<Col>{service && service.name}</Col>*/}
                    <Col>{name}</Col>
                    <Col sm="auto">
                      <CLink
                        mode="bold"
                        onClick={() => this.onReservationService(serviceDetail)}
                      >
                        Zarezerwuj
                      </CLink>
                    </Col>
                  </Row>
                </li>
              );
            })}
        </ServicesList>
        <br />
        {servicedetails && servicedetails.length > 4 && (
          <CButtonOutlined>
            <Link to={'/business?id=' + id}>{t('Show all services')}</Link>
          </CButtonOutlined>
        )}
        <ServiceDialog
          onClose={this.onClose}
          active={dialogActive}
          serviceDetail={selectedServiceDetail}
          {...this.props}
        />
      </Wrapper>
    );
  }
}

export default withTranslation('category')(SingleItem);
