import axios from 'axios';
import { env } from '../config/env.js';

export const apiClient = axios.create({
    baseURL: env.API_URL,
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json'
    }
});