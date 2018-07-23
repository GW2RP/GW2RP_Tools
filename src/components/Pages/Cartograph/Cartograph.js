import React, { Component } from 'react';
import Map from './Map';

import { NewMarkerModal } from './Modals';

class Cartograph extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      rumours: [],
      events: [],
      locations: [],
      showNewMarkerModal: false
    }
  }

  componentDidMount() {
    this.props.rumoursService.subscribe(rumours => {
      this.setState({
        rumours
      });
    });

    this.props.rumoursService.getAll().then(rumours => {
      console.log(rumours);
      this.setState({
        rumours 
      });
    }).catch(err => {
      console.error(err);
    });

    this.props.eventsService.subscribe(events => {
      this.setState({
        events
      });
    });

    this.props.eventsService.getAll().then(events => {
      console.log(events);
      this.setState({
        events 
      });
    }).catch(err => {
      console.error(err);
    });

    this.props.locationsService.subscribe(locations => {
      this.setState({
        locations
      });
    });

    this.props.locationsService.getAll().then(locations => {
      console.log(locations);
      this.setState({
        locations 
      });
    }).catch(err => {
      console.error(err);
    });
  }

  toggleNewMarkerModal = (coord) => {
    this.setState({
      showNewMarkerModal: !this.state.showNewMarkerModal,
      coord
    });
  }

  addMarker = (type, marker) => {
    console.log("Add marker of type " + type);
    switch (type) {
      case "rumor":
        this.props.rumoursService.create(marker).then(created => {
          console.log("Created");
          console.log(created);
        }).catch(err => {
          console.error(err);
        });
        break;
      case "event":
        break;
      case "location":
        break;
      default:
        break;
    }
    console.log(marker);
  }

  render() {
    return (
      <div>
      <NewMarkerModal 
        newMarker={this.state.newMarker}
        toggle={() => this.toggleNewMarkerModal(null)}
        isOpen={this.state.showNewMarkerModal}
        coord={this.state.coord}
        addMarker={this.addMarker}
      />
      <Map
        rumours={this.state.rumours}
        events={this.state.events}
        locations={this.state.locations}
        isSignedIn={() => this.props.authService.isSignedIn()}
        toggleLogInModal={this.props.toggleLogInModal}
        toggleNewMarkerModal={this.toggleNewMarkerModal}
        />
        </div>
    );
  }

}

export default Cartograph;
