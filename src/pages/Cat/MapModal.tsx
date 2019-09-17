import { Form, FormGroup, Modal } from 'react-bootstrap';
import * as React from 'react';
import styled from 'styled-components';
import { toastr } from 'react-redux-toastr';
import {
  GoogleMap,
  InfoWindow,
  Marker,
  withGoogleMap,
  withScriptjs,
} from 'react-google-maps';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import {
  compose,
  withProps,
  withHandlers,
  withState,
  withStateHandlers,
  lifecycle,
} from 'recompose';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { Link } from 'gatsby';

const StyledModal = styled(Modal)`
  & > .modal-dialog {
    width: 800px;
    max-width: 100%;
    padding: 0rem;
    & > .modal-content {
      background: rgba(255, 255, 255, 0.995);
      text-align: left;
      padding: 0 !important;
      & > .modal-body {
        padding: 0 !important;
      }
    }
  }
`;

// const SIGN_IN = gql`
//   mutation($input: createUserInput) {
//     createUser(input: $input) {
//       user {
//         id
//         username
//       }
//     }
//   }
// `;

const marketState = withStateHandlers(
  {
    isOpen: false,
  },
  {
    onMarkerClick: ({ isOpen }) => () => ({ isOpen: !isOpen }),
  },
);

const MarkerPoint = compose(marketState)(
  ({
    isOpen,
    onMarkerClick,
    marker,
    marker: {
      id,
      name,
      categories,
      latitude,
      longitude,
      street,
      street_number,
      flat_number,
      city,
      district,
    },
  }) => (
    <Marker
      key={marker.id}
      position={{ lat: +latitude, lng: +longitude }}
      onClick={() => onMarkerClick()}
    >
      {isOpen && (
        <InfoWindow
          position={{ lat: +latitude, lng: +longitude }}
          onCloseClick={() => onMarkerClick()}
        >
          <h6>
            <Link to={'/business?id=' + id}>{name}</Link>
            <br />
            {categories.map(({ name }) => name).join(', ')}
            <br />
            {city && city.name} / {district && district.name} / {street}{' '}
            {street_number} {flat_number}
          </h6>
        </InfoWindow>
      )}
    </Marker>
  ),
);

const Map = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,places&key=AIzaSyBTR-Vmxoc6s1Wj2VqCzc8eA94MC4XurnI',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  withStateHandlers(
    () => ({
      isOpen: false,
    }),
    {
      onToggleOpen: ({ isOpen }) => () => ({
        isOpen: !isOpen,
      }),
    },
  ),

  withHandlers({
    onMarkerClustererClick: () => markerClusterer => {
      const clickedMarkers = markerClusterer.getMarkers();
      console.log(`Current clicked markers length: ${clickedMarkers.length}`);
      console.log(clickedMarkers);
    },
  }),
  lifecycle({
    componentWillMount() {
      const refs = {};

      this.setState({
        bounds: null,
        center: {
          lat: 41.9,
          lng: -87.624,
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          });
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
            name: place.name,
            formatted_address: place.formatted_address,
            place_id: place.place_id,
          }));
          const nextCenter = _.get(
            nextMarkers,
            '0.position',
            this.state.center,
          );

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          // refs.map.fitBounds(bounds);
        },
      });
    },
  }),
)(props => {
  return (
    <GoogleMap
      defaultZoom={6}
      defaultCenter={{ lat: 52.369311, lng: 18.934858 }}
      ref={props.onMapMounted}
      onBoundsChanged={props.onBoundsChanged}
    >
      {/*<SearchBox*/}
      {/*  ref={props.onSearchBoxMounted}*/}
      {/*  bounds={props.bounds}*/}
      {/*  controlPosition={google.maps.ControlPosition.TOP_LEFT}*/}
      {/*  onPlacesChanged={props.onPlacesChanged}*/}
      {/*>*/}
      {/*  <input*/}
      {/*    type="text"*/}
      {/*    placeholder="Customized your placeholder"*/}
      {/*    style={{*/}
      {/*      boxSizing: `border-box`,*/}
      {/*      border: `1px solid transparent`,*/}
      {/*      width: `240px`,*/}
      {/*      height: `32px`,*/}
      {/*      marginTop: `15px`,*/}
      {/*      padding: `0 12px`,*/}
      {/*      borderRadius: `3px`,*/}
      {/*      boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,*/}
      {/*      fontSize: `14px`,*/}
      {/*      outline: `none`,*/}
      {/*      textOverflow: `ellipses`,*/}
      {/*    }}*/}
      {/*    value="Stacja kontroli pojazdów"*/}
      {/*  />*/}
      {/*</SearchBox>*/}
      <MarkerClusterer
        onClick={props.onMarkerClustererClick}
        averageCenter
        enableRetinaIcons
        gridSize={60}
      >
        {props.businesses &&
          props.businesses.map((marker, index) => (
            <MarkerPoint marker={marker} />
          ))}
      </MarkerClusterer>
    </GoogleMap>
  );
});

const MapModal = ({ active, isMarkerShown, businesses, onClose }) => (
  <StyledModal show={active} onHide={onClose}>
    <Modal.Body>
      <Map businesses={businesses} />
    </Modal.Body>
  </StyledModal>
);

// const mapStateToProps = ({ auth: { registrationDialogActive } }) => ({
//   registrationDialogActive,
// });
//
// const mapDispatchToProps = dispatch => ({});

export default MapModal;

// export default graphql(SIGN_IN, { name: 'signIn' })(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps,
//   )(MapModal),
// );
