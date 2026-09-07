import axios from 'axios';
import { env } from '../config/env.js';

export const apiClient = axios.create({
    baseURL: env.API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});