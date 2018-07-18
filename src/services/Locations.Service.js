import Axios from 'axios';

import { API_URL } from '../configuration/Config';

class LocationsService {

    constructor() {
        this.locations = null;
        this.observers = [];
    }

    subscribe(update) {
        this.observers.push(update);
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

            return response.data.locations.map(r => {
                const coord = r.coord.substr(1, r.coord.length - 2).split(",");
                r.coord = coord;
                return r;
            });
        }).catch(err => {
            console.log("Could not fetch locations.")
            console.error(err);
            throw err;
        });
    }

}

export default new LocationsService();