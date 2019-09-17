import React from 'react';
import * as moment from 'moment';
import 'moment/locale/pl';
import BigCalendar from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop/index';
import './css/Calendar.css';

import { toastr } from 'react-redux-toastr';
import createSlot from 'react-tackle-box/Slot';
import styled from 'styled-components';
const ExampleControlSlot = createSlot;

const Wrapper = styled.div`
  padding: 1rem;
`;

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

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

class Calendar extends React.Component {
  constructor(args) {
    super(args);
    this.state = {
      events: this.prepareEv(this.props.events),
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.events !== this.props.events) {
      this.setState({ events: this.prepareEv(this.props.events) });
    }
  }

  prepareEv = events => {
    return events && events.map(event => ({ ...event, title: 'Zajęte' }));
  };

  isBetween = (date, selectedResourceId) => {
    return !!this.state.events
      .filter(
        ({ resourceId, newReservation }) =>
          resourceId === selectedResourceId && !newReservation,
      )
      .find(({ start, end }) => {
        return moment(date)
          .startOf('minute')
          .isBetween(
            moment(start).startOf('minute'),
            moment(end).startOf('minute'),
            'minutes',
            '[]',
          );
      });
  };

  moveEvent = ({
    event,
    start,
    end,
    resourceId,
    isAllDay: droppedOnAllDaySlot,
  }) => {
    const { events } = this.state;
    const { onEvent } = this.props;
    if (!event.newReservation) {
      toastr.error('Nie możesz modyfikować istniejących rezerwacji');
      return false;
    }

    if (this.isBetween(start, resourceId) || this.isBetween(end, resourceId)) {
      toastr.error('Data nie może nachodzić na już istniejące rezerwacje');
      return false;
    }

    if (
      moment()
        .startOf('minute')
        .isAfter(moment(start).startOf('minute'))
    ) {
      toastr.error('Wybrana godzina już minęła. Wybierz inny termin.');
      return false;
    }

    const idx = events.indexOf(event);
    let allDay = event.allDay;

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true;
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false;
    }

    const updatedEvent = { ...event, start, end, allDay, resourceId };

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    this.setState({
      events: nextEvents,
    });
    onEvent(event);

    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  };

  resizeEvent = ({ event, start, end, resourceId }) => {
    const { events } = this.state;
    const { onEvent } = this.props;
    if (!event.newReservation) {
      toastr.error('Nie możesz modyfikować istniejących rezerwacji');
      return false;
    }

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end, resourceId }
        : existingEvent;
    });

    this.setState({
      events: nextEvents,
    });
    onEvent(event);

    //alert(`${event.title} was resized to ${start}-${end}`)
  };

  newEvent = event => {
    const { onEvent, duration, resourceMap } = this.props;
    const { events } = this.state;
    const reservationAdded = events.find(
      ({ newReservation }) => newReservation,
    );
    const eventEnd = new Date(+event.start + duration * 60 * 1000);

    if (
      this.isBetween(event.start, event.resourceId) ||
      this.isBetween(eventEnd, event.resourceId)
    ) {
      toastr.error('Data nie może nachodzić na już istniejące rezerwacje');
      return false;
    }

    if (
      moment()
        .startOf('minute')
        .isAfter(moment(event.start).startOf('minute'))
    ) {
      toastr.error('Wybrana godzina już minęła. Wybierz inny termin.');
      return false;
    }

    if (event.action === 'select') {
      return false;
    }
    if (reservationAdded) {
      toastr.error('Rezerwacja została nadpisana');
      return this.resizeEvent({
        event: reservationAdded,
        start: event.start,
        end: eventEnd,
        resourceId: event.resourceId,
      });
    }

    const idList = events.map(a => a.id);
    const newId = Math.max(...idList) + 1;
    const hour = {
      id: newId,
      title: 'Moja rezerwacja',
      start: event.start,
      end: eventEnd,
      resourceId: event.resourceId,
      newReservation: true,
    };
    this.setState({
      events: [...events, hour],
    });
    onEvent(hour);

    toastr.success('Dodano rezerwacje');
  };

  render() {
    const { events } = this.state;
    const { frequency, openHour, closeHour, providers } = this.props;

    const resourceMap = providers.map(({ id, name }) => ({
      resourceId: id,
      resourceTitle: name,
    }));

    return (
      <Wrapper>
        <DragAndDropCalendar
          events={events}
          localizer={BigCalendar.momentLocalizer(moment)}
          defaultView={BigCalendar.Views.DAY}
          views={['day', 'work_week']}
          step={5}
          timeslots={6}
          defaultDate={new Date()}
          selectable="ignoreEvents"
          onEventDrop={this.moveEvent}
          resizable
          onEventResize={this.resizeEvent}
          onSelectSlot={this.newEvent}
          onSelecting={() => false}
          min={new Date(openHour) || new Date(2018, 10, 0, 6, 0, 0)}
          max={new Date(closeHour) || new Date(2018, 10, 0, 22, 0, 0)}
          messages={messages}
          resources={resourceMap}
          resourceIdAccessor="resourceId"
          resourceTitleAccessor="resourceTitle"
        />
      </Wrapper>
    );
  }
}

export default Calendar;
