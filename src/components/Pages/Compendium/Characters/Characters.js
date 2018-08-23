import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom';

import Loader from '../../../Commons/Loader';

import CharacterDetails from './CharacterDetails';

export default class Characters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      characters: [],
    };
  }

  componentDidMount = () => {
    this.props.charactersService.getAll()
    .then(characters => {
      this.setState({ characters, loading: false });

      this.props.charactersService.subscribe((characters) => {
        this.setState({ characters });
      });
      return;
    }).catch(err => {
      console.error(err);
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <main role="main" className="container-fluid text-center" style={{ "marginTop": "40vh" }}>
          <Loader />
        </main>
      )
    }

    const { characters } = this.state;
    const [ first, registery, selected ] = this.props.location.pathname.split("/");

    return (
      <main role="main" className="container-fluid">
        <div className='row'>
          <div className='col-md-4 d-none d-md-block'>
            <h1>Liste</h1>
            <div className='list-group'>
              {characters.sort().map(character => (
                <NavLink key={character._id} to={`/registre/${character._id}`} activeClassName='active' className='list-group-item list-group-item-action'>{character.name}</NavLink>
              ))}
            </div>
          </div>
          <div className='col-md-8'>
            {selected && 
              <div>
                <CharacterDetails
                  selected={selected} 
                  charactersService={this.props.charactersService}
                />
              </div>
            }
          </div>
        </div>
      </main>
    )
  }
}
