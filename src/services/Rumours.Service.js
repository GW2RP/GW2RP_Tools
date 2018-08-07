import Axios from 'axios';

import { API_URL } from '../configuration/Config';

class RumoursService {

    constructor() {
        this.rumours = null;
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
            console.log(response.data.rumours.length + " rumours fetched.");
            // Parsing rumours.

            this.rumours = response.data.rumours.map(r => {
                const coord = r.coord.substr(1, r.coord.length - 2).split(",");
                r.coord = coord;
                return r;
            });

            this.dispatch();
            return this.rumours;
        }).catch(err => {
            console.log("Could not fetch rumours.")
            console.error(err);
            throw err;
        });
    }

    create = (rumor) => {
        console.log(rumor);
        return Axios({
            method: "POST",
            baseURL: API_URL,
            url: '/rumours',
            data: {
                name: rumor.title,
                text: rumor.text,
                contact: rumor.contact,
                coord: rumor.coord,
                category: rumor.category,
                site: rumor.site,
                token: this.authService.getToken()
            }
        }).then(res => {
            if (res.data.success) {
                return res.data.rumours;
            }
            throw { message: res.data.message ? res.data.message.message : "An error occured." };
        }).catch(err => {
            throw err;
        })
    }
}

export default new RumoursService();