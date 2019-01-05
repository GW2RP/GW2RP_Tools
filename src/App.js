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
import Characters from './components/Pages/Compendium/Characters';
import Guilds from './components/Pages/Compendium/Guilds';

import LogInModal from './components/Commons/Modals/LoginModal';

import authService from './services/Auth.Service';
import rumoursService from './services/Rumours.Service';
import eventsService from './services/Events.Service';
import locationsService from './services/Locations.Service';
import charactersService from './services/Characters.Service';
import contractsService from './services/Contracts.Service';
import Tools from './components/Pages/Tools/Tools';
import Kalendar from './components/Pages/Kalendar';
import './App.css';
import Board from './components/Pages/Board/Board';

rumoursService.setAuth(authService);
eventsService.setAuth(authService);
locationsService.setAuth(authService);
charactersService.setAuth(authService);
contractsService.setAuth(authService);

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      auth: {
        isAuthenticating: true,
        isAuthenticated: false,
        user: {},
        token: null,
      },
      logInModal: false,
    };
  }

  componentDidMount() {
    const username = localStorage.getItem("username") || null;
    const token = localStorage.getItem("token") || null;

    if (username && token) {
      authService.setToken(token);
      authService.setUser(username);
      authService.checkToken().then(({success, user}) => {
        if (success) {
          this.setState({
            auth: {
              isAuthenticating: false,
              isAuthenticated: true,
              token: token,
              user,
            }
          });
        } else {
          authService.setToken(null);
          this.setState({ auth: { isAuthenticating: false, user: {} } });
        }
      });
    } else {
      this.setState({ auth: { isAuthenticating: false, user: {} } });
    }

    authService.onLogOut(() => this.onUserAuthentication());
  }

  onUserAuthentication = (auth = false, token = null, user = {}) => {
    this.setState({ auth: { isAuthenticated: auth, user, token } });
  }
  
  signIn = (username, password) => {
    return authService.signIn(username, password).then(({token, user}) => {
      this.onUserAuthentication(true, token, user);
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
      <div id="app">
        <Router>
          <div>
            <LogInModal
              isOpen={this.state.logInModal}
              toggle={this.toggleLogInModal}
              signIn={this.signIn}
              signUp={authService.signUp}
              sendValidationMail={authService.sendValidationMail} />
            <Navigation logOut={this.logOut} logInModal={() => this.toggleLogInModal()} user={auth.user} />

            <Switch>
              <Route exact path="/" render={() => (
                <Home
                  rumoursService={rumoursService}
                  eventsService={eventsService}
                />
              )} />
              <Route path="/carte" render={(props) => (
                <Cartograph
                  rumoursService={rumoursService}
                  eventsService={eventsService}
                  locationsService={locationsService}
                  authService={authService}
                  toggleLogInModal={this.toggleLogInModal}
                  location={props.location}
                  history={props.history}
                />
              )} />
              <Route path="/registre" render={(props) => (
                <Characters
                  charactersService={charactersService}
                  currentUser={this.state.auth.user}
                  isSignedIn={() => authService.isSignedIn()}
                  toggleLogInModal={this.toggleLogInModal}
                  location={props.location}
                  history={props.history}
                />
              )} />
              <Route path="/contrats" render={(props) => (
                <Board 
                  contractsService={contractsService}
                  signedIn={authService.isSignedIn()}
                />
              )} />
              <Route path="/calendrier" render={(props) => (
                <Kalendar />
              )} />
              <Route path="/guildes" render={(props) => (
                <Guilds />
              )} />
              <Route path="/outils" render={({ match }) => (
                <Tools match={match} />
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
      </div>
    );
  }
}

export default App;
