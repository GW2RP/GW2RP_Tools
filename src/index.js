import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery'; // eslint-disable-line no-unused-vars 
import Popper from 'popper.js'; // eslint-disable-line no-unused-vars
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
