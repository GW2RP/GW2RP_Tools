import React, { Component } from 'react';
import { 
    Row, Col, Card,
    Form, FormGroup, Input, Label,
} from 'reactstrap';

class DateConverter extends Component {
    convertDateToMouvelian = (event) => {
        event.preventDefault();
        console.log(event.target.value);
    }

    render() {
        return (
            <div className="text-center container">
                <h1>Convertisseur de Dates</h1>
                <Row>
                    <Col>
                        <Card>
                            <h2>Grégorien vers Mouvelien</h2>
                            <Form>
                                <FormGroup>
                                    <Input type='date' name='date' id='realDateToConvert' onChange={this.convertDateToMouvelian} />
                                </FormGroup>
                            </Form>
                            <p className='lead'>Entrez une date à convertir.</p>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <h2>Mouvélien vers Grégorien</h2>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default DateConverter;
