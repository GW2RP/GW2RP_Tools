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

import authService from './services/Auth.Service';
import rumoursService from './services/Rumours.Service';
import eventsService from './services/Events.Service';
import locationsService from './services/Locations.Service';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      auth: {
        isAuthenticating: true,
        isAuthenticated: false,
        user: {},
        token: null
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
          this.setState({ auth: { isAuthenticating: false } });
        }
      });
    } else {
      this.setState({ auth: { isAuthenticating: false } });
    }
  }

  onUserAuthentication = (auth = false, token = null, user = {}, admin = false) => {
    this.setState({ auth: { isAuthenticated: auth, user, token, admin } });
  }

  logOut = () => {
    this.onUserAuthentication();
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
          <Navigation logOut={this.logOut} user={this.state.user} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/carte" render={() => (
              <Cartograph
                rumoursService={rumoursService}
                eventsService={eventsService}
                locationsService={locationsService}
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
