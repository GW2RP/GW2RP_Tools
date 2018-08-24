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
      filterMines: false,
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

  newCharacter = () => {
    if (!this.props.isSignedIn()) {
      this.props.toggleLogInModal();
    }
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
    const [ first, registery, type, params, type2, params2 ] = this.props.location.pathname.split("/");

    let selected;
    if (type === 'id') {
      selected = params;
    }
    let tags;
    if (type === 'tags') {
      tags = params.trim().split(',').map(t => t.trim());
      if (type2 && type2 === 'id') {
        selected = params2;
      }
    }

    let charactersToDisplay = characters;
    
    if (this.state.filterMines) {
      charactersToDisplay.filter(character => character.owner.username.toLowerCase() === this.props.currentUser.username );
    }

    if (tags) {
      charactersToDisplay = charactersToDisplay.filter(character => {
        for (let tag of tags) {
          if (!character.tags.includes(tag.toLowerCase())) {
            return false;
          }
        }
        return true;
      });
    }

    return (
      <main role="main" className="container-fluid">
        <div className='row'>
          <div className='col-md-4 d-none d-md-block'>
            <div className='row justify-content-between align-items-center'>
              <div className='col'>
                <h1 className='mt-2 h3'>Liste</h1>
              </div>
              <div className='col text-right'>
                <button className='btn btn-outline-success' onClick={this.newCharacter}>Nouveau</button>
              </div>
            </div>            
            
            {this.props.currentUser.username && 
              <p>Afficher : <a href='#' className={`badge badge-${this.state.filterMines ? 'light' : 'info'}`} onClick={(event) => {event.preventDefault(); this.setState({ filterMines: false })}}>tous</a>, <a href='#' className={`badge badge-${this.state.filterMines ? 'info' : 'light'}`} onClick={(event) => { event.preventDefault(); this.setState({ filterMines: true })}}>mes personnages</a>.</p>
            }

            <p>Tags : 
              {tags && tags.map(tag => (
                <Link key={tag} to={`/registre/tags/${tag}`} className="badge badge-light">{tag}</Link>
              ))}
            </p>

            <div className='list-group'>
              {charactersToDisplay.sort().map(character => (
                <NavLink key={character._id} to={`/registre${tags ? `/tags/${tags.join(',')}`: ''}/id/${character._id}`} activeClassName='active' className='list-group-item list-group-item-action'>{character.name}</NavLink>
              ))}
            </div>
          </div>
          <div className='col-md-8'>
            {selected && 
              <div>
                <CharacterDetails
                  selected={selected} 
                  currentUser={this.props.currentUser}
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
