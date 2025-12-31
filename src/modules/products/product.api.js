import { PRODUCTS_API_ENDPOINT } from "./product.constants.js";
import { PRODUCTS } from "./products.data.js";

let products = [];

function normalizeProduct(p) {
    return {
        ...p,
        images: p.images ?? (p.image ? [p.image] : []),
        details: p.details ?? {},
        name: p.name ?? "",
        description: p.description ?? "",
        id: p.id ?? "",
    };
}

export const fetchProducts = async (fresh = false) => {
    if (products.length > 0 && !fresh) return products;

    try {
        const res = await fetch(PRODUCTS_API_ENDPOINT);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const fetchedProducts = await res.json();
        products = fetchedProducts.map(normalizeProduct);
    } catch (err) {
        console.warn("fetchProducts failed, using local fallback:", err);
        products = PRODUCTS.map(normalizeProduct);
    }

    return products;
};

export const fetchProduct = async (id) => {
    await fetchProducts();
    return products.find((p) => p.id === id);
};

export const createProduct = async (data) => {
    const newProduct = normalizeProduct(data);

    try {
        const res = await fetch(PRODUCTS_API_ENDPOINT, {
            method: "POST",
            body: newProduct,
        });
        if (!res.ok) {
            throw new Error("Failed to create a product");
        }
        products.unshift(newProduct);
        return newProduct;
    } catch (err) {
        console.log(err);
    }
};

export const deleteProduct = (id) => {
    try {
        const res = fetch(PRODUCTS_API_ENDPOINT + "/" + id, {
            method: "DELETE",
        });
        if (!res.ok) {
            throw new Error("Couldn't delete the product");
        }
        products = products.filter((p) => p.id !== id);
    } catch (err) {
        console.log(err);
    }
};

export const updateProduct = (id, data) => {
    try {
        const res = fetch(PRODUCTS_API_ENDPOINT + "/" + id, {
            method: "PUT",
            body: data,
        });
        if (!res.ok) {
            throw new Error("Couldn't update the product");
        }
        const index = products.findIndex((p) => p.id === id);
        if (index !== -1) {
            const oldProduct = products[index];
            products[index] = { ...oldProduct, ...data };
        }
    } catch (err) {
        console.log(err);
    }
};

export const searchProducts = (value) => {
    const val = String(value || "").toLowerCase();
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

export const filterProducts = (category) => {
    return products.filter((p) => p.details.category == category);
};

export const sortProducts = (by, order = "asc") => {
    const sorted = [...products];
    sorted.sort((a, b) => {
        const valA = a.details?.[by] || a[by];
        const valB = b.details?.[by] || b[by];

        if (valA < valB) {
            return order === "asc" ? -1 : 1;
        }
        if (valA > valB) {
            return order === "asc" ? 1 : -1;
        }
        return 0;
    });
    return sorted;
};
