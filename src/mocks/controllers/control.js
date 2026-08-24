import { users, products } from "../data/mockData.js";

export function authUser(login, password){
    const user = users.find((user) => {
        return user.login === login && user.password === password;
    });

    if (!user) {
        return null;
    }

    return {
        data: {
            token: "token",
        }
    };
}

export function getProducts(){
    return {
        data: products
    };
}

export function getProduct(id){
    return products.find((product) => product.id === id);
}

export function getLastId(){
    return {
        data: {
            id: products.length + 1
        }
    };
}