import { apiClient } from '../client.js';

export const authenticate = async (login, password) => {
    try {
        return await apiClient.get(`/users?login=${login}&password=${password}`);
    } catch (error) {
        throw error;
    }
}

export const createAccount = async (user) => {
    try {
        // user = {
        //      name: "Nome",
        //      login: "login",
        //      password: "senha"
        // }

        return await apiClient.post('/users', user);
    } catch (error) {
        throw error;
    }
}