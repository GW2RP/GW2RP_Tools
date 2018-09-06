import React, { Component } from 'react'
import { Users } from 'react-feather';

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

        return (
            <div className="card">
                <div className="card-body">
                    <h5 className='card-title'>{contract.title}</h5>
                    <div className="d-flex justify-content-between">
                        <div className='p-2'>
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
