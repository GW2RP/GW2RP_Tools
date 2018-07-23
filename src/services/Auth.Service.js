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
            const data = JSON.parse(atob(token.split(".")[1]));;
            this.user_id = data.user_id;
            this.is_admin = data.admin;
            this.token = token;
        } catch (e) {
            console.error("Invalid token in memory.");
            this.user_id = null;
            this.is_admin = null;
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
            url: '/login',
            data: {
                nick_name: username,
                password
            }
        }).then(response => {
            if (!response.data.success) {
                throw new Error(response.data.message || "Une erreur est survenue.");
            }
            // Store token in localStorage.
            localStorage.setItem("username", username);
            this.username = username;
            localStorage.setItem("token", response.data.token);

            // Parse token.
            const token = JSON.parse(atob(response.data.token.split(".")[1]));

            localStorage.setItem("userid", token.user_id);
            this.user_id = token.user_id;
            this.is_admin = token.admin;

            this.setToken(response.data.token);
            return response.data.token;
        }).catch(err => {
            if (err.response && err.response.data) {
                throw new Error({ message: err.response.data.message || "Nous n'avons pas pu vous identifier.", code : err.response.status });
            }
            throw err;
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