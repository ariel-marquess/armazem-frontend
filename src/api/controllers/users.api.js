import { apiClient } from '../client.js';

export const authenticate = async (login, password) => {
    return await apiClient.post("/auth/login", {
        login: login,
        password: password
    });
}

export const createAccount = async (user) => {
    // user = {
    //      name: "nome",
    //      login: "login",
    //      password: "senha"
    // }

    await apiClient.post('/users', user);
}