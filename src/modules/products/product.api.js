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

export const fetchProduct = (id) => {
    return products.find((p) => p.id === id);
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