import { getFavorites, saveFavorites } from "./favorites.store.js";
import { PRODUCTS } from "./products.data.js";

// Single array to hold all products
let products = [];

// Source info (for debug)
let lastFetchSource = "unknown";
let lastFetchError = null;

// Normalize product structure
function normalizeProduct(p) {
    return {
        ...p,
        id: p.id ?? "",
        name: p.name ?? "",
        description: p.description ?? "",
        images: p.images ?? (p.image ? [p.image] : []),
        details: p.details ?? {},
        isFavorite: false,
    };
}

/* ------------------------------------
   Fetch all products
------------------------------------ */
export const fetchProducts = async (fresh = false) => {
    if (products.length > 0 && !fresh) return products;

    try {
        // Attempt API endpoints if you have one (otherwise skip)
        // If no API, fallback immediately
        products = (PRODUCTS || []).map(normalizeProduct);
        lastFetchSource = "fallback";
        lastFetchError = null;
    } catch (err) {
        console.warn("fetchProducts failed:", err);
        products = (PRODUCTS || []).map(normalizeProduct);
        lastFetchSource = "fallback";
        lastFetchError = err;
    }

    return products;
};

/* ------------------------------------
   Fetch single product
------------------------------------ */
export const fetchProduct = async (id) => {
    await fetchProducts();
    return products.find((p) => p.id === id);
};

/* ------------------------------------
   Search products
------------------------------------ */
export const searchProducts = (value) => {
    const val = String(value || "").toLowerCase();
    return products.filter(
        (p) =>
            p.name.toLowerCase().includes(val) ||
            p.description.toLowerCase().includes(val)
    );
};

/* ------------------------------------
   Categories
------------------------------------ */
export const getCategories = () => {
    const categories = new Set();
    products.forEach((p) => {
        if (p.details?.category) categories.add(p.details.category);
    });
    return Array.from(categories);
};

export const filterProducts = (category) => {
    return products.filter((p) => p.details?.category === category);
};

/* ------------------------------------
   Favorites
------------------------------------ */
export const toggleFavorite = (id) => {
    let favs = getFavorites();
    if (favs.includes(id)) favs = favs.filter((f) => f !== id);
    else favs.push(id);

    saveFavorites(favs);

    const p = products.find((prod) => prod.id === id);
    if (p) p.isFavorite = favs.includes(id);
};

export const getFavoriteProducts = () => {
    const favs = getFavorites();
    return products.filter((p) => favs.includes(p.id));
};
