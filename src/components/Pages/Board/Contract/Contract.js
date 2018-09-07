import React, { Component } from 'react'
import { Users, X, Edit2 } from 'react-feather';

import PaperBackground from './paper.jpg';
import CopperCoin from './Copper_coin.png';
import SilverCoin from './Silver_coin.png';
import GoldCoin from './Gold_coin.png';

export default class Contract extends Component {
    acceptContract = () => {
        this.props.acceptContract(this.props.contract._id).then(() => {
            this.forceUpdate();
        }).catch(err => {
            console.error(err);
        });
    }

    declineContract = () => {
        this.props.declineContract(this.props.contract._id).then(() => {
            this.forceUpdate();
        }).catch(err => {
            console.error(err);
        });
    }

    deleteContract = () => {
        this.props.deleteContract(this.props.contract._id);
    }

    render() {
        const { contract, signedIn } = this.props;

        let acceptOrDecline;
        if (signedIn) {
            if (contract.pretenders.findIndex(p => p.username === signedIn.toLowerCase()) === -1) {
                acceptOrDecline = <button className='btn btn-link text-success' onClick={this.acceptContract}>Accepter le contrat.</button>;
            } else {
                acceptOrDecline = <button className='btn btn-link text-danger' onClick={this.declineContract}>Abandonner le contrat.</button>;
            }
        }

        let canEdit = false;
        if (signedIn && contract.owner.username === signedIn.toLowerCase()) {
            canEdit = true;
        }

        return (
            <div className="card" style={{ background: `url(${PaperBackground})` }}>
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <h5 className='card-title flex-grow-1'>{contract.title}</h5>
                        {canEdit && <button className='btn btn-link text-muted' title='Editer' onClick={() => this.props.editContract(this.props.contract)}><Edit2 /></button>}
                        {canEdit && <button className='btn btn-link text-danger' title='Supprimer' onClick={this.deleteContract}><X /></button>}
                    </div>
                    
                    <div className="d-flex justify-content-between">
                        <div className='p-2' title='Personnes ayant accepté le contrat.'>
                            <Users /> <span className='align-top font-weight-bold' style={{ fontSize: '1.2rem' }}>{contract.pretenders.length}</span>
                        </div>
                        <div className="p-2">
                            {contract.status === 'OPEN' ?
                                    <div className='text-success'>
                                        Disponible
                                    </div>
                                :
                                    <div className='text-danger'>
                                        Achevé
                                    </div>
                            }
                        </div>
                    </div>
                    <p className='card-text'><strong>Récompense:</strong> {contract.reward}</p>
                    <p className='card-text'>{contract.description}</p>
                    {acceptOrDecline}
                    <p class='card-text'><small className='text-mutued'>{contract.owner.username} <em>({contract.owner.gw2_account})</em></small></p>
                </div>
            </div>
        )
    }
}
