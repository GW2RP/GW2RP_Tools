import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Edit3, Delete, Edit2, Edit } from 'react-feather';

import { formatText } from '../../../../../utils/formatter';

class CharacterDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            character: null,
            modificationsPending: false,
            editing: null,
        };
    }

    componentDidMount = () => {
        this.fetchCharacter(this.props.selected);
    }

    fetchCharacter = (id) => {
        this.props.charactersService.fetchOne(id).then(character => {
            this.setState({ character, editing: null, modificationsPending: false });
        });
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (!this.state.character || (nextProps.selected !== this.state.character._id)) {
            this.fetchCharacter(nextProps.selected);
        }
        return true;
    }

    onFieldChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        const { character } = this.state;
        character[name] = value;
        
        this.setState({
            character,
        });
    }

    editField = (event, field) => {
        event.preventDefault();
        switch (field) {
            case 'name':
                this.setState({
                    editing: 'NAME',
                });
                break;
            case 'tags':
                this.setState({
                    editing: 'TAGS',
                });
                break;
            case 'description':
                this.setState({
                    editing: 'DESCRIPTION',
                });
                break;
            case 'history':
                this.setState({
                    editing: 'HISTORY',
                });
                break;
            case 'appearance':
                this.setState({
                    editing: 'APPEARANCE',
                });
                break;
            default:
                this.setState({
                    editing: null,
                });
        }
    }

    saveField = (event) => {
        const { character } = this.state;
        
        const { name, tags, description, appearance, history, sheet } = character;

        this.props.charactersService.update(this.props.selected, { name, tags, description, appearance, history, sheet }).then(() => {
            this.setState({
                editing: null,
            });
        }).catch(err => {
            console.error(err);
        });
    }

    deleteCharacteristic = (event, characteristic) => {
        event.preventDefault();
        console.log(characteristic);
    }

    editCharacteristic = (event, characteristic) => {
        event.preventDefault();
        console.log(characteristic);
    }

    deleteCharacter = (event) => {
        event.preventDefault();
        this.props.charactersService.deleteOne(this.state.character._id).then(() => {
            this.setState({ deleted: true });
        }).catch(err => {
            console.error(err);
        });
    }

    render() {
        if (this.state.deleted) {
            return (
                <Redirect to='/registre'/>
            );
        }
        
        const { character, editing } = this.state;

        if (!character) {
            return (
                <div>
                    Loading.
                </div>
            )
        }

        const { name, owner, tags, description, appearance, history, sheet } = character;

        const editable = (this.props.currentUser.username.toLowerCase() === owner.username.toLowerCase()) || this.props.currentUser.admin;

        return (
            <div className='card' style={{ height: '94vh', overflowY: 'scroll'}}>
                <div className='card-body'>
                    {this.state.modificationsPending &&
                        <div>
                            <p className='card-text text-info'>Vous avez des modifications non enregistrée. <a href='#' >Sauvegardez maintenant.</a></p>
                            <hr/>
                        </div>
                    }
                    <h2 className='h3 card-title'>{name} {editable && <Edit3 onClick={(event) => this.editField(event, 'name')} />}</h2>
                    <h3 className='h6 card-subtitle mb-2 text-muted'>Par {owner.username} <em>({owner.gw2_account})</em></h3>
                    <p className='card-text'>
                        {tags.map(tag => (
                            <Link key={tag} to={`/registre/tags/${tag}`} className="badge badge-light">{tag}</Link>
                        ))}
                        {editable && <em><a href='#' onClick={(event) => this.editField(event, 'tags')}>Modifier les tags.</a></em>}
                    </p>

                    <h4 className='h5'>Description</h4>
                    {editing === 'DESCRIPTION' ?
                        (
                            <div className='form-group'>
                                <textarea className='form-control' rows='5' name='description' value={description} onChange={this.onFieldChange} />
                                <button className='btn btn-success w-100' name='description' onClick={this.saveField}>Enregistrer</button>
                            </div>    
                        )
                        :
                        (
                            <p className='card-text'>
                                <span dangerouslySetInnerHTML={{ __html: formatText(description) }}></span>
                                <br/>
                                {editable && <em><a href='#' onClick={(event) => this.editField(event, 'description')}>Modifier</a></em>}
                            </p>    
                        )
                    }
                    
                    <h4 className='h5'>Apparance</h4>
                    {editing === 'APPEARANCE' ?
                        (
                            <div className='form-group'>
                                <textarea className='form-control' rows='5' name='appearance' value={description} onChange={this.onFieldChange} />
                                <button className='btn btn-success w-100' name='appearance' onClick={this.saveField}>Enregistrer</button>
                            </div>    
                        )
                        :
                        (
                            <p className='card-text'>
                                <span dangerouslySetInnerHTML={{ __html: formatText(appearance) }}></span>
                                <br/>
                                {editable && <em><a href='#' onClick={(event) => this.editField(event, 'appearance')}>Modifier</a></em>}
                            </p>   
                        )
                    }

                    <h4 className='h5'>Histoire</h4>
                    {editing === 'HISTORY' ?
                        (
                            <div className='form-group'>
                                <textarea className='form-control' rows='5' name='history' value={history} onChange={this.onFieldChange} />
                                <button className='btn btn-success w-100' name='history' onClick={this.saveField}>Enregistrer</button>
                            </div>    
                        )
                        :
                        (
                            <p className='card-text'>
                                <span dangerouslySetInnerHTML={{ __html: formatText(history) }}></span>
                                <br/>
                                {editable && <em><a href='#' onClick={(event) => this.editField(event, 'history')}>Modifier</a></em>}
                            </p>
                        )
                    }

                    <hr/>

                    <h4 className='h5'>Fiche de Personnage</h4>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Caractéristiques</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sheet.characteristics.map(characteristic => (
                                <tr key={characteristic.name}>
                                    <th scope='row'>{characteristic.name}</th>
                                    <td>{characteristic.value}</td>
                                    <td>{characteristic.remark}</td>
                                    {editable && 
                                        <td className='text-right'>
                                            <a href='#' className='text-danger' onClick={(event) => this.deleteCharacteristic(event, characteristic.name)} ><Delete /></a>
                                            <a href='#' className='text-info ml-2' onClick={(event) => this.editCharacteristic(event, characteristic.name)}><Edit /></a>
                                        </td>
                                    }
                                </tr>
                            ))}
                        </tbody>
                        {editable &&
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className='text-right'><a href='#' className='text-success'>Nouvelle Caractéristique</a></td>
                                </tr>
                            </tfoot>
                        }
                    </table>

                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Compétences</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sheet.skills.map(skill => (
                                <tr key={skill.name}>
                                    <th scope='row'>{skill.name}</th>
                                    <td>{skill.value}</td>
                                    <td>{skill.remark}</td>
                                    {editable && 
                                        <td className='text-right'>
                                            <a href='#' className='text-danger' onClick={(event) => this.deleteSkill(event, skill.name)} ><Delete /></a>
                                            <a href='#' className='text-info ml-2' onClick={(event) => this.editSkill(event, skill.name)}><Edit /></a>
                                        </td>
                                    }
                                </tr>
                            ))}
                        </tbody>
                        {editable &&
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className='text-right'><a href='#' className='text-success'>Nouvelle Compétence</a></td>
                                </tr>
                            </tfoot>
                        }
                    </table>

                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Dons</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sheet.feats.map(feat => (
                                <tr key={feat.name}>
                                    <th scope='row'>{feat.name}</th>
                                    <td>{feat.type}</td>
                                    <td>{feat.description}</td>
                                    {editable && 
                                        <td className='text-right'>
                                            <a href='#' className='text-danger' onClick={(event) => this.deleteFeat(event, feat.name)} ><Delete /></a>
                                            <a href='#' className='text-info ml-2' onClick={(event) => this.editFeat(event, feat.name)}><Edit /></a>
                                        </td>
                                    }
                                </tr>
                            ))}
                        </tbody>
                        {editable &&
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className='text-right'><a href='#' className='text-success'>Nouveau Don</a></td>
                                </tr>
                            </tfoot>
                        }
                    </table>

                    <hr/>
                    {editable &&
                        <div className='row justify-content-end'>
                            <div className='col text-right'>
                                <button className='btn btn-danger' onClick={this.deleteCharacter} >Supprimer</button>
                                {this.state.modificationsPending &&
                                    <button className='ml-2 btn btn-info'>Sauvegarder</button>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
            
        );
    }
}

CharacterDetails.propTypes = {
    charactersService: PropTypes.object.isRequired,
    selected: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired,
};

export default CharacterDetails;
