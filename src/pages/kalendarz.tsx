import * as React from 'react';
import UserLayout from '../_Components/Layout/UserLayout/UserLayout';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import { withTranslation } from 'react-i18next';
import styled from 'styled-components';
import { connect } from 'react-redux';
import * as moment from 'moment';
import '../_Utils/momentPl';
import CTitle from '../_Components/Text/CTitle';
import '../_Components/css/Calendar.css';
import BigCalendar from 'react-big-calendar';
import localizer from 'react-big-calendar/lib/localizers/globalize';
import globalize from 'globalize';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss';
import { toastr } from 'react-redux-toastr';

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

interface IProps {}

const CALENDAR_QUERY = gql`
  query CatQuery($where: JSON) {
    businesses(where: $where) {
      id
      name
      frequency
      workdays_open_hour
      workdays_close_hour

      providers {
        id
        name
        business {
          id
        }
        calendarevents {
          id
          name
          type
          start_date
          end_date
          owner {
            vehicle_registration_number
          }
        }
      }
    }
    cities {
      id
      name
    }
  }
`;

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

const UPDATE_CALENDAR_EVENT = gql`
  mutation($input: updateCalendareventInput) {
    updateCalendarevent(input: $input) {
      calendarevent {
        id
        start_date
        end_date
      }
    }
  }
`;

const DELETE_CALENDAR_EVENT = gql`
  mutation($input: deleteCalendareventInput) {
    deleteCalendarevent(input: $input) {
      calendarevent {
        start_date
      }
    }
  }
`;

const Wrapper = styled.div``;

const messages = {
  allDay: 'Cały dzień',
  previous: '<',
  next: '>',
  today: 'Dziś',
  month: 'Miesiąc',
  week: 'Tydzień',
  work_week: 'Tydzień',
  day: 'Dzień',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Czas',
  event: 'Rezerwacja',
  showMore: total => `+ Zobacz więcej (${total})`,
};

const Remove = styled.span`
  color: #ff0000;
  font-weight: 700;
  padding-left: 10px;
`;

const MyEvent = ({ event, title }) => (
  <div>
    <span onClick={() => event.onSetTitle(event.id)}>{title}</span>
    <Remove onClick={() => event.onRemove(event.id)}>Usuń</Remove>
  </div>
);

class Kalendarz extends React.Component<IProps> {
  private loadDataInterval: number;
  private alreadySet = false;

  constructor(props) {
    super(props);
    this.state = {
      events: [],
      event: null,
    };
  }

  loadData = () => {
    const { calendarQuery } = this.props;
    calendarQuery.refetch();
  };

  componentDidMount() {
    this.loadDataInterval = setInterval(this.loadData, 6000);
  }

  componentDidUpdate(prevProps) {
    if (
      this.alreadySet &&
      prevProps.calendarQuery !== this.props.calendarQuery
    ) {
      const { calendarQuery } = prevProps;
      const businesses = (calendarQuery && calendarQuery.businesses) || [];
      const ids = businesses.map(({ providers }) =>
        providers.map(({ calendarevents }) =>
          calendarevents.map(({ id }) => id),
        ),
      );
      const mergedIds = [].concat.apply([], ...ids);
      this.props.calendarQuery.businesses &&
        this.props.calendarQuery.businesses.forEach(({ providers }) =>
          providers.forEach(({ calendarevents }) =>
            calendarevents.forEach(({ id, start_date, end_date }) => {
              if (mergedIds.indexOf(id) === -1) {
                toastr.success(
                  `Nowe wpis o id: ${id}!`,
                  `Od: ${moment(this.addOffset(start_date)).format(
                    'YYYY-MM-DD HH:mm',
                  )} do Od: ${moment(this.addOffset(end_date)).format(
                    'YYYY-MM-DD HH:mm',
                  )}`,
                  {
                    timeOut: 0,
                  },
                );
              }
            }),
          ),
        );
    }
    if (
      prevProps.calendarQuery.businesses !== this.props.calendarQuery.businesses
    ) {
      this.alreadySet = true;
    }
  }

  componentWillUnmount() {
    clearInterval(this.loadDataInterval);
  }

  updateEvent = (id, data) => {
    const { updateCalendarEvent, calendarQuery } = this.props;
    updateCalendarEvent({
      variables: {
        input: {
          data,
          where: {
            id,
          },
        },
      },
    }).then(({ data }) => {
      calendarQuery.refetch();
    });
  };

  formatDate = date => moment(date).format('YYYY-MM-DD HH:mm');

  moveEvent = ({
    event,
    start,
    end,
    resourceId,
    isAllDay: droppedOnAllDaySlot,
  }) => {
    // const event = this.findItem(itemId, group);
    if (event) {
      this.updateEvent(event.id, {
        start_date: this.formatDate(start),
        end_date: this.formatDate(end),
        provider: resourceId,
      });
    }
  };

  setEventTitle = itemId => {
    const name = prompt('Please enter event name', 'Private');

    if (name && name.trim() !== '') {
      this.updateEvent(itemId, { name });
    }
  };

