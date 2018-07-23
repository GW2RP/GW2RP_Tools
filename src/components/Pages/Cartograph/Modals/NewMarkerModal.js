import React, { Component } from 'react';
import {
    Modal, ModalHeader, ModalBody,
    Nav, NavItem, NavLink, TabContent, TabPane,
    Row, Col,
    Form, FormGroup, Label, Input,
    Button,
    FormText
} from 'reactstrap';
import classnames from 'classnames';

const difficulties = {
    "peaceful": {
        id: "peaceful",
        name: "Promenade",
        description: "Pas de morts ou blessures graves, un bon moment de détente.",
        color: "green"
    },
    "easy": {
        id: "easy",
        name: "Facile",
        description: "Il va falloir un peu de jugeotte et de concentration, mais pas d'enjeux graves.",
        color: "darkgreen"
    },
    "normal": {
        id: "normal",
        name: "Normal",
        description: "Votre personnage peut subir des séquelles.",
        color: "orange"
    },
    "difficult": {
        id: "difficult",
        name: "Difficile",
        description: "De la concentration et de la vivacité d'esprit seront nécessaires, de mauvais choix pourraient bien impliquer de lourdes conséquences !",
        color: "darkred"
    },
    "hardcore": {
        id: "hardcore",
        name: "Epique",
        description: "Vous devrez user de toutes vos capacités pour survivre, le challenge, et les risques, sont au rendez-vous.",
        color: "violet"
    }
}

class NewMarkerModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tab: 'location',
            event: {},
            location: {},
            rumor: {}
        }
    }

    toggle = (tab) => {
        if (this.state.tab !== tab) {
            this.setState({
                tab
            });
        }
    }

    addMarker = (event) => {
        event.preventDefault();
        console.log("Add Marker of type " + this.state.tab);
    }

    render() {
        const { location, event, rumor } = this.state;

        return (
            <Modal size="lg" toggle={this.props.toggle} isOpen={this.props.isOpen}>
                <ModalHeader toggle={this.props.toggle}>Ajouter un Marqueur</ModalHeader>
                <ModalBody>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.tab === 'location' })}
                                onClick={() => { this.toggle('location'); }} >
                                Lieux Permanent
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.tab === 'event' })}
                                onClick={() => { this.toggle('event'); }} >
                                Evènement
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.tab === 'rumor' })}
                                onClick={() => { this.toggle('rumor'); }} >
                                Rumeur
                            </NavLink>
                        </NavItem>
                    </Nav>

                    <TabContent activeTab={this.state.tab}>
                        <TabPane tabId="location">
                            <div className="container mt-2">
                                <p className="text-info">Les lieux permanents restent affichés pendant trois mois avant d'être effacés, sauf s'ils recoivent des mises à jour. Activez les notifications mail pour ne pas oublier de les prolonger.</p>
                                <Form onSubmit={this.addMarker}>
                                    <FormGroup>
                                        <Label for="name">Nom du Lieu</Label>
                                        <Input type="text" id="name" placeholder="Grande Cathédrale D'Abaddon" required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="type">Type</Label>
                                        <Input type="select" id="type" multiple required>
                                            <option value="tavern">Taverne</option>
                                            <option value="trading">Commerce</option>
                                            <option value="exploration">Exploration</option>
                                            <option value="mercenary">Mercenariat</option>
                                            <option value="research">Recherche</option>
                                            <option value="nobility">Noblesse</option>
                                            <option value="other">Autre</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="contact">Personne à contacter</Label>
                                        <Input type="text" id="contact" placeholder="Abaddon.6666" required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="hours">Horaires d'Activité</Label>
                                        <Input type="text" id="hours" placeholder="Tous les jours 20h-22h" required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="description">Description.</Label>
                                        <Input type="textarea" name="description" id="description" required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="site">Site web</Label>
                                        <Input type="text" id="site" placeholder="http://monforum.gw2rp-tools.ovh/la-cathedrale-abaddon" required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="icon">Icone</Label>
                                        <Input type="select" id="icon" required>
                                            <option value="tavern">Taverne</option>
                                            <option value="guild">Guilde</option>
                                            <option value="merchant">Commerce</option>
                                            <option value="other">Divers</option>
                                        </Input>
                                    </FormGroup>
                                    <div className="clearfix">
                                        <div className="float-right">
                                            <Button type="submit" color="primary">Ajouter</Button>
                                            <Button className="ml-2" type="button" color="secondary">Annuler</Button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </TabPane>
                        <TabPane tabId="event">
                            <div className="container mt-2">
                                <p className="text-info">Les évènements sont automatiquement effacés au lendemain de leur date de fin.</p>
                                <Form onSubmit={this.addMarker}>
                                    <FormGroup>
                                        <Label for="name">Titre de l'évènement</Label>
                                        <Input type="text" id="name" placeholder="Attaque de Centaures" required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="difficulty">Difficulté</Label>
                                        <Input type="select" id="difficulty" required>
                                            {Object.values(difficulties).map(difficulty => {
                                                return <option value={difficulty.id} key={difficulty.id}>{difficulty.name}</option>
                                            })}
                                        </Input>
                                        {event && event.difficulty &&
                                            <p>{difficulties[event.difficulty].name} : {difficulties[event.difficulty].description}</p>
                                        }
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="type">Type</Label>
                                        <Input type="select" id="type" multiple required>
                                            <option value="battle">Bataille</option>
                                            <option value="camp">Campement</option>
                                            <option value="communitary">Communautaire</option>
                                            <option value="damages">Dégâts</option>
                                            <option value="danger">Zone dangereuse</option>
                                            <option value="other">Autre</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="contact">Personne à contacter</Label>
                                        <Input type="text" id="contact" placeholder="Abaddon.6666" required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="end_date">Date (ou date de fin)</Label>
                                        <Input type="date" name="end_date" id="end_date" required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="end_hour">Heure</Label>
                                        <Input type="time" name="end_hour" id="end_hour" required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="description">Description</Label>
                                        <Input type="textarea" rows="8" name="description" id="description" placeholder="Des centaures attaquent la Garnison de Kryte, les Séraphins recherchent de l'aide auprès de braves mercenaires." required />
                                        <FormText color="muted">
                                            Vous pouvez utiliser les balises de mise en forme. 
                                        </FormText>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="site">Page de l'évenement</Label>
                                        <Input type="text" id="site" placeholder="http://monforum.gw2rp-tools.ovh/events/une-attaque-centaure" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="icon">Icone</Label>
                                        <Input type="select" id="icon">
                                            <option value="generic">Générique</option>
                                            <option value="communitary">Communautaire</option>
                                            <option value="festival">Festivité</option>
                                            <option value="fight">Combat</option>
                                        </Input>
                                    </FormGroup>
                                    <div className="clearfix">
                                        <div className="float-right">
                                            <Button type="submit" color="primary">Ajouter</Button>
                                            <Button className="ml-2" type="button" color="secondary">Annuler</Button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </TabPane>
                        <TabPane tabId="rumor">
                            <Row>
                                <Col sm="12">
                                    <h4>Ajouter rumeur</h4>
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
                </ModalBody>
            </Modal>
        );
    }
}

export default NewMarkerModal;