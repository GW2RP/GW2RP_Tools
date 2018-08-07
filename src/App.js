import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import Loader from './components/Commons/Loader';
import Navigation from './components/Navigation';
import Home from './components/Pages/Home';
import Cartograph from './components/Pages/Cartograph';

import LogInModal from './components/Commons/Modals/LoginModal';

import authService from './services/Auth.Service';
import rumoursService from './services/Rumours.Service';
import eventsService from './services/Events.Service';
import locationsService from './services/Locations.Service';
import LocationsService from './services/Locations.Service';

rumoursService.setAuth(authService);
eventsService.setAuth(authService);
LocationsService.setAuth(authService);

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      auth: {
        isAuthenticating: true,
        isAuthenticated: false,
        user: {},
        token: null,
        logInModal: false
      }
    };
  }

  componentDidMount() {
    const username = localStorage.getItem("username") || null;
    const token = localStorage.getItem("token") || null;

    if (username && token) {
      authService.setToken(token);
      authService.setUser(username);
      authService.checkToken().then(success => {
        if (success) {
          this.setState({
            auth: {
              isAuthenticating: false,
              isAuthenticated: true,
              user: { username },
              token: token
            }
          });
        } else {
          authService.setToken(null);
          this.setState({ auth: { isAuthenticating: false } });
        }
      });
    } else {
      this.setState({ auth: { isAuthenticating: false } });
    }

    authService.onLogOut(() => this.onUserAuthentication());
  }

  onUserAuthentication = (auth = false, token = null, user = {}, admin = false) => {
    this.setState({ auth: { isAuthenticated: auth, user, token, admin } });
  }
  
  signIn = (username, password) => {
    return authService.signIn(username, password).then(token => {
      this.onUserAuthentication(true, token, { username }, false);
      return true;
    });
  }

  logOut = () => {
    authService.signOut().then(() => {
      this.onUserAuthentication();
    });
  }

  toggleLogInModal = () => {
    this.setState({ logInModal: !this.state.logInModal });
  }

  render() {
    const { auth } = this.state;

    if (auth.isAuthenticating) {
      return (
        <main className="container text-center" style={{ "marginTop": "40vh" }}>
          <h1>Boîte à Outils GW2RP</h1>
          <Loader />
          <p className="small" style={{ "color": "#dd1010" }}>Veuillez patienter pendant le réveil d'Abaddon...</p>
        </main>
      )
    }

    return (
      <Router>
        <div className="App">
          <LogInModal isOpen={this.state.logInModal} toggle={this.toggleLogInModal} signIn={this.signIn}/>
          <Navigation logOut={this.logOut} logInModal={() => this.toggleLogInModal()} user={auth.user} />
          <Switch>
            <Route exact path="/" render={() => (
              <Home
                rumoursService={rumoursService}
                eventsService={eventsService}
              />
            )} />
            <Route path="/carte" render={() => (
              <Cartograph
                rumoursService={rumoursService}
                eventsService={eventsService}
                locationsService={locationsService}
                authService={authService}
                toggleLogInModal={this.toggleLogInModal}
              />
            )} />
            <Route path="/admin" render={() =>
              auth.isAuthenticated ?
                (
                  <Switch>
                    <Route>
                      <main className="container text-center" style={{ "marginTop": "20vh" }}>
                        <Loader />
                        <h1>Not Implemented</h1>
                      </main>
                    </Route>
                  </Switch>
                )
                :
                (
                  <h1>Vous n'avez pas l'autorisation d'accéder à cette page.</h1>
                )
            }>
            </Route>
            <Route>
              <h1>404</h1>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
