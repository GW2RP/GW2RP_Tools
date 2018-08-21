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
        return Axios({
            method: "POST",
            baseURL: API_URL,
            url: '/rumors',
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
                const created = res.data.rumour;
                const coord = created.coord.substr(1, created.coord.length - 2).split(",");
                created.coord = coord;
                this.rumors.push(created);
                this.dispatch();
                return created;
            }
            throw { message: res.data.message ? res.data.message.message : "An error occured." };
        }).catch(err => {
            throw err;
        })
    }
}

export default new RumoursService();