import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Edit3, Delete, Edit2, Edit } from 'react-feather';

class CharacterDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            character: null,
            modificationsPending: false,
        };
    }

    componentDidMount = () => {
        this.props.charactersService.fetchOne(this.props.selected).then(character => {
            this.setState({ character });
        });
    }

    fetchCharacter = (id) => {
        this.props.charactersService.fetchOne(id).then(character => {
            this.setState({ character });
        });
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (!this.state.character || (nextProps.selected !== this.state.character._id)) {
            this.fetchCharacter(nextProps.selected);
        }
        return true;
    }

    editField = (event, field) => {
        event.preventDefault();
    }

    deleteCharacteristic = (event, characteristic) => {
        event.preventDefault();
    }

    editCharacteristic = (event, characteristic) => {
        event.preventDefault();
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
        
        const { character } = this.state;

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
            <div>
                <div className='card'>
                    <div className='card-body'>
                        {this.state.modificationsPending &&
                            <div>
                                <p className='card-text text-info'>Vous avez des modifications non enregistrée. <a href='#' >Sauvegardez maintenant.</a></p>
                                <hr/>
                            </div>
                        }
                        <h2 className='h3 card-title'>{name} {editable && <Edit3 onClick={(event) => this.editField(event, 'title')} />}</h2>
                        <h3 className='h6 card-subtitle mb-2 text-muted'>Par {owner.username} <em>({owner.gw2_account})</em></h3>
                        <p className='card-text'>
                            {tags.map(tag => (
                                <Link key={tag} to={`/registre/tags/${tag}`} className="badge badge-light">{tag}</Link>
                            ))}
                              {editable && <em><a href='#' onClick={(event) => this.editField(event, 'tags')}>Modifier</a></em>}
                        </p>

                        <h4 className='h5'>Description</h4>
                        <p className='card-text'>
                            {description}
                            <br/>
                            {editable && <em><a href='#' onClick={(event) => this.editField(event, 'description')}>Modifier</a></em>}
                        </p>
                        
                        <h4 className='h5'>Apparance</h4>
                        <p className='card-text'>
                            {appearance}
                            <br/>
                            {editable && <em><a href='#' onClick={(event) => this.editField(event, 'appearance')}>Modifier</a></em>}
                        </p>

                        <h4 className='h5'>Histoire</h4>
                        <p className='card-text'>
                            {history}
                            <br/>
                            {editable && <em><a href='#' onClick={(event) => this.editField(event, 'history')}>Modifier</a></em>}
                        </p>

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
