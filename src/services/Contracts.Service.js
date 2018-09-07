import Axios from 'axios';

import { API_URL } from '../configuration/Config';

class ContractsService {

  constructor() {
    this.contracts = null;
    this.observers = [];
  }

  setAuth(authService) {
    this.authService = authService;
  }

  subscribe(update) {
    this.observers.push(update);
  }

  dispatch = () => {
    this.observers.forEach(observer => observer(this.contracts));
  }

  getAll = () => {
    return Promise.resolve().then(() => {
      if (this.contracts) {
        return this.contracts;
      }

      return this.fetchAll();
    });
  }

  fetchAll = () => {
    console.log("Fetching contracts...")
    return Axios({
      method: "GET",
      baseURL: API_URL,
      url: '/contracts'
    }).then(response => {
      console.log(response.data.contracts.length + " contracts fetched.");
      this.contracts = response.data.contracts;
      this.dispatch();
      return response.data.contracts;
    }).catch(err => {
      console.log("Could not fetch contracts.")
      console.error(err);
      throw err;
    });
  }

  fetchOne = (id) => {
    console.log("Fetching contract...")
    return Axios({
      method: "GET",
      baseURL: API_URL,
      url: '/contracts/' + id,
    }).then(response => {
      return response.data.contract;
    }).catch(err => {
      console.log("Could not fetch contract.")
      console.error(err);
      throw err;
    });
  }

  create = (contract) => {
    console.log('Creating a Contract...');
    return Axios({
      method: 'POST',
      baseURL: API_URL,
      url: '/contracts',
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`,
      },
      data: {
        contract,
      },
    }).then(response => {
      console.log('Contract created.');
      this.contracts.push(response.data.contract);
      this.dispatch();
      return response.data.contract;
    }).catch(err => {
      console.log('Could not create contract.');
      console.error(err);
      throw err;
    });
  }

  deleteOne = (id) => {
    console.log("Deleting contract...")
    return Axios({
      method: "DELETE",
      baseURL: API_URL,
      url: '/contracts/' + id,
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`,
      },
    }).then(response => {
      this.contracts = this.contracts.filter(c => c._id !== id);
      this.dispatch();
      return;
    }).catch(err => {
      console.log("Could not delete contract.")
      console.error(err);
      throw err;
    });
  }

  updateOne = (id, contract) => {
    console.log('updating a Contract...');
    return Axios({
      method: 'PUT',
      baseURL: API_URL,
      url: '/contracts/' + id,
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`,
      },
      data: {
        contract,
      },
    }).then(response => {
      console.log('Contract updated.');

      const index = this.contracts.findIndex(c => c._id === id);
      if (index > -1) {
        return this.fetchOne(id).then(contract => {
          this.contracts[index] = contract;
          this.dispatch();
          return;
        });
      }
      
      return;
    }).catch(err => {
      console.log('Could not update contract.');
      console.error(err);
      throw err;
    });
  }

  acceptContract = (id) => {
    console.log("Accepting contract...")
    return Axios({
      method: "POST",
      baseURL: API_URL,
      url: '/contracts/' + id + '/accept',
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`,
      },
    }).then(response => {
      const index = this.contracts.findIndex(c => c._id === id);
      if (index > -1) {
        return this.fetchOne(id).then(contract => {
          this.contracts[index] = contract;
          this.dispatch();
          return;
        });
      }
      return;
    }).catch(err => {
      console.log("Could not accept contract.")
      console.error(err);
      throw err;
    });
  }

  declineContract = (id) => {
    console.log("Declining contract...")
    return Axios({
      method: "POST",
      baseURL: API_URL,
      url: '/contracts/' + id + '/decline',
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`,
      },
    }).then(response => {
      const index = this.contracts.findIndex(c => c._id === id);
      if (index > -1) {
        return this.fetchOne(id).then(contract => {
          this.contracts[index] = contract;
          this.dispatch();
          return;
        });
      }
      return;
    }).catch(err => {
      console.log("Could not decline contract.")
      console.error(err);
      throw err;
    });
  }
}

export default new ContractsService();