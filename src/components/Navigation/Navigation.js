import React, { Component } from 'react';

import { Link, NavLink } from 'react-router-dom';

import './Navigation.css';

class Home extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="/">Abaddon Network</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink exact className="nav-link" activeClassName="active" to="/carte">Cartographe</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" to="/guildes">Guildes</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" to="/registre">Personnages</NavLink>
            </li>
            {this.props.user && this.props.user.admin && (
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to="/registre">Personnages</NavLink>
              </li>
            )}
          </ul>
          {
            this.props.user ?
              <button className="btn btn-outline-light my-2 my-sm-0" onClick={this.props.logOut}>Se déconnecter</button>
              :
              <button className="btn btn-outline-light my-2 my-sm-0">Se connecter</button>
          }
        </div>
      </nav>
    );
  }
}

export default Home;
