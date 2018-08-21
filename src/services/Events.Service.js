import Axios from 'axios';

import { API_URL } from '../configuration/Config';

class EventsService {

    constructor() {
        this.events = null;
        this.observers = [];
    }

    setAuth(authService) {
        this.authService = authService;
    }

    subscribe(update) {
        this.observers.push(update);
    }

    dispatch = () => {
        this.observers.forEach(observer => observer(this.events));
    }

    getAll = () => {
        return Promise.resolve().then(() => {
            if (this.events) {
                return this.events;
            }

            return this.fetchAll();
        });
    }

    fetchAll = () => {
        console.log("Fetching events...")
        return Axios({
            method: "GET",
            baseURL: API_URL,
            url: '/events'
        }).then(response => {
            console.log(response.data.events.length + " events fetched.");
            this.events = response.data.events;
            this.dispatch();
            return response.data.events;
        }).catch(err => {
            console.log("Could not fetch events.")
            console.error(err);
            throw err;
        });
    }

}

export default new EventsService();