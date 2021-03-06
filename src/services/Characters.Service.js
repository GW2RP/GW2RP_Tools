import Axios from 'axios';

import { API_URL } from '../configuration/Config';

class CharactersService {

    constructor() {
        this.characters = null;
        this.observers = [];
    }

    setAuth(authService) {
        this.authService = authService;
    }

    subscribe(update) {
        this.observers.push(update);
    }

    dispatch = () => {
        this.observers.forEach(observer => observer(this.characters));
    }

    getAll = () => {
        return Promise.resolve().then(() => {
            if (this.characters) {
                return this.characters;
            }

            return this.fetchAll();
        });
    }

    fetchAll = () => {
        console.log("Fetching characters...")
        return Axios({
            method: "GET",
            baseURL: API_URL,
            url: '/characters'
        }).then(response => {
            console.log(response.data.characters.length + " characters fetched.");
            this.characters = response.data.characters;
            this.dispatch();
            return response.data.characters;
        }).catch(err => {
            console.log("Could not fetch characters.")
            console.error(err);
            if (err.response && err.response.data) {
                throw { message: err.response.data.error.message || "Nous n'avons pas pu vous enregistrer.", id: err.response.data.error.id, details: err.response.data.error.details };
            }
            throw { message: "Nous n'avons pas pu contacter le serveur dans les Brumes.", id: "NETWORK_ERROR" };
        });
    }

    fetchOne = (id) => {
        console.log("Fetching character...")
        return Axios({
            method: "GET",
            baseURL: API_URL,
            url: '/characters/' + id,
        }).then(response => {
            return response.data.character;
        }).catch(err => {
            console.log("Could not fetch character.")
            console.error(err);
            if (err.response && err.response.data) {
                throw { message: err.response.data.error.message || "Nous n'avons pas pu vous enregistrer.", id: err.response.data.error.id, details: err.response.data.error.details };
            }
            throw { message: "Nous n'avons pas pu contacter le serveur dans les Brumes.", id: "NETWORK_ERROR" };
        });
    }

    create = (character) => {
        console.log('Creating a Character...');
        return Axios({
            method: 'POST',
            baseURL: API_URL,
            url: '/characters',
            headers: {
                'Authorization': `Bearer ${this.authService.getToken()}`,
            },
            data: {
                character,
            },
        }).then(response => {
            console.log('Character created.');
            this.characters.push(response.data.character);
            this.dispatch();
            return response.data.character;
        }).catch(err => {
            console.log('Could not create character.');
            console.error(err);
            if (err.response && err.response.data) {
                throw { message: err.response.data.error.message || "Nous n'avons pas pu vous enregistrer.", id: err.response.data.error.id, details: err.response.data.error.details };
            }
            throw { message: "Nous n'avons pas pu contacter le serveur dans les Brumes.", id: "NETWORK_ERROR" };
        });
    }

    deleteOne = (id) => {
        console.log("Deleting character...")
        return Axios({
            method: "DELETE",
            baseURL: API_URL,
            url: '/characters/' + id,
            headers: {
                'Authorization': `Bearer ${this.authService.getToken()}`,
            },
        }).then(response => {
            this.characters = this.characters.filter(c => c._id !== id);
            this.dispatch();
            return;
        }).catch(err => {
            console.log("Could not delete character.")
            console.error(err);
            if (err.response && err.response.data) {
                throw { message: err.response.data.error.message || "Nous n'avons pas pu vous enregistrer.", id: err.response.data.error.id, details: err.response.data.error.details };
            }
            throw { message: "Nous n'avons pas pu contacter le serveur dans les Brumes.", id: "NETWORK_ERROR" };
        });
    }

    update = (id, character) => {
        console.log('Updating a Character...');
        return Axios({
            method: 'PUT',
            baseURL: API_URL,
            url: '/characters/' + id,
            headers: {
                'Authorization': `Bearer ${this.authService.getToken()}`,
            },
            data: {
                character,
            },
        }).then(response => {
            console.log('Character updated.');
            
            const index = this.characters.findIndex(c => c._id === id);
            if (index > -1) {
                return this.fetchOne(id).then(character => {
                this.characters[index] = character;
                this.dispatch();
                return response.data.character;
                });
            }

            return response.data.character;
        }).catch(err => {
            console.log('Could not update character.');
            console.error(err);
            if (err.response && err.response.data) {
                throw { message: err.response.data.error.message || "Nous n'avons pas pu vous enregistrer.", id: err.response.data.error.id, details: err.response.data.error.details };
            }
            throw { message: "Nous n'avons pas pu contacter le serveur dans les Brumes.", id: "NETWORK_ERROR" };
        });
    }
}

export default new CharactersService();