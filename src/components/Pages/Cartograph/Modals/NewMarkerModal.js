import React, { Component } from 'react';
import {
    Alert,
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
            location: {
                title: '',
                description: '',
                contact: '',
                site: '',
                types: [],
                icon: '',
                opening_hours: '',
            },
            event: {
                title: "",
                description: "",
                difficulty: "normal",
                contact: "",
                site: "",
                types: [],
                icon: "",
                start_date: "",
                start_hour: '',
                end_date: "",
                end_hour: '',
                dates: { start: new Date(), end: new Date()},
            },
            rumor: {
                title: "",
                contact: "",
                description: "",
                site: ""
            },
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
        const marker = this.state[this.state.tab];
        marker.coordinates = { x: this.props.coord[0], y: this.props.coord[1] };

        if (this.state.tab === 'event') {
            // Modifify dates.
            let start = new Date(this.state.event.start_date + " " + this.state.event.start_hour);
            let end = new Date(this.state.event.end_date + " " + this.state.event.end_hour);

            marker.dates = { start, end };
            delete marker.start_hour;
            delete marker.start_date;
            delete marker.end_hour;
            delete marker.end_date;
        }

        this.props.addMarker(this.state.tab, marker);
    }

    handleInputChange = (event) => {
        const target = event.target;
        let value;
        switch (target.type) {
            case "checkbox":
                value = target.checked;
                break;
            case "select-multiple":
                value = [...target.options].filter(o => o.selected).map(o => o.value)
                break;
            default:
                value = target.value;
                break;
        }
        const name = target.name;

        let obj = this.state[this.state.tab];
        obj[name] = value;
        
        this.setState({
            [this.state.tab]: obj
        });
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
                                        <Label for="title">Nom du Lieu</Label>
                                        <Input type="text" name="title" value={this.state.location.title} onChange={this.handleInputChange} placeholder="Grande Cathédrale D'Abaddon" required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="types">Type</Label>
                                        <Input type="select" name="types" multiple value={this.state.location.types} onChange={this.handleInputChange} required>
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
                                        <Input type="text" name="contact" placeholder="Abaddon.6666" value={this.state.location.contact} onChange={this.handleInputChange} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="opening_hours">Horaires d'Activité</Label>
                                        <Input type="text" name="opening_hours" placeholder="Tous les jours 20h-22h" value={this.state.location.opening_hours} onChange={this.handleInputChange} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="description">Description.</Label>
                                        <Input type="textarea" name="description" value={this.state.location.description} onChange={this.handleInputChange} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="site">Site web</Label>
                                        <Input type="text" name="site" placeholder="http://monforum.gw2rp-tools.ovh/la-cathedrale-abaddon" value={this.state.location.site} onChange={this.handleInputChange} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="icon">Icone</Label>
                                        <Input type="select" name="icon" value={this.state.location.icon} onChange={this.handleInputChange} required>
                                            <option value="tavern">Taverne</option>
                                            <option value="guild">Guilde</option>
                                            <option value="merchant">Commerce</option>
                                            <option value="other">Divers</option>
                                        </Input>
                                    </FormGroup>
                                    {this.props.error &&
                                        <Alert color='danger'>
                                            {this.props.error}
                                        </Alert>
                                    }
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
                                        <Label for="title">Titre de l'évènement</Label>
                                        <Input type="text" name="title" placeholder="Attaque de Centaures" value={this.state.event.title} onChange={this.handleInputChange} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="difficulty">Difficulté</Label>
                                        <Input type="select" name="difficulty" value={this.state.event.difficulty} onChange={this.handleInputChange} required>
                                            {Object.values(difficulties).map(difficulty => {
                                                return <option value={difficulty.id} key={difficulty.id}>{difficulty.name}</option>
                                            })}
                                        </Input>
                                        {event && event.difficulty &&
                                            <p style={{ color: difficulties[event.difficulty].color }}>{difficulties[event.difficulty].name} : {difficulties[event.difficulty].description}</p>
                                        }
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="types">Type</Label>
                                        <Input type="select" name="types" multiple value={this.state.event.types} onChange={this.handleInputChange} required>
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
                                        <Input type="text" name="contact" placeholder="Abaddon.6666" value={this.state.event.contact} onChange={this.handleInputChange} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="start_date">Date de début</Label>
                                        <Input type="date" name="start_date" value={this.state.event.start_date} onChange={this.handleInputChange} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="start_hour">Heure de début</Label>
                                        <Input type="time" name="start_hour" value={this.state.event.start_hour} onChange={this.handleInputChange} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="end_date">Date de fin</Label>
                                        <Input type="date" name="end_date" value={this.state.event.end_date} onChange={this.handleInputChange} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="end_hour">Heure de fin</Label>
                                        <Input type="time" name="end_hour" value={this.state.event.end_hour} onChange={this.handleInputChange} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="description">Description</Label>
                                        <Input type="textarea" rows="8" name="description" placeholder="Des centaures attaquent la Garnison de Kryte, les Séraphins recherchent de l'aide auprès de braves mercenaires." value={this.state.event.description} onChange={this.handleInputChange} required />
                                        <FormText color="muted">
                                            Vous pouvez utiliser les balises de mise en forme.
                                        </FormText>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="site">Page de l'évenement</Label>
                                        <Input type="text" name="site" placeholder="http://monforum.gw2rp-tools.ovh/events/une-attaque-centaure" value={this.state.event.site} onChange={this.handleInputChange} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="icon">Icone</Label>
                                        <Input type="select" name="icon" value={this.state.event.icon} onChange={this.handleInputChange} >
                                            <option value="generic">Générique</option>
                                            <option value="communitary">Communautaire</option>
                                            <option value="festival">Festivité</option>
                                            <option value="fight">Combat</option>
                                        </Input>
                                    </FormGroup>
                                    {this.props.error &&
                                        <Alert color='danger'>
                                            {this.props.error}
                                        </Alert>
                                    }
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
                            <div className="container mt-2">
                                <p className="text-info">Les rumeurs restent pour une durée de sept jours avant d'être supprimées automatiquement, à moins qu'elles ne soient mises à jour ou prolongée entre temps.</p>
                                <Form onSubmit={this.addMarker}>
                                    <FormGroup>
                                        <Label for="title">Titre de la Rumeur</Label>
                                        <Input type="text" name="title" placeholder="Un nouveau culte ?" value={this.state.rumor.title} onChange={this.handleInputChange} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="contact">Personne à contacter</Label>
                                        <Input type="text" name="contact" placeholder="Abaddon.6666" value={this.state.rumor.contact} onChange={this.handleInputChange} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="description">Description</Label>
                                        <Input type="textarea" rows="8" name="description" placeholder="Des centaures attaquent la Garnison de Kryte, les Séraphins recherchent de l'aide auprès de braves mercenaires." value={this.state.rumor.description} onChange={this.handleInputChange} required />
                                        <FormText color="muted">
                                            Vous pouvez utiliser les balises de mise en forme.
                                        </FormText>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="site">Page de la rumeur</Label>
                                        <Input type="text" name="site" placeholder="http://monforum.gw2rp-tools.ovh/rumor/un-nouveau-culte" value={this.state.rumor.site} onChange={this.handleInputChange} />
                                    </FormGroup>
                                    {this.props.error &&
                                        <Alert color='danger'>
                                            {this.props.error}
                                        </Alert>
                                    }
                                    <div className="clearfix">
                                        <div className="float-right">
                                            <Button type="submit" color="primary">Ajouter</Button>
                                            <Button className="ml-2" type="button" color="secondary">Annuler</Button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </TabPane>
                    </TabContent>
                </ModalBody>
            </Modal>
        );
    }
}

export default NewMarkerModal;