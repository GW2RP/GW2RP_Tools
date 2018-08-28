import React, { Component } from 'react'

export default class NewCharacter extends Component {
  constructor (props) {
    super(props);

    this.state = {
      name: '',
      tmpName: '',
    };
  }

  changeName = (event) => {
    this.setState({
      tmpName: event.target.value
    });
  }

  validateName = (event) => {
    event.preventDefault();

    console.log(this.state.tmpName);

    this.setState({
      name: this.state.tmpName,
    });
  }

  render() {
    const { name } = this.state;

    if (!name) {
      return (
        <div>
          <p className='lead'>Qui suis-je ?</p>
          <form onSubmit={this.validateName}>
            <input type='text' className='form-control' name='tmpName' value={this.state.tmpName} onChange={this.changeName} />

            <button type='submit' className='btn btn-success'>Créer</button>
          </form>
        </div>
      )
    }

    return (
      <div>
        <h1>{name}</h1>
      </div>
    )
  }
}
