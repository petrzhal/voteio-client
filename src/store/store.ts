import {makeObservable, observable} from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";
import VotingService from "../services/VotingService";
import {User} from "../models/User";

export default class Store {
    user: User = {} as User;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeObservable(this, {
            isAuth: observable,
        });
    }

    setAuth(auth: boolean) {
        this.isAuth = auth;
    }

    setUser(user: User) {
        this.user = user;
    }

    async login(login: string, password: string) {
        try {
            const response = await AuthService.login({login, password});
            console.log(response);
            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("refresh_token", response.data.refresh_token);
            const userResponse = await AuthService.getUser();
            this.setAuth(true);
            this.setUser(userResponse.data);
            return true;
        } catch (error: any) {
            console.log(error.response?.data?.message);
            return false;
        }
    }

    async register(login: string, password: string) {
        try {
            const response = await AuthService.register({login, password});
            console.log(response);
            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("refresh_token", response.data.refresh_token);
            const userResponse = await AuthService.getUser();
            this.setAuth(true);
            this.setUser(userResponse.data);
            return true;
        } catch (error: any) {
            console.log(error.response?.data?.message);
            return false;
        }
    }

    async checkAuth() {
        this.isLoading = true;
        try {
            const refreshApi = axios.create({
                withCredentials: true,
                baseURL: API_URL,
            })

            refreshApi.interceptors.request.use((config) => {
                config.headers.Authorization = localStorage.getItem('refresh_token');
                return config;
            })
            const response = await refreshApi.post<AuthResponse>(`${API_URL}/refresh`);
            console.log(response);
            localStorage.setItem("access_token", response.data.access_token);
            const userResponse = await AuthService.getUser();
            this.setAuth(true);
            this.setUser(userResponse.data);
        } catch (error: any) {
            if (error.response) {
                console.log(error.response?.data?.message);
            } else {
                console.log(error);
            }
        } finally {
            this.isLoading = false;
        }
    }

    async logout() {
        localStorage.clear();
        this.isAuth = false;
        this.isLoading = false;
    }
}