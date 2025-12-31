import { PRODUCTS_API_ENDPOINT } from "./product.constants.js";
let products = [];

export const fetchProducts = async (fresh = false) => {
    // if products are already fetched, return them
    if (products.length > 0 && !fresh) return products;

    const res = await fetch(PRODUCTS_API_ENDPOINT);
    products = await res.json();
    return products;
};

export const fetchProduct = (id) => {
    return products.find((p) => p.id === id);
};

export const searchProducts = (value) => {
    const val = value.toLowerCase();
    return products.filter(
        (p) =>
            p.name.toLowerCase().includes(val) ||
            p.description.toLowerCase().includes(val)
    );
};

export const getCategories = () => {
    const categories = new Set();
    products.forEach((p) => {
        if (p.details?.category) {
            categories.add(p.details.category);
        }
    });
    return Array.from(categories);
};
