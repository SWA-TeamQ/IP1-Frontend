import { apiClient, extractItems, isEndpointUnsupported } from "./api.js";
import { storageGetJson, storageSetJson } from "../utils/storage.js";

const FAVORITES_BASE = "/api/favorites";
const STORAGE_KEY = "mock_api_favorites_v1";

function delay(ms = 220) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function normalizeFavoriteIds(items) {
    return Array.from(
        new Set(
            (items || []).map((id) => String(id || "").trim()).filter(Boolean),
        ),
    );
}

function getMockFavorites() {
    return normalizeFavoriteIds(storageGetJson(STORAGE_KEY, []));
}

function saveMockFavorites(items) {
    storageSetJson(STORAGE_KEY, normalizeFavoriteIds(items));
}

export async function fetchFavorites() {
    try {
        const res = await apiClient.get(FAVORITES_BASE);
        return normalizeFavoriteIds(extractItems(res.data));
    } catch (error) {
        if (!error?.response || isEndpointUnsupported(error)) {
            await delay();
            return getMockFavorites();
        }
        throw error;
    }
}

export async function toggleFavorite(productId) {
    const id = String(productId || "").trim();
    if (!id) return getMockFavorites();

    try {
        const res = await apiClient.post(`${FAVORITES_BASE}/toggle`, {
            productId: id,
        });
        return normalizeFavoriteIds(extractItems(res.data));
    } catch (error) {
        if (!error?.response || isEndpointUnsupported(error)) {
            await delay();
            const items = getMockFavorites();
            const exists = items.includes(id);
            const next = exists
                ? items.filter((item) => item !== id)
                : [...items, id];
            saveMockFavorites(next);
            return next;
        }
        throw error;
    }
}
