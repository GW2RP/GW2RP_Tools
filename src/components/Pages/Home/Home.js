import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { Col, Row, Card, CardBody, CardTitle, ListGroup, ListGroupItem, CardText, CardLink, CardSubtitle } from 'reactstrap';

import Loader from '../../Commons/Loader';

import { formatText } from '../../../utils/formatter';

import { API_URL } from '../../../configuration/Config';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      rumors: null,
      events: null,
      today: null,
    }
  }

  componentDidMount() {
    this.props.rumoursService.getAll().then(rumors => {
      this.setState({ rumors });

      this.props.rumoursService.subscribe((rumors) => {
        this.setState({ rumors });
      });
    }).catch(err => {
      console.error(err);
    });

    this.props.eventsService.getAll().then(events => {
      this.setState({ events });

      this.props.eventsService.subscribe((events) => {
        this.setState({ events });
      });
    }).catch(err => {
      console.error(err);
    });

    Axios({
      baseURL: 'http://api.nakasar.me',
      url: '/aujourdhui',
    }).then(res => {
      console.log(res.data)
      this.setState({today: res.data.today });
    }).catch(err => {
      console.error(err);
    });
  }

  componentWillUnmount() {
    
  }

  render() {
    const { rumors, events, today } = this.state;

    return (
      <main role="main" className="container-fluid">
        <Row className="justify-content-center p-2">
          <Col>
            <Card body className="text-center">
              <CardBody>
                <CardTitle>{ today ? `Aujourd'hui, le ${today.date.day} du ${today.date.season.name}, ${today.date.year} AE.` : 'Impossible de charger les informations d\'aujourd\'hui.'}</CardTitle>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-center p-2">
          <Col sm style={{ maxWidth: "600px" }}>
            <Card>
              <CardBody>
                <CardTitle>Prochains évènements</CardTitle>
              </CardBody>
              <CardBody>
                {events ?
                  events.slice(0,5).map((event, index) => (
                    <Card key={index}>
                      <CardBody>
                        <CardTitle>{event.name}</CardTitle>
                        <CardSubtitle>Le {(new Date(event.end_date)).toLocaleString()}</CardSubtitle>
                      </CardBody>
                      <CardBody>
                        <CardText dangerouslySetInnerHTML={{__html: formatText(event.description) }} style={{ overflow: "hidden", textOverflow: "ellipsis", wordWrap: "break-word", textAlign: "justify", maxHeight: "200px" }}></CardText>
                        <p className="small">{event.contact}</p>
                        <Link className="card-link" to={`/carte/event/${event._id}`}>Voir sur la carte.</Link>
                      </CardBody>
                    </Card>
                  ))
                  :
                  (
                    <Loader type="grid" size="20" fill="blue" />
                  )
                }
              </CardBody>
            </Card>
          </Col>
          <Col sm style={{ maxWidth: "600px" }}>
            <Card>
              <CardBody>
                <CardTitle>Dernières rumeurs</CardTitle>
              </CardBody>
              <CardBody>
                {rumors ?
                  rumors.slice(0,5).map((rumor, index) => (
                    <Card key={index}>
                      <CardBody>
                        <CardTitle>{rumor.name}</CardTitle>
                      </CardBody>
                      <CardBody>
                        <CardText dangerouslySetInnerHTML={{__html: formatText(rumor.text) }} style={{ textOverflow: "ellipsis", wordWrap: "break-word", textAlign: "justify" }}></CardText>
                        <p className="small">{rumor.contact}</p>
                        <Link className="card-link" to={`/carte/rumeur/${rumor._id}`}>Voir sur la carte.</Link>
                      </CardBody>
                    </Card>
                  ))
                  :
                  (
                    <Loader type="grid" size="20" fill="blue" />
                  )
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </main>
    );
  }
}

export default Home;
