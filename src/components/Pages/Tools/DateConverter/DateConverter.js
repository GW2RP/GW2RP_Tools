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

        let year, month, day, date;
        try {
            date = new Date(event.target.value);

            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
        } catch (e) {
            console.error('Could not parse date.');
        }

        Promise.resolve(date).then(toConvert => {
            const day = Math.ceil((toConvert - new Date(toConvert.getFullYear(), 0, 1)) / 86400000);
    
            const bisex = toConvert.getFullYear() % 4 === 0;
            const offset = bisex ? 1 : 0;
    
            const date = {
                irl: toConvert,
                day_of_year: day,
                year: toConvert.getFullYear() - 687,
            };
            if (day < 90 + offset) {
                date.day = day;
                date.season = {
                    code: 0,
                    name: 'Zéphyr'
                };
            } else if (day < 180 + offset) {
                date.day = day - (90 + offset);
                date.season = {
                    code: 1,
                    name: 'Phénix'
                };
            } else if (day < 270 + offset) {
                date.day = day - (180 + offset);
                date.season = {
                    code: 2,
                    name: 'Scion'
                };
            } else {
                date.day = day - (270 + offset);
                date.season = {
                    code: 3,
                    name: 'Colosse'
                };
            }
    
            return date;
        }).then(date => {
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

        Promise.resolve({
            day: parseInt(rpDateToConvertDay),
            season: parseInt(rpDateToConvertSeason),
            year: parseInt(rpDateToConvertYear),
        }).then(date => {
            console.log(date.season);
            const year = date.year + 687;
            const bisex = year % 4 === 0;
            const offset = bisex ? -1 : 0;
    
            let dayOfYear = 0;
            switch (date.season) {
                case 1:
                    dayOfYear = date.day;
                    break;
                case 2:
                    dayOfYear = 90 + date.day;
                    break;
                case 3:
                    dayOfYear = 180 + offset + date.day;
                    break;
                case 4:
                    dayOfYear = 270 + offset + date.day;
                    break;
                default:
                    throw {
                        message: 'Season must be between 1 and 4.',
                        id: 'INVALID_SEASON',
                        status: 400
                    };
            }
    
            const converted = new Date(year, 0, dayOfYear);
    
            return converted;
        })
        .then(converted => {
            const date = new Date(converted);
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
