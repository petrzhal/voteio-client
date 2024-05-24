import api, {API_URL} from "../http";
import axios, {AxiosResponse} from "axios";
import {AuthResponse} from "../models/response/AuthResponse";
import {AuthRequest} from "../models/request/AuthRequest";
import {User} from "../models/User";

export default class AuthService {
    static async login(authRequest: AuthRequest) : Promise<AxiosResponse<AuthResponse>> {
        return api.post<AuthResponse>('/login', authRequest);
    }

    static async register(authRequest: AuthRequest) : Promise<AxiosResponse<AuthResponse>> {
        return api.post<AuthResponse>('/register', authRequest);
    }

    static async getUser() {
        return api.get<User>('/user/get');
    }

    static async refresh() {
        const refreshApi = axios.create({
            withCredentials: true,
            baseURL: API_URL,
        })

        refreshApi.interceptors.request.use((config) => {
            config.headers.Authorization = localStorage.getItem('refresh_token');
            return config;
        })
        return refreshApi.post<AuthResponse>(`${API_URL}/refresh`);
    }
}