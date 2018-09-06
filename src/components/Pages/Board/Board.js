import React, { Component } from 'react'
import Loader from '../../Commons/Loader';
import Contract from './Contract';

import './Board.css';

export default class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contracts: null,
    }
  }

  componentDidMount = () => {
    this.props.contractsService.getAll().then(contracts => {
      this.setState({ contracts });

      this.props.contractsService.subscribe(contracts => {
        console.log(contracts);
        this.setState({ contracts });
      });
    })
  }

  acceptContract = (id) => {
    return this.props.contractsService.acceptContract(id);
  }

  declineContract = (id) => {
    return this.props.contractsService.declineContract(id);
  }

  render() {
    const { contracts } = this.state;

    if (!contracts) {
      return (
        <div className='container-fluid text-center'>
          <Loader />
        </div>
      )
    }

    return (
      <div className='container-fluid pt-2'>
        <div className='d-flex'>
          <div className='flex-grow-1'>
            <h1>Tableau des Contrats</h1>
          </div>
          <div>
            <button className='btn btn-success'>Nouveau Contrat</button>
          </div>
        </div>
        <div className='card-columns' id='contracts-board'>
          {contracts.map((contract, index) =>
            <Contract
              key={index}
              contract={contract}
              signedIn={this.props.signedIn}
              acceptContract={this.acceptContract}
              declineContract={this.declineContract}
              />
          )}
        </div>
      </div>
    )
  }
}
