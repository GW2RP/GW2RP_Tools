import React, { Component } from 'react';
import { 
    Row, Col, Card,
    Form, FormGroup, Input, Label,
} from 'reactstrap';

import Axios from 'axios';

import { API_URL } from '../../../../configuration/Config';

class DateConverter extends Component {

    constructor(props) {
        super(props);

        this.state = {
            irl2rpError: null,
            irl2rpMouvelian: null,
            rp2irlError: null,
            rp2irl: null,
            rpDateToConvertDay: null,
            rpDateToConvertSeason: null,
            rpDateToConvertYear: null,
        };
    }

    convertDateToMouvelian = (event) => {
        event.preventDefault();

        let year, month, day;
        try {
            const date = new Date(event.target.value);

            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
        } catch (e) {
            console.error('Could not parse date.');
        }

        Axios.get(`https://api.nakasar.me/convertir/rp/${day}/${month}/${year}`).then(response => {
            const date = response.data.day.date;
            this.setState({
                irl2rpError: null,
                irl2rpMouvelian: `${date.day} du ${date.season.name}, ${date.year} AE.`,
            });
        }).catch(err => {
            console.error(err);
        })
    }

    convertDateToGregorian = (event) => {
        event.preventDefault();
        let { rpDateToConvertDay, rpDateToConvertSeason, rpDateToConvertYear } = this.state;

        Axios.get(`https://api.nakasar.me/convertir/irl/${rpDateToConvertDay}/${rpDateToConvertSeason}/${rpDateToConvertYear}`).then(response => {
            const date = new Date(response.data.day.date.irl);
            this.setState({
                rp2irlError: null,
                rp2irl: `${date.toLocaleDateString()}`,
            });
        }).catch(err => {
            console.error(err);
        });
    }

    onRp2IrlChange = (event) => {   
        event.preventDefault();

        this.setState({
            [event.target.name]: event.target.value,
        });
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
                            <p className='lead'>{ this.state.irl2rpMouvelian || 'Entrez une date à convertir.' }</p>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <h2>Mouvélien vers Grégorien</h2>
                            <Form onSubmit={this.convertDateToGregorian}>
                                <div className='input-group mb-3'>
                                    <Input type='text' style={{ 'width': '5%' }} name='rpDateToConvertDay' id='rpDateToConvertDay' onChange={this.onRp2IrlChange} />
                                    <Input type='select' name='rpDateToConvertSeason' id='rpDateToConvertSeason' onChange={this.onRp2IrlChange}>
                                        <option value='1'>Zéphyr</option>
                                        <option value='2'>Phénix</option>
                                        <option value='3'>Scion</option>
                                        <option value='4'>Colosse</option>
                                    </Input>
                                    <Input type='text' name='rpDateToConvertYear' id='rpDateToConvertYear' onChange={this.onRp2IrlChange} />    
                                </div>
                                <button className="btn btn-primary" type="submit">Convertir</button>
                            </Form>
                            <p className='lead'>{ this.state.rp2irl || 'Entrez une date à convertir.' }</p>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default DateConverter;
