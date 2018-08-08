import React, { Component } from 'react';
import Map from './Map';

import { NewMarkerModal } from './Modals';
import { SideBar } from './SideBar';

class Cartograph extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      rumours: [],
      events: [],
      locations: [],
      showNewMarkerModal: false,
      newMarkerError: null,
      sideBar: false
    }

    this.focus = () => {};
  }

  componentDidMount() {
    Promise.all([
      this.props.rumoursService.getAll().then(rumours => {
        this.setState({
          rumours 
        });
  
        this.props.rumoursService.subscribe(rumours => {
          this.setState({
            rumours
          });
        });
      }).catch(err => {
        console.error(err);
      }),
      this.props.eventsService.getAll().then(events => {
        this.setState({
          events 
        });
  
        this.props.eventsService.subscribe(events => {
          this.setState({
            events
          });
        });
      }).catch(err => {
        console.error(err);
      }),
      this.props.locationsService.getAll().then(locations => {
        this.setState({
          locations 
        });
  
        this.props.locationsService.subscribe(locations => {
          this.setState({
            locations
          });
        });
      }).catch(err => {
        console.error(err);
      })
    ]).then(() => {
      // Parse URL.
      const [ first, map, type, id ] = this.props.location.pathname.split("/");
      this.focus(type, id);
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
          this.toggleNewMarkerModal(null)
        }).catch(err => {
          console.error(err);
          this.setState({
            newMarkerError: err.message
          });
        });
        break;
      case "event":
        break;
      case "location":
        this.props.locationsService.create(marker).then(created => {
          this.toggleNewMarkerModal(null)
        }).catch(err => {
          console.error(err);
          this.setState({
            newMarkerError: err.message
          });
        });
        break;
      default:
        break;
    }
    console.log(marker);
  }

  showSideBar = (sideBarElement) => {
    this.setState({
      sideBarElement,
      sideBar: true
    });

    console.log(sideBarElement);

    let type;
    switch (sideBarElement.category) {
      case "location":
        type = "lieu";
        break;
      case "rumour":
        type = "rumeur";
        break;
      case "event":
        type = "event";
        break;
      default:
        return;
    }

    this.props.history.push(`/carte/${type}/${sideBarElement._id}`);
  }

  hideSideBar = () => {
    this.setState({
      sideBarElement: null,
      sideBar: false
    });
  }

  listenToFocus = (focus) => {
    this.focus = focus;
  }

  render() {
    return (
      <div>
        <NewMarkerModal 
          newMarker={this.state.newMarker}
          toggle={() => this.toggleNewMarkerModal(null)}
          error={this.state.newMarkerError}
          isOpen={this.state.showNewMarkerModal}
          coord={this.state.coord}
          addMarker={this.addMarker}
        />
        <SideBar isOpen={this.state.sideBar} element={this.state.sideBarElement} />
        <Map
          rumours={this.state.rumours}
          events={this.state.events}
          locations={this.state.locations}
          isSignedIn={() => this.props.authService.isSignedIn()}
          toggleLogInModal={this.props.toggleLogInModal}
          toggleNewMarkerModal={this.toggleNewMarkerModal}
          showSideBar={this.showSideBar}
          hideSideBar={this.hideSideBar}
          listenToFocus={this.listenToFocus}
          />
      </div>
    );
  }

}

export default Cartograph;
