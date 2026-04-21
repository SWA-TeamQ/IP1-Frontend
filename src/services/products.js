import { apiClient, extractItem, extractItems } from "./api.js";
import { PRODUCTS } from "../data/products.js";

const PRODUCTS_API_ENDPOINT = "/api/products";

let cache = [];

function normalizeProduct(p) {
    const id = p.id ?? "";
    const category = p.category ?? p.details?.category;
    const reviews = Array.isArray(p.reviews) ? p.reviews : [];
    return {
        ...p,
        id: String(id),
        images: p.images ?? (p.image ? [p.image] : []),
        reviews,
        details: {
            ...(p.details ?? {}),
            ...(category ? { category } : {}),
            reviewCount: p.details?.reviewCount ?? reviews.length,
        },
        name: p.name ?? "",
        description: p.description ?? "",
    };
}

export async function fetchProducts({ fresh = false, params = {} } = {}) {
    if (cache.length > 0 && !fresh) return cache;
    try {
        const res = await apiClient.get(PRODUCTS_API_ENDPOINT, { params });
        const items = extractItems(res.data);
        cache = items.map(normalizeProduct);
    } catch (err) {
        console.warn("fetchProducts failed, using local fallback:", err);
        cache = PRODUCTS.map(normalizeProduct);
    }
    return cache;
}

export async function getProductById(id) {
    try {
        const res = await apiClient.get(`${PRODUCTS_API_ENDPOINT}/${id}`);
        const product = extractItem(res.data);
        return product ? normalizeProduct(product) : null;
    } catch {
        const list = await fetchProducts();
        return list.find((p) => p.id === String(id));
    }
}

export function getCategories(products) {
    const set = new Set();
    (products || []).forEach((p) => {
        if (p.details?.category) set.add(p.details.category);
    });
    return Array.from(set);
}

export function filterProductsByCategory(products, category) {
    return (products || []).filter((p) => p.details?.category === category);
}

export function searchProducts(products, value) {
    const val = String(value || "").toLowerCase();
    return (products || []).filter(
        (p) =>
            p.name.toLowerCase().includes(val) ||
            p.description.toLowerCase().includes(val),
    );
}

export function sortProducts(products, by, order = "asc") {
    const sorted = [...(products || [])];
    sorted.sort((a, b) => {
        const valA = a.details?.[by] ?? a[by];
        const valB = b.details?.[by] ?? b[by];

        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
    });

    return sorted;
}