  resizeEvent = ({ event, start, end, resourceId }) => {
    this.updateEvent(event.id, {
      start_date: this.formatDate(start),
      end_date: this.formatDate(end),
    });
  };

  newEvent = event => {
    const { saveCalendarEvent, calendarQuery } = this.props;
    const start_date = this.formatDate(event.start);
    const end_date = this.formatDate(moment(event.end).add(55, 'minutes'));

    saveCalendarEvent({
      variables: {
        input: {
          data: {
            start_date,
            end_date,
            provider: event.resourceId,
            type: 'private',
          },
        },
      },
    }).then(({ data }) => {
      calendarQuery.refetch();
    });
  };

  removeEvent = itemId => {
    if (confirm('Are you sure you want to remove?')) {
      const { deleteCalendarEvent, calendarQuery } = this.props;
      deleteCalendarEvent({
        variables: {
          input: {
            where: {
              id: itemId,
            },
          },
        },
      }).then(res => {
        calendarQuery.refetch();
      });
    } else {
    }
  };

  offset = new Date().getTimezoneOffset() * 60000;

  setEventTitle = itemId => {
    const name = prompt('Please enter event name', 'Private');

    if (name && name.trim() !== '') {
      this.updateEvent(itemId, { name });
    }
  };

  removeEvent = itemId => {
    if (confirm('Are you sure you want to remove?')) {
      const { deleteCalendarEvent, calendarQuery } = this.props;
      deleteCalendarEvent({
        variables: {
          input: {
            where: {
              id: itemId,
            },
          },
        },
      }).then(res => {
        calendarQuery.refetch();
      });
    } else {
    }
  };

  static defaultProps = {
    startAccessor: 'start',
    endAccessor: 'end',
    timeZoneName: 'Poland/Warsaw',
  };

  addOffset = date => {
    const dt = new Date(date);
    dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
    return dt;
  };

  startAccessor = event => {
    return new Date(new Date(event.start).getTime() + this.offset);
  };

  endAccessor = event => {
    return new Date(new Date(event.end).getTime() + this.offset);
  };

  render() {
    const { calendarQuery } = this.props;
    const businesses = (calendarQuery && calendarQuery.businesses) || [];

    return (
      <UserLayout>
        <Wrapper>
          {businesses.map(
            ({
              id,
              name,
              frequency,
              workdays_open_hour,
              workdays_close_hour,
              providers,
            }) => {
              const resourceMap = providers.map(({ id, name }) => ({
                resourceId: id,
                resourceTitle: name,
              }));

              const events = providers
                .map(provider =>
                  provider.calendarevents.map(
                    ({ id, name, start_date, end_date, type, owner }) => ({
                      id,
                      title:
                        name ||
                        (type === 'order'
                          ? `${owner &&
                              owner.vehicle_registration_number} - Zamówienie`
                          : type === 'private'
                          ? 'Prywatne'
                          : 'Wakacje'),
                      start: new Date(start_date),
                      end: new Date(end_date),
                      resourceId: provider.id,
                      onSetTitle: this.setEventTitle,
                      onRemove: this.removeEvent,
                    }),
                  ),
                )
                .reduce(function(pre, cur) {
                  return pre.concat(cur);
                });

              return (
                <div>
                  <br />
                  <CTitle>{name}</CTitle>
                  <br />
                  <DragAndDropCalendar
                    startAccessor={this.startAccessor}
                    endAccessor={this.endAccessor}
                    localizer={localizer(globalize)}
                    events={events}
                    components={{
                      event: MyEvent,
                    }}
                    selectable
                    resizable
                    step={5}
                    timeslots={6}
                    defaultView={BigCalendar.Views.DAY}
                    views={['day', 'work_week']}
                    defaultDate={new Date()}
                    onEventDrop={this.moveEvent}
                    onEventResize={this.resizeEvent}
                    onSelectSlot={this.newEvent}
                    showMultiDayTimes={false}
                    min={
                      this.addOffset(workdays_open_hour) ||
                      new Date(2018, 10, 0, 6, 0, 0)
                    }
                    max={
                      this.addOffset(workdays_close_hour) ||
                      new Date(2018, 10, 0, 22, 0, 0)
                    }
                    messages={messages}
                    resources={resourceMap}
                    resourceIdAccessor="resourceId"
                    resourceTitleAccessor="resourceTitle"
                  />
                </div>
              );
            },
          )}
        </Wrapper>
      </UserLayout>
    );
  }
}

const mapStateToProps = ({ auth: { user } }) => ({ user });

export default connect(
  mapStateToProps,
  null,
)(
  compose(
    graphql(DELETE_CALENDAR_EVENT, { name: 'deleteCalendarEvent' }),
    graphql(CALENDAR_QUERY, {
      name: 'calendarQuery',
      options: props => ({
        variables: { where: { owner: props.user ? props.user.id : -1 } },
      }),
    }),
    graphql(SAVE_CALENDAR_EVENT, { name: 'saveCalendarEvent' }),
    graphql(UPDATE_CALENDAR_EVENT, { name: 'updateCalendarEvent' }),
  )(withTranslation('headerMenu')(Kalendarz)),
);
