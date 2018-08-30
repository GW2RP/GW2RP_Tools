import React, { Component } from 'react';
import { Button } from 'reactstrap';

import './SideBar.css';

class SideBar extends Component {
    render() {
        const { isOpen, element } = this.props;

        if (isOpen && element) {
            return (
                <div className={`sideBar open`}>
                    <div className="element">
                        <div className="area title">
                            <h1 className="h4">{element.name || element.title}</h1>
                        </div>

                        <hr/>

                        {element.types &&
                            <div>
                                <div className="area">
                                    <h2 className="h5">Type</h2>
                                    <p>{element.types.join(', ')}</p>
                                </div>
                                <hr/>
                            </div>
                        }

                        {element.hours && 
                            <div>
                                <div className="area">
                                    <h2 className="h5">Horaires</h2>
                                    <p>{element.hours}</p>
                                </div>
                                <hr/>
                            </div>
                        }

                        {element.contact && 
                            <div>
                                <div className="area">
                                    <h2 className="h5">Contact</h2>
                                    <p>{element.contact}</p>
                                </div>
                                <hr/>
                            </div>
                        }

                        {element.site && 
                            <div>
                                <div className="area">
                                    <a href={element.site} target="_blank">Site Web</a>
                                </div>
                                <hr/>
                            </div>
                        }
                        
                        {element.description && 
                            <div>
                                <div className="area">
                                    <h2 className="h5">Description</h2>
                                    <p style={{ whiteSpace: "pre-wrap", maxHeight: "25vh", overflowY: "scroll" }}>{element.description}</p>
                                    <p className="text-info">Lire plus...</p>
                                </div>
                            </div>
                        }

                        {element.text && 
                            <div>
                                <div className="area">
                                    <h2 className="h5">Rumeur</h2>
                                    <p style={{ whiteSpace: "pre-wrap", maxHeight: "25vh", overflowY: "scroll" }}>{element.text}</p>
                                    <p className="text-info">Lire plus...</p>
                                </div>
                            </div>
                        }
                        
                        {this.props.editable &&
                            <div className="area pt-2 pb-2 actions">
                                <h2 className="h5">Actions</h2>
                                <Button color="secondary" className='ml-2'>Modifier</Button>
                                <Button color="success" className='ml-2' onClick={this.props.refreshElement}>Prolonger</Button>
                                <Button color="danger" className='ml-2' onClick={this.props.deleteElement}>Supprimer</Button>
                            </div>
                        }
                    </div>
                </div>
            );
        } else {
            return (
                <div className="sideBar">
                </div>
            );
        }
    }
}

export default SideBar;
