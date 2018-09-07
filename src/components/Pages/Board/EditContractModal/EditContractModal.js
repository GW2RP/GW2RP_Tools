import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class EditContractModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      id: null,
      title: '',
      reward: '',
      type: 'other',
      site: '',
      description: '',
      status: 'OPEN',
    };
  }

  componentDidUpdate = () => {
    const { contract } = this.props;
    if (contract && (contract._id !== this.state.id)) {
      this.setState({
        title: contract.title,
        reward: contract.reward,
        type: contract.type,
        site: contract.site || '',
        description: contract.description,
        id: contract._id
      });
    } else if (!contract && this.state.id) {
      this.setState({
        id: null,
        title: '',
        reward: '',
        type: 'other',
        site: '',
        description: '',
      })
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { title, type, description, reward, site, status } = this.state;

    if (this.props.contract) {
      this.props.updateContract(this.props.contract._id, {
        title,
        type,
        description,
        reward,
        site,
        status,
      }).then(() => {
        this.props.toggle();
      }).catch(err => {
        console.error(err);
      });
    } else {
      this.props.createContract({
        title,
        type,
        description,
        reward,
        site,
      }).then(() => {
        this.props.toggle();
      }).catch(err => {
        console.error(err);
      });
    }
  }

  render() {
    return (
      <Modal toggle={this.props.toggle} isOpen={this.props.isOpen}>
        <ModalHeader toggle={this.props.toggle}>Nouveau Contrat</ModalHeader>
        <ModalBody>
          <form id='newContractForm' onSubmit={this.handleSubmit}>
            <div className='form-group'>
              <label>Titre</label>
              <input type='text' className='form-control' name='title' value={this.state.title} onChange={this.handleInputChange} required autoFocus />
            </div>
            {this.props.contract &&
              <div className='form-group'>
                <label>Status</label>
                <select className='form-control' name='status' value={this.state.status} onChange={this.handleInputChange} >
                  <option value='CLOSED'>Terminé</option>
                  <option value='OPEN'>Ouvert</option>
                </select>
              </div>
            }
            <div className='form-group'>
              <label>Récompense</label>
              <input type='text' className='form-control' name='reward' placeholder='1 po 5 pa 13 pc' value={this.state.reward} onChange={this.handleInputChange} required />
            </div>
            <div className='form-group'>
              <label>Description</label>
              <textarea rows='4' className='form-control' name='description' value={this.state.description} onChange={this.handleInputChange} required />
            </div>
            <div className='form-group'>
              <label>Type</label>
              <select className='form-control' name='type' value={this.state.type} onChange={this.handleInputChange} required >
                <option value='hunt'>Chasse</option>
                <option value='wanted'>Prime</option>
                <option value='work'>Travail</option>
                <option value='other'>Autre</option>
              </select>
            </div>
            <div className='form-group'>
              <label>Site web <em>(optionel)</em></label>
              <input type='text' className='form-control' name='site' value={this.state.site} onChange={this.handleInputChange} />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button type="submit" form='newContractForm' className="btn btn-success">Créer</button>
        </ModalFooter>
      </Modal>
    )
  }
}
