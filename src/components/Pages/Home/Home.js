import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardTitle, ListGroup, ListGroupItem } from 'reactstrap';

class Home extends Component {

  componentDidMount() {
    this.props.rumoursService.subscribe(rumors => {
      console.log(rumors);
    });

    this.props.rumoursService.getAll().catch(err => {
      console.error(err);
    });
  }

  render() {
    return (
      <main role="main" className="container-fluid">
        <Row className="justify-content-center">
          <Col className="text-center lead">Nous sommes le 66 du Zéphyr.</Col>
        </Row>
        <Row className="justify-content-center">
          <Col>
            <Card>
              <CardBody>
                <CardTitle>Prochains évènements</CardTitle>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Card>
              <CardBody>
                <CardTitle>Les dernières rumeurs</CardTitle>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </main>
    );
  }
}

export default Home;
