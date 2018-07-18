import React, { Component } from 'react';
import Map from './Map';

class Cartograph extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      rumours: []
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
  }

  render() {
    return (
      <Map rumours={this.state.rumours} />
    );
  }

}

export default Cartograph;
