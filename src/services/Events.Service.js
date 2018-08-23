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

    create = (event) => {
        console.log('Creating an Event...');
        return Axios({
            method: 'POST',
            baseURL: API_URL,
            url: '/Events',
            headers: {
                'Authorization': `Bearer ${this.authService.getToken()}`,
            },
            data: {
                event,
            },
        }).then(response => {
            console.log('Event created.');
            this.events.push(response.data.event);
            this.dispatch();
            return response.data.event;
        }).catch(err => {
            console.log('Could not create event.');
            console.error(err);
            throw err;
        });
    }
}

export default new EventsService();