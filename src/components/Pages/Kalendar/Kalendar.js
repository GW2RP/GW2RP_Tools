import React, { Component } from 'react';

import { Col, Row, Card, CardBody, CardTitle, ListGroup, ListGroupItem, CardText, CardLink, CardSubtitle } from 'reactstrap';

import Loader from '../../Commons/Loader';

import './Kalendar.css';

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

class Kalendar extends Component {
  constructor(props) {
    super(props);

    const today = new Date();

    this.state = {
      today,
      year: today.getFullYear(),
      month: today.getMonth(),
    };
  }

  getDate = (_month, _year) => {
    const today = new Date();

    const month = _month || today.getMonth();
    const year = _year || today.getFullYear();

    return { month, year };
  };

  daysInMonth = (_month, _year) => {
    const { month, year } = this.getDate(_month, _year);

    return new Date(year, month + 1, 0).getDate();
  };

  getLastDayInMonth = (_month, _year) => {
    const { month, year } = this.getDate(_month, _year);

    const lastDay = new Date(year, month + 1, 0).getDay();

    return lastDay === 0 ? 7 : lastDay - 1; // Add one to have first day of week beeing Monday.
  };

  getFirstDayInMonth = (_month, _year) => {
    const { month, year } = this.getDate(_month, _year);

    const firstDay = new Date(year, month, 1).getDay();

    return firstDay === 0 ? 7 : firstDay - 1; // Add one to have first day of week beeing Monday.
  };

  goToday = () => {
    const { today } = this.state;

    this.setState({
      year: today.getFullYear(),
      month: today.getMonth(),
    });
  };

  goPrevious = () => {
    const { year, month } = this.state;

    if (month === 0) {
      this.setState({ year: year - 1, month: 11 });
    } else {
      this.setState({ month: month - 1 });
    }
  };

  goNext = () => {
    const { year, month } = this.state;

    if (month === 11) {
      this.setState({ year: year + 1, month: 0 });
    } else {
      this.setState({ month: month + 1 });
    }
  };

  render() {
    const { today, year, month } = this.state;

    const daysInPreviousMonth = this.daysInMonth(month - 1, year);
    const days = this.daysInMonth(month, year);
    const firstDay = this.getFirstDayInMonth(month, year);
    const lastDay = this.getLastDayInMonth(month, year);
    const weeks = Math.floor((days - 7 + firstDay)/7);

    return (
      <main role="main" className="container-fluid" style={{ minHeight: '94vh' }}>
        <Row className="justify-content-center p-2">  
          <Col className='text-center'>
            <h1>Calendrier des Evènements</h1>
          </Col>
        </Row>
        <Row className="justify-content-center p-2">
          <Col sm style={{ maxWidth: "300px" }}>
            <h2>Actions Générales</h2>
          </Col>
          <Col>
            <div className="container">
              <div className="btn-toolbar mb-2" role="toolbar" aria-label="Calendar controls">
                <div className="btn-group mr-2" role="group" aria-label="Today">
                  <button className="btn btn-light" onClick={this.goToday}>Aujourd'hui</button>
                </div>
                <div className="btn-group mr-2" role="group" aria-label="Next and previous">
                  <button className="btn btn-outline-secondary" onClick={this.goPrevious}>Prec.</button>
                  <button className="btn btn-outline-secondary" onClick={this.goNext}>Suiv.</button>
                </div>
                <div className="btn-group" role="group" aria-label="Today's date">
                  <button type="button" className="btn btn-light disabled" disabled>{`${MONTHS[month]} ${year}`}</button>
                </div>
              </div>

              <div className="row week-days">
                <div className="col text-center day">Lundi</div>
                <div className="col text-center day">Mardi</div>
                <div className="col text-center day">Mercredi</div>
                <div className="col text-center day">Jeudi</div>
                <div className="col text-center day">Vendredi</div>
                <div className="col text-center day">Samedi</div>
                <div className="col text-center day">Dimanche</div>
              </div>
              <div className="days">
                {firstDay < 7 && (
                  <div className="row week">
                    {/* First row, previous month */}
                    {[...Array(firstDay).keys()].map(day => (
                      <div className="col day" key={day} style={{ color: 'lightgrey' }}>
                        {daysInPreviousMonth - firstDay + day + 1}
                      </div>
                    ))}
                    {[...Array(7 - firstDay).keys()].map(day => (
                      <div className="col day" key={day}>
                        {day + 1}
                      </div>
                    ))}
                  </div>
                )}
                {[...Array(weeks).keys()].map(week => (
                  <div className="row week" key={week}>
                    {[...Array(7).keys()].map(day => (
                      <div className="col day" key={day}>
                        {7 - (firstDay - 1) + 7 * week + day}
                      </div>
                    ))}
                  </div>
                ))}
                {lastDay < 7 && (
                  <div className="row week">
                    {/* Last, incomplete row */}
                    {[...Array(lastDay + 1).keys()].map(day => (
                      <div className="col day" key={day}>
                        {days - lastDay + day}
                      </div>
                    ))}
                    {[...Array(7 - (lastDay + 1)).keys()].map(day => (
                      <div className="col day" key={day} style={{ color: 'lightgrey' }}>
                        {1 + day}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </main>
    );
  }
}

export default Kalendar;