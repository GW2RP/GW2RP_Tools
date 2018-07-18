import Axios from 'axios';

import { API_URL } from '../configuration/Config';

class RumoursService {

    constructor() {
        this.rumours = null;
        this.observers = [];
    }

    subscribe(update) {
        this.observers.push(update);
    }

    dispatch = () => {
        this.observers.forEach(observer => observer(this.rumours));
    }

    getAll = () => {
        return Promise.resolve().then(() => {
            if (this.rumours) {
                return this.rumours;
            }

            return this.fetchAll();
        });
    }

    fetchAll = () => {
        console.log("Fetching rumours...")
        return Axios({
            method: "GET",
            baseURL: API_URL,
            url: '/rumours'
        }).then(response => {
            console.log(response.data.rumours.length + " rumours fetched.")
            return response.data.rumours;
        }).catch(err => {
            console.log("Could not fetch rumours.")
            console.error(err);
            throw err;
        });
    }

}

export default new RumoursService();