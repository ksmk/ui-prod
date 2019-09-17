import { Col, FormGroup, Row } from 'react-bootstrap';
import { toastr } from 'react-redux-toastr';
import * as React from 'react';
import { compose } from 'react-apollo';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import CDialog from '../../_Components/Panel/CDialog';
import IconReservation from '../../assets/img/icon-reservation.png';
import { H3, H4 } from '../../_Components/Text/CHeadline';
import styled from 'styled-components';
// import ServiceInfo from '../../_Components/Panel/ServiceInfo';
import CButton from '../../_Components/Fields/CButton';
import CLink from './SingleItem';
import Calendar from '../../_Components/Calendar';
import { getTokenId } from '../../_Components/utils/getToken';
import { registration } from '../../_Resources/Auth/Actions/registration';
import { setRegistrationDialogActive } from '../../_Resources/Auth/Actions/setRegistrationDialogActive';
import { connect } from 'react-redux';
import { login } from '../../_Resources/Auth/Actions/login';
import { setLoginDialogActive } from '../../_Resources/Auth/Actions/setLoginDialogActive';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { parseQuery } from '../../_Components/utils/parseQuery';
import business from '../business';
import * as moment from 'moment';

const ServicesList = styled.ul`
  list-style: none;
  padding: 30px 40px;
  margin: 0;
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

const StyledCDialog = styled(CDialog)`
  & > .modal-dialog > .modal-content {
    padding: 0 !important;
    width: 100% !important;

    & > .modal-body {
      padding: 0 !important;
    }
  }

  @media (min-width: 800px) {
    & > .modal-dialog > .modal-content {
      width: 800px !important;
    }
  }
`;

const Header = styled.div`
  background-color: #828a9d;
  width: 100%;
  padding: 30px 35px;
  color: #fff;
`;

const Body = styled.div``;

const Close = styled.div`
  position: absolute;
  right: 20px;
  cursor: pointer;
  top: 10px;
  color: #fff;
`;

const ListServices = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  padding: 20px;
  width: 100%;
  justify-content: space-between;

  @media (min-width: 800px) {
    flex-direction: row;
  }
`;

const ServiceInfo = styled.div`
  max-width: 100%;

  @media (min-width: 800px) {
    max-width: 50%;
  }
`;

const Price = styled.div`
  padding: 20px 30px;

  @media (min-width: 800px) {
    padding: 0 30px;
  }
`;

const Desc = styled.div`
  font-size: 1rem;
  text-align: left;
  padding-bottom: 1.5rem;
  padding-left: 1rem;
`;

const STEPS = {
  FIRST: 'step1',
  SECOND: 'step2',
  THIRD: 'step3',
};

const SAVE_CALENDAR_EVENT = gql`
  mutation($input: createCalendareventInput) {
    createCalendarevent(input: $input) {
      calendarevent {
        id
        start_date
        end_date
      }
    }
  }
`;

const SAVE_ORDER = gql`
  mutation($input: createOrderInput) {
    createOrder(input: $input) {
      order {
        id
        name
      }
    }
  }
`;

const GET_EVENTS = gql`
  query EventsQuery($id: ID!) {
    business(id: $id) {
      id
      name
      frequency
      servicedetails {
        id
        price
        duration
        description
        name
      }
      owner {
        id
      }
      providers {
        id
        name
        calendarevents {
          id
          name
          type
          start_date
          end_date
        }
      }
    }
  }
`;

class ServiceDialog extends React.Component {
  constructor(args) {
    super(args);
    this.state = {
      dialogActive: false,
      step: STEPS.FIRST,
      event: null,
      selectedServiceDetail: null,
      selectedPaymethod: null,
      events: [],
    };
  }

  getBusiness = () => {
    const {
      getEvents: { business },
    } = this.props;
    return business || {};
  };

  getServiceDetails = () => {
    const { servicedetails } = this.getBusiness();
    return servicedetails || [];
  };

  getProviders = () => {
    const { providers } = this.getBusiness();
    return providers || [];
  };

  componentDidUpdate(prevProps) {
    const {
      dispatchOpenLoginDialog,
      onClose,
      active,
      serviceDetail,
    } = this.props;
    const userLogged = !!getTokenId();
    if (!userLogged && active) {
      dispatchOpenLoginDialog();
      onClose();
    }

    if (this.props.active !== prevProps.active) {
      console.warn(serviceDetail);
      this.setState({
        step: !serviceDetail ? STEPS.FIRST : STEPS.SECOND,
        selectedServiceDetail: serviceDetail,
      });
    }
  }

  setServiceDetail = selectedServiceDetail => {
    this.setState({ selectedServiceDetail });
    const providers = this.getProviders();
    const events = providers
      .map(provider =>
        provider.calendarevents.map(
          ({ id, name, start_date, end_date, type }) => ({
            id,
            title:
              name ||
              (type === 'order'
                ? 'Zamówienie'
                : type === 'private'
                ? 'Prywatne'
                : 'Wakacje'),
            start: new Date(new Date(start_date).getTime() + this.offset),
            end: new Date(new Date(end_date).getTime() + this.offset),
            resourceId: provider.id,
          }),
        ),
      )
      .reduce(function(pre, cur) {
        return pre.concat(cur);
      });

    this.setState({ events });
  };

  setStep = step => this.setState({ step });

  setStepTwo = selectedServiceDetail => {
    this.setServiceDetail(selectedServiceDetail);
    this.setStep(STEPS.SECOND);
  };

  offset = new Date().getTimezoneOffset() * 60000;

  addOffset = date => new Date(new Date(date).getTime() + this.offset);

  setEvent = event => {
    this.setState({
      event: {
        ...event,
        start: moment(event.start).format('YYYY-MM-DD HH:mm'),
        end: moment(event.end).format('YYYY-MM-DD HH:mm'),
      },
    });
  };

  reserve = () => {
    const {
      onClose,
      saveOrder,
      saveCalendarEvent,
      owner,
      vehicle_registration_number,
    } = this.props;
    const { event } = this.state;
    if (!event) {
      toastr.error('Oznacz w kalendarzu termin swojej rezerwacji');
      return false;
    }
    saveCalendarEvent({
      variables: {
        input: {
          data: {
            provider: event.resourceId,
            start_date: event.start,
            end_date: event.end,
            owner: owner && owner.id,
            name: vehicle_registration_number,
            type: 'order',
          },
        },
      },
    }).then(({ data: { createCalendarevent: { calendarevent } } }) => {
      saveOrder({
        variables: {
          input: {
            data: {
              name: event.title,
              calendarevent: calendarevent.id,
              servicedetail: this.state.selectedServiceDetail.id,
              user: getTokenId(),
              business: this.props.id,
              status: 'nieoplacone',
              price: this.state.selectedServiceDetail.price,
              paymethod: this.state.selectedPaymethod,
              order_date: moment().format('YYYY-MM-DD HH:mm'),
              owner: owner && owner.id,
            },
          },
        },
      }).then(
        ({ data }) => {
          this.props.getEvents.refetch();

          if (this.state.selectedPaymethod === 'payu') {
            fetch(`${process.env.HOST}/payment`, {
              method: 'post',
              body: JSON.stringify({
                price: this.state.selectedServiceDetail.price,
                extOrderId: data.createOrder.order.id,
              }),
            })
              .then(response => response.json())
              .then(data => data && window.open(data.url, '_blank'));
          }
          toastr.success('Rezerwacja dodana! Dziękujemy.');
          onClose();
        },
        error => toastr.error('Wystąpił błąd przy zapisie rezerwacji'),
      );
    });
  };

  options = {
    [STEPS.FIRST]: () => {
      const { rating, name, categories, city, street, district } = this.props;
      return (
        <React.Fragment>
          <Header>
            <H3 className="text-left">Rezerwujesz usługę w: {name}</H3>
            <Row>
              <Col sm={2} />
              <Col className="text-left">
                <ServiceInfo
                  color="#fff"
                  name={name}
                  rating={rating}
                  categories={categories}
                  city={city}
                  street={street}
                  district={district}
                />
              </Col>
            </Row>
          </Header>
          {this.getServiceDetails().map(serviceDetail => {
            const {
              id,
              // service,
              name,
              description,
              price,
              duration,
            } = serviceDetail;
            return (
              <React.Fragment>
                <ListServices key={id}>
                  <ServiceInfo>
                    {/*<H4>{service.name}</H4>*/}
                    <H4>{name}</H4>
                  </ServiceInfo>
                  <Price>
                    <div>
                      <strong>{price} zł</strong>
                    </div>
                    ({duration} min)
                  </Price>
                  <CButton onClick={() => this.setStepTwo(serviceDetail)}>
                    Zarezerwuj
                  </CButton>
                </ListServices>

                <Desc>{description}</Desc>
              </React.Fragment>
            );
          })}
        </React.Fragment>
      );
    },
    [STEPS.SECOND]: () => {
      const {
        frequency,
        active,
        workdays_open_hour,
        workdays_close_hour,
      } = this.props;
      const { events, selectedServiceDetail } = this.state;
      return (
        <React.Fragment>
          <Calendar
            onEvent={this.setEvent}
            events={events}
            providers={this.getProviders()}
            openHour={this.addOffset(workdays_open_hour)}
            closeHour={this.addOffset(workdays_close_hour)}
            frequency={selectedServiceDetail.duration || 30}
            active={active}
            duration={selectedServiceDetail.duration}
          />
          <CButton
            onClick={() => !!this.state.event && this.setStep(STEPS.THIRD)}
          >
            Rezerwacja
          </CButton>
          <br />
          <br />
        </React.Fragment>
      );
    },
    [STEPS.THIRD]: () => {
      const { selectedPaymethod } = this.state;
      return (
        <React.Fragment>
          <br />
          <br />
          <FormGroup>
            <FormControl component="fieldset">
              <FormLabel component="legend">Wybierz opcję</FormLabel>
              <RadioGroup
                aria-label="admin-layout"
                name="paymethod"
                onChange={this.paymethodChange}
                value={selectedPaymethod}
              >
                <FormControlLabel
                  value="payu"
                  control={<Radio color="primary" />}
                  label="Opłać usługę z góry - Payu"
                />
                <FormControlLabel
                  value="gotowka"
                  control={<Radio color="primary" />}
                  label="Płatność na miejscu po wykonaniu usługi - gotówka"
                />
              </RadioGroup>
            </FormControl>
          </FormGroup>
          <CButton onClick={() => this.reserve()}>Rezerwacja</CButton>
          <br />
          <br />
        </React.Fragment>
      );
    },
  };

  paymethodChange = e => this.setState({ selectedPaymethod: e.target.value });

  render() {
    const { active, onClose } = this.props;
    const { step } = this.state;
    return (
      <StyledCDialog active={active} onClose={onClose}>
        <Close onClick={onClose}>x</Close>
        <Body>{this.options[step]()}</Body>
      </StyledCDialog>
    );
  }
}

const mapStateToProps = ({ auth: { vehicle_registration_number } }) => ({
  vehicle_registration_number,
});

const mapDispatchToProps = dispatch => ({
  dispatchOpenLoginDialog: () => {
    dispatch(setLoginDialogActive({ isActive: true }));
  },
});

export default compose(
  graphql(GET_EVENTS, {
    name: 'getEvents',
    options: ({ id }) => {
      return { variables: { id } };
    },
  }),
  graphql(SAVE_CALENDAR_EVENT, { name: 'saveCalendarEvent' }),
  graphql(SAVE_ORDER, { name: 'saveOrder' }),
)(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ServiceDialog),
);
