import Axios from "axios";

import { API_URL } from '../configuration/Config';
class AuthService {

    constructor() {
        this.token = null;
        this.username = null;
        this.user_id = null;
        this.is_admin = false;
    }

    getToken() {
        return this.token;
    }

    setToken(token) {
        try {
            const data = JSON.parse(atob(token.split(".")[1]));
            this.username = data.username;
            this.admin = data.admin || false;
            this.token = token;
            
            localStorage.setItem("token", token);
            localStorage.setItem("username", data.username);
        } catch (e) {
            console.error("Invalid token in memory.");
            this.username = null;
            this.admin = false;
            this.token = null;
        }
    }
    
    setUser(username) {
        this.username = username;
    }

    signIn(username, password) {
        return Axios({
            method: "POST",
            baseURL: API_URL,
            url: '/auth',
            data: {
                username,
                password
            }
        }).then(response => {
            // Parse token.
            const token = response.data.token;
            this.setToken(token);

            return {token, user: { username: this.username, admin: this.admin }};
        }).catch(err => {
            if (err.response && err.response.data) {
                throw { message: err.response.data.error.message || "Nous n'avons pas pu vous identifier.", id: err.response.data.error.id };
            }
            throw { message: "Nous n'avons pas pu contacter le serveur dans les Brumes.", id: "NETWORK_ERROR" };
        });
    }

    isSignedIn() {
        return this.token && this.username;
    }

    signOut() {
        return Promise.resolve().then(() => {
            this.setToken(null);
            localStorage.removeItem("token");
            if (this.listener) {
                this.listener();
            }
            return true;
        });
    }

    checkToken() {
        const token = this.getToken();

        if (!token) {
            return Promise.resolve({ success: false, user: {}});
        }

        try {
            const data = JSON.parse(atob(token.split(".")[1]));

            const expiration = new Date();

            expiration.setMilliseconds(data.exp);
            
            if (expiration <= new Date()) {
                return Promise.resolve({ success: false, user: {} });
            }
            return Promise.resolve({ success: true, user: { username: this.username, admin: this.admin }});
        } catch (e) {
            return Promise.resolve({ success: false, user: {} });
        }
    }

    onLogOut(listener) {
        if (listener) {
            this.listener = listener;
        } else {
            this.listener = null;
        }
    }

    signUp(user) {
        return Axios({
            method: "POST",
            baseURL: API_URL,
            url: '/signup',
            data: {
                user,
            }
        }).then(response => {
            console.log(response.data);
            return response.data;
        }).catch(err => {
            if (err.response && err.response.data) {
                throw { message: err.response.data.error.message || "Nous n'avons pas pu vous enregistrer.", id: err.response.data.error.id, details: err.response.data.error.details };
            }
            throw { message: "Nous n'avons pas pu contacter le serveur dans les Brumes.", id: "NETWORK_ERROR" };
        });
    }
}

export default new AuthService();