import { apiClient, extractItems } from "./api.js";

const FAVORITES_BASE = "/api/favorites";

function normalizeFavoriteIds(items) {
    return Array.from(
        new Set(
            (items || []).map((id) => String(id || "").trim()).filter(Boolean),
        ),
    );
}

export async function fetchFavorites() {
    const res = await apiClient.get(FAVORITES_BASE);
    return normalizeFavoriteIds(extractItems(res.data));
}

export async function toggleFavorite(productId) {
    const id = String(productId || "").trim();
    if (!id) return [];

    const res = await apiClient.post(`${FAVORITES_BASE}/toggle`, {
        productId: id,
    });
    return normalizeFavoriteIds(extractItems(res.data));
}
