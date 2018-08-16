import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import Axios from 'axios';

import Loader from '../../Commons/Loader';
import DateConverter from './DateConverter';

import { API_URL } from '../../../configuration/Config';

class Tools extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <main role="main" className="container-fluid">
                <Switch>
                    <Route exact path={`${this.props.match.path}`}>
                        <div>
                            <h1>Outils Divers</h1>
                            <Link to={`${this.props.match.url}/dates`}>Convertisseur de Dates</Link>
                            <Link to={`${this.props.match.url}/traducteur`}>Traducteur</Link>
                        </div>
                    </Route>

                    <Route path={`${this.props.match.path}/dates`}>
                        <DateConverter />
                    </Route>

                    <Route path={`${this.props.match.path}/traducteur`}>
                        <h1>Traducteur</h1>
                    </Route>
                </Switch>
            </main>
        );
    }
}

export default Tools;
