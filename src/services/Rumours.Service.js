import Axios from 'axios';

import { API_URL } from '../configuration/Config';

class RumoursService {

    constructor() {
        this.rumors = null;
        this.observers = [];
    }

    setAuth(authService) {
        this.authService = authService;
    }

    subscribe(update) {
        this.observers.push(update);
    }

    unsubscribe(update) {
        this.observers.remove(update);
    }

    dispatch = () => {
        this.observers.forEach(observer => observer(this.rumors));
    }

    getAll = () => {
        return Promise.resolve().then(() => {
            if (this.rumors) {
                return this.rumors;
            }

            return this.fetchAll();
        });
    }

    fetchAll = () => {
        console.log("Fetching rumors...")
        return Axios({
            method: "GET",
            baseURL: API_URL,
            url: '/rumors'
        }).then(response => {
            console.log(response.data.rumors.length + " rumors fetched.");

            this.rumors = response.data.rumors;
            this.dispatch();
            return this.rumors;
        }).catch(err => {
            console.log("Could not fetch rumors.")
            console.error(err);
            throw err;
        });
    }

    create = (rumor) => {
        console.log('Creating a Rumor...');
        return Axios({
            method: "POST",
            baseURL: API_URL,
            url: '/rumors',
            headers: {
                'Authorization': `Bearer ${this.authService.getToken()}`,
            },
            data: {
                rumor,
            },
        }).then(response => {
            console.log('Rumor created.');
            this.rumors.push(response.data.rumor);
            this.dispatch();
            return response.data.rumor;
        }).catch(err => {
            console.log('Could not create rumor.');
            console.error(err);
            throw err;
        });
    }

    deleteOne = (id) => {
        console.log("Deleting rumor...")
        return Axios({
            method: "DELETE",
            baseURL: API_URL,
            url: '/rumors/' + id,
            headers: {
                'Authorization': `Bearer ${this.authService.getToken()}`,
            },
        }).then(response => {
            this.rumors = this.rumors.filter(r => r._id !== id);
            this.dispatch();
            return;
        }).catch(err => {
            console.log("Could not delete rumor.")
            console.error(err);
            throw err;
        });
    }
}

export default new RumoursService();