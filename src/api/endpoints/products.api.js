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

export const changeQuantity = async (id, quantity) => {
    const obj = {
        "quantity": quantity
    }

    try {
        return await apiClient.patch(`/products/${id}`, obj);
    } catch (error) {
        throw error;
    }
}