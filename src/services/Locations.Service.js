import Axios from 'axios';

import { API_URL } from '../configuration/Config';

class LocationsService {

    constructor() {
        this.locations = null;
        this.observers = [];
    }

    setAuth(authService) {
        this.authService = authService;
    }

    subscribe(update) {
        this.observers.push(update);
    }

    unsubscribe(update) {
        const found = this.observers.findIndex(update);
        if (update > -1) {
            this.observers.splice(update, 1);
        }
    }

    dispatch = () => {
        this.observers.forEach(observer => observer(this.locations));
    }

    getAll = () => {
        return Promise.resolve().then(() => {
            if (this.locations) {
                return this.locations;
            }

            return this.fetchAll();
        });
    }

    fetchAll = () => {
        console.log("Fetching locations...")
        return Axios({
            method: "GET",
            baseURL: API_URL,
            url: '/locations'
        }).then(response => {
            console.log(response.data.locations.length + " locations fetched.");
            // Parsing locations.
            this.locations =  response.data.locations;
            this.dispatch();
            return this.locations;
        }).catch(err => {
            console.log("Could not fetch locations.")
            console.error(err);
            throw err;
        });
    }

    create = (location) => {
        console.log('Creating a Location...');
        return Axios({
            method: "POST",
            baseURL: API_URL,
            url: '/locations',
            headers: {
                'Authorization': `Bearer ${this.authService.getToken()}`,
            },
            data: {
                location,
            },
        }).then(response => {
            console.log('Location created.');
            this.locations.push(response.data.location);
            this.dispatch();
            return response.data.location;
        }).catch(err => {
            console.log('Could not create location.');
            console.error(err);
            throw err;
        });
    }

    deleteOne = (id) => {
        console.log("Deleting location...")
        return Axios({
            method: "DELETE",
            baseURL: API_URL,
            url: '/locations/' + id,
            headers: {
                'Authorization': `Bearer ${this.authService.getToken()}`,
            },
        }).then(response => {
            this.locations = this.locations.filter(l => l._id !== id);
            this.dispatch();
            return;
        }).catch(err => {
            console.log("Could not delete location.")
            console.error(err);
            throw err;
        });
    }
}

export default new LocationsService();