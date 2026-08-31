import { apiClient } from '../client.js';

export const getAll = async () => {
    return await apiClient.get('/products');
}

export const getById = async (id) => {
    return await apiClient.get(`/products/${id}`);
}

export const create = async (product) => {
    // product = {
    //      "name": "Produto",
    //      "quantity": 1,
    //      "price": 10.00
    // }

    return await apiClient.post('/products', product);
}

export const update = async (id, product) => {
    return await apiClient.put(`/products/${id}`, product);
}

export const deleteById = async (id) => {
    return await apiClient.delete(`/products/${id}`);
}

export const changeQuantity = async (id, data) => {
    // data = {
    //     "op": "add" | "remove",
    //     "quantity": 1
    // }

    return await apiClient.patch(`/products/${id}`, data);
}

export const lastId = async () => {
    return await apiClient.get('/products/lastId');
}