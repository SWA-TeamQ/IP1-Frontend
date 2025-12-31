import { getFavorites, saveFavorites } from "./favorites.store.js";
import { PRODUCTS } from "./products.data.js";

// Try same-origin first (works if you serve the frontend from the same server as the API),
// then localhost/127.0.0.1 (common dev setups).
const PRODUCTS_API_ENDPOINTS = [
    "/products",
    "http://localhost:3000/products",
    "http://127.0.0.1:3000/products",
];
let products = [];
let lastFetchSource = "unknown"; // endpoint string | "fallback" | "error" | "unknown"
let lastFetchError = null;
let lastFetchAttempts = []; // [{ endpoint, message }]

/* ------------------------------------
   Normalize product
------------------------------------ */
function normalizeProduct(p) {
    return {
        ...p,
        id: p.id ?? "",
        name: p.name ?? "",
        description: p.description ?? "",
        images: p.images ?? (p.image ? [p.image] : []),
        details: p.details ?? {},
    };
}

/* ------------------------------------
   Fetch all products
------------------------------------ */
export const fetchProducts = async (fresh = false) => {
    if (products.length > 0 && !fresh) return products;

    try {
        const res = await fetch(PRODUCTS_API_ENDPOINT);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate loading delay
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const fetchedProducts = await res.json();
        products = fetchedProducts.map(normalizeProduct);
    } catch (err) {
        // Fallback to local data if API isn't reachable (common during frontend-only dev).
        console.warn("fetchProducts failed, using local fallback:", err);
        products = (PRODUCTS || []).map(normalizeProduct);
        lastFetchSource = "fallback";
        lastFetchError = err;
    }

    return products;
};

// Debug helper: lets the UI (or you) confirm whether the API was used.
export const getProductsSource = () => lastFetchSource;
export const getProductsError = () => lastFetchError;
export const getProductsAttempts = () => lastFetchAttempts;

/* ------------------------------------
   Fetch single product
------------------------------------ */
export const fetchProduct = async (id) => {
    await fetchProducts();
    return products.find((p) => p.id === id);
};

/* ------------------------------------
   Create product
------------------------------------ */
export const createProduct = async (data) => {
    const newProduct = normalizeProduct(data);

    try {
        const res = await fetch(PRODUCTS_API_ENDPOINTS[1], {
            method: "POST",
            body: JSON.stringify(newProduct),
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to create product");

        products.unshift(newProduct);
        return newProduct;
    } catch (err) {
        console.log(err);
    }
};

/* ------------------------------------
   Delete product
------------------------------------ */
export const deleteProduct = async (id) => {
    try {
        const res = await fetch(`${PRODUCTS_API_ENDPOINTS[1]}/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Couldn't delete product");

        products = products.filter((p) => p.id !== id);
    } catch (err) {
        console.log(err);
    }
};

/* ------------------------------------
   Update product
------------------------------------ */
export const updateProduct = async (id, data) => {
    try {
        const res = await fetch(`${PRODUCTS_API_ENDPOINTS[1]}/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Couldn't update product");

        const index = products.findIndex((p) => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...data };
        }
    } catch (err) {
        console.log(err);
    }
};

/* ------------------------------------
   Search
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
        if (p.details?.category) {
            categories.add(p.details.category);
        }
    });
    return Array.from(categories);
};

export const filterProducts = (category) => {
    return products.filter((p) => p.details?.category === category);
};

/* ------------------------------------
   Sorting
------------------------------------ */
export const sortProducts = (by, order = "asc") => {
    const sorted = [...products];

    sorted.sort((a, b) => {
        const valA = a.details?.[by] ?? a[by];
        const valB = b.details?.[by] ?? b[by];

        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
    });

    return sorted;
};

/* ------------------------------------
   Favorites (NEW – added safely)
------------------------------------ */
export const toggleFavorite = (id) => {
    let favs = getFavorites();

    if (favs.includes(id)) {
        favs = favs.filter((f) => f !== id);
    } else {
        favs.push(id);
    }

    saveFavorites(favs);
};

export const getFavoriteProducts = () => {
    const favs = getFavorites();
    return products.filter((p) => favs.includes(p.id));
};
