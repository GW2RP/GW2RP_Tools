import React, { Component } from 'react'
import Loader from '../../Commons/Loader';
import Contract from './Contract';

import './Board.css';

import Woodbackground from './bg_wood.jpg';

export default class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contracts: null,
      columnClass: 'c3',
    }
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.onResize);
    this.onResize();
    this.props.contractsService.getAll().then(contracts => {
      this.setState({ contracts });

      this.props.contractsService.subscribe(contracts => {
        this.setState({ contracts });
      });
    });
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.onResize);
  }

  acceptContract = (id) => {
    return this.props.contractsService.acceptContract(id);
  }

  declineContract = (id) => {
    return this.props.contractsService.declineContract(id);
  }

  deleteContract = (id) => {
    this.props.contractsService.deleteOne(id).then(() => {
      
    }).catch(err => {
      console.error(err);
    });
  }

  onResize = (event) => {
    const width = window.innerWidth;
    if (width >= 1200) {
      this.setState({ columnClass: 'c5' });
    } else if (width >= 992) {
      this.setState({ columnClass: 'c4' });
    } else if (width >= 768) {
      this.setState({ columnClass: 'c3' });
    } else if (width >= 576) {
      this.setState({ columnClass: 'c2' });
    } else {
      this.setState({ columnClass: 'c1' });
    }
  }

  filterUserContracts = () => {
    this.setState({ filterUserContracts: true });
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
    
    let contractsToDisplay = contracts;
    if (this.state.filterUserContracts) {
      contractsToDisplay = contractsToDisplay.filter(c => c.owner.username === this.state.signedIn.toLowerCase());
    }

    return (
      <div className='container-fluid pt-2' style={{ background: `url(${Woodbackground})` }}>
        <div className='d-flex'>
          <div className='flex-grow-1'>
            <h1>Tableau des Contrats</h1>
          </div>
          {this.props.signedIn && [
            <div className='pl-2'>
              <button className='btn btn-light'>Contrats acceptés</button>
            </div>,
            <div className='pl-2'>
              <button className='btn btn-info' onClick={this.filterUserContracts} >Mes Contrats</button>
            </div>,
            <div className='pl-2'>
              <button className='btn btn-success'>Nouveau Contrat</button>
            </div>
          ]}
        </div>
        <div className={`card-columns ${this.state.columnClass}`}>
          {contracts.map((contract, index) =>
            <Contract
              key={index}
              contract={contract}
              signedIn={this.props.signedIn}
              acceptContract={this.acceptContract}
              declineContract={this.declineContract}
              deleteContract={this.deleteContract}
              />
          )}
        </div>
      </div>
    )
  }
}
