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
        console.log(location);
        return Axios({
            method: "POST",
            baseURL: API_URL,
            url: '/locations',
            data: {
                name: location.name,
                description: location.description,
                contact: location.contact,
                coord: location.coord,
                category: location.category,
                types: location.type,
                icon: location.icon,
                hours: location.hours,
                site: location.site,
                token: this.authService.getToken()
            }
        }).then(res => {
            if (res.data.success) {
                const created = res.data.location;
                const coord = created.coord.substr(1, created.coord.length - 2).split(",");
                created.coord = coord;
                this.locations.push(created);
                this.dispatch();
                return created;
            }

            throw { message: res.data.message ? res.data.message.message : "An error occured." };
        }).catch(err => {
            throw err;
        })
    }

}

export default new LocationsService();