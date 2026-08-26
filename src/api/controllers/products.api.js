import { apiClient } from '../client.js';

export const getAll = async () => {
    try {
        return await apiClient.get('/products');
    } catch (error) {
        throw error;
    }
}

export const getById = async (id) => {
    try {
        return await apiClient.get(`/products/${id}`);
    } catch (error) {
        throw error;
    }
}

export const create = async (product) => {
    // product = {
    //      "name": "Produto",
    //      "quantity": 1,
    //      "price": 10.00
    // }

    try {
        return await apiClient.post('/products', product);
    } catch (error) {
        throw error;
    }
}

export const update = async (id, product) => {
    try {
        return await apiClient.put(`/products/${id}`, product);
    } catch (error) {
        throw error;
    }
}

export const deleteById = async (id) => {
    try {
        return await apiClient.delete(`/products/${id}`);
    } catch (error) {
        throw error;
    }
}

export const changeQuantity = async (id, data) => {
    // data = {
    //     "op": "add" | "remove",
    //     "quantity": 1
    // }

    try {
        return await apiClient.patch(`/products/${id}`, data);
    } catch (error) {
        throw error;
    }
}

export const lastId = async () => {
    try {
        return await apiClient.get('/products/lastId');
    } catch (error) {
        throw error;
    }
}