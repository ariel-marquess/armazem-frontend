import { apiClient } from '../client.js';

export const authenticate = async (login, password) => {
    return await apiClient.get(`/users?login=${login}&password=${password}`);
}

export const createAccount = async (user) => {
    // user = {
    //      name: "Nome",
    //      login: "login",
    //      password: "senha"
    // }

    return await apiClient.post('/users', user);
}