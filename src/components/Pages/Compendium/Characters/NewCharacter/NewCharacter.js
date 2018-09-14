import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

class NewCharacter extends Component {
  constructor (props) {
    super(props);

    this.state = {
      name: '',
      tmpName: '',
      description: '',
      appearance: '',
      history: '',
      error: null,
    };
  }

  changeName = (event) => {
    this.setState({
      tmpName: event.target.value
    });
  }

  validateName = (event) => {
    event.preventDefault();

    this.setState({
      name: this.state.tmpName,
    });
  }

  changeFields = (event) => {
    event.preventDefault();

    const name = event.target.name;
    const value = event.target.value

    this.setState({
      [name]: value,
    });
  }

  createCharacter = (event) => {
    event.preventDefault();

    this.setState({
      creating: true,
    });

    const { name, description, appearance, history } = this.state;

    this.props.charactersService.create({
      name,
      description,
      appearance,
      history,
      tags: [],
      sheet: {
        characteristics: [],
        skills: [],
        feats: [],
      },
    }).then(character => {
      this.setState({
        creating: false,
        error: null,
      });
      this.props.onCharacterCreated(character._id);
    }).catch(err => {
      this.setState({
        creating: false,
        error: err.id,
      });
    });
  }

  render() {
    const { name } = this.state;

    if (!name) {
      return (
        <div>
          <p className='lead'>Qui suis-je ?</p>
          <button className='btn btn-link text-danger' onClick={this.props.abortNewCharacter}>Annuler</button>
          <form onSubmit={this.validateName}>
            <div className='form-group'>
              <input type='text' className='form-control' name='tmpName' value={this.state.tmpName} onChange={this.changeName} autoFocus required />
            </div>

            <button type='submit' className='btn btn-success'>Vérifier</button>
          </form>
        </div>
      )
    }

    let error;
    if (this.state.error) {
      switch (this.state.error) {
        case 'CHARACTER_NAME_USED':
          error = <p className='alert alert-danger'>Ce nom de personnage est déjà utilisé.</p>;
          break;
        default:
          error = <p className='alert alert-danger'>Une erreur inconnue est survenue (encore un coup des asuras...).</p>;
      }
    }

    return (
      <div>
        <h1>{name}</h1>
        <button className='btn btn-link text-danger' onClick={this.props.abortNewCharacter}>Annuler</button>
        <hr/>
        <form onSubmit={this.createCharacter}>
          <div className='form-group'>
            <label htmlFor='description'>Description</label>
            <textarea rows="6" className='form-control' name='description' value={this.state.description} onChange={this.changeFields} placeholder='Qui est ce personnage ? Que fait-il ? Les autres peuvent-ils savoir certaines choses sur lui ?' autoFocus disabled={this.state.creating} required />
          </div>
          <div className='form-group'>
            <label htmlFor='appearance'>Apparance</label>
            <textarea rows="4" className='form-control' name='appearance' value={this.state.appearance} onChange={this.changeFields} placeholder='A quoi ressemble-t-il ? Quels sont ses signes distinctifs ?' disabled={this.state.creating} required />
          </div>
          <div className='form-group'>
            <label htmlFor='history'>Histoire</label>
            <textarea rows="6" className='form-control' name='history' value={this.state.history} onChange={this.changeFields} placeholder='Quelle est son histoire ?' disabled={this.state.creating} required />
          </div>

          {error}
          <button type='submit' className='btn btn-success' disabled={this.state.creating} >Créer</button>
        </form>
      </div>
    ) 
  }
}

NewCharacter.propTypes = {
  charactersService: PropTypes.object.isRequired,
  onCharacterCreated: PropTypes.func.isRequired,
  abortNewCharacter: PropTypes.func.isRequired,
}

export default NewCharacter;