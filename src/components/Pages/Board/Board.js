import React, { Component } from 'react'
import Loader from '../../Commons/Loader';
import Contract from './Contract';
import EditContractModal from './EditContractModal';

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

  createContract = (contract) => {
    return this.props.contractsService.create(contract);
  }

  updateContract = (id, contract) => {
    return this.props.contractsService.updateOne(id, contract);
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
    this.setState({ filterUserContracts: !this.state.filterUserContracts });
  }

  filterAcceptedContracts = () => {
    this.setState({ filterAcceptedContracts: !this.state.filterAcceptedContracts });
  }

  toggleEditModal = () => {
    this.setState({ editModal: !this.state.editModal, editedContract: null });
  }

  editContract = (contract = null) => {
    this.setState({ editModal: !this.state.editModal, editedContract: contract });
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
    if (this.props.signedIn) {
      if (this.state.filterUserContracts) {
        contractsToDisplay = contractsToDisplay.filter(c => c.owner.username === this.props.signedIn.toLowerCase());
      }
      if (this.state.filterAcceptedContracts) {
        contractsToDisplay = contractsToDisplay.filter(c => c.pretenders.findIndex(p => p.username === this.props.signedIn.toLowerCase()) > -1);
      }
    }

    return (
      <div className='container-fluid pt-2' style={{ background: `url(${Woodbackground})`, height: '100%' }}>
        <EditContractModal
          isOpen={this.state.editModal}
          toggle={this.toggleEditModal}
          createContract={this.createContract}
          updateContract={this.updateContract}
          contract={this.state.editedContract} />
        <div className='d-flex'>
          <div className='flex-grow-1'>
            <h1>Tableau des Contrats</h1>
          </div>
          {this.props.signedIn && [
            <div className='pl-2'>
              <button className={`btn ${this.state.filterAcceptedContracts ? 'btn-light' : `btn-outline-light`}`} onClick={this.filterAcceptedContracts}>Contrats acceptés</button>
            </div>,
            <div className='pl-2'>
              <button className={`btn ${this.state.filterUserContracts ? 'btn-dark' : `btn-outline-dark`}`} onClick={this.filterUserContracts} >Mes Contrats</button>
            </div>,
            <div className='pl-2'>
              <button className='btn btn-success' onClick={this.toggleEditModal} >Nouveau Contrat</button>
            </div>
          ]}
        </div>
        <div className={`card-columns ${this.state.columnClass}`}>
          {contractsToDisplay.map((contract, index) =>
            <Contract
              key={index}
              contract={contract}
              signedIn={this.props.signedIn}
              acceptContract={this.acceptContract}
              declineContract={this.declineContract}
              deleteContract={this.deleteContract}
              toggleEditModal={this.toggleEditModal}
              editContract={this.editContract}
              />
          )}
        </div>
      </div>
    )
  }
}
