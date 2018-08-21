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

            return token;
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
            return Promise.resolve(false);
        }

        return Promise.resolve(true);

        return Axios({
            method: "POST",
            baseURL: API_URL,
            url: '/me',
            headers: {
                "Authorization": "Bearer " + token
            },
            data: {
                id: this.user_id,
                token
            }
        })
        .then(res => {
            return res.data.success
        })
        .catch(() => false);
    }

    onLogOut(listener) {
        if (listener) {
            this.listener = listener;
        } else {
            this.listener = null;
        }
    }
}

export default new AuthService();