import React, { Component } from 'react';
import Map from './Map';

class Cartograph extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      rumours: [],
      events: [],
      locations: []
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

  render() {
    return (
      <Map
        rumours={this.state.rumours}
        events={this.state.events}
        locations={this.state.locations}
        isSignedIn={() => this.props.authService.isSignedIn()}
        toggleLogInModal={this.props.toggleLogInModal}
        />
    );
  }

}

export default Cartograph;
