import { apiClient, extractItems, isEndpointUnsupported } from "./api.js";
import { storageGetJson, storageSetJson } from "../utils/storage.js";

const STORAGE_KEY = "mock_api_reviews_v1";

function delay(ms = 220) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function normalizeReview(review) {
    return {
        id: String(review?.id || Date.now()),
        user: review?.user || review?.author || "Customer",
        rating: Math.max(1, Math.min(5, Number(review?.rating) || 5)),
        comment: String(review?.comment || "").trim(),
    };
}

function getStore() {
    return storageGetJson(STORAGE_KEY, {});
}

function saveStore(store) {
    storageSetJson(STORAGE_KEY, store);
}

export async function fetchProductReviews(productId) {
    const id = String(productId || "");
    if (!id) return [];

    try {
        const res = await apiClient.get(`/api/products/${id}/reviews`);
        return extractItems(res.data).map(normalizeReview);
    } catch (error) {
        if (!error?.response || isEndpointUnsupported(error)) {
            await delay();
            const store = getStore();
            return (store[id] || []).map(normalizeReview);
        }
        throw error;
    }
}

export async function createProductReview(productId, payload) {
    const id = String(productId || "");
    const nextReview = normalizeReview(payload);
    if (!id) return nextReview;

    try {
        const res = await apiClient.post(`/api/products/${id}/reviews`, {
            rating: nextReview.rating,
            comment: nextReview.comment,
        });
        const review = res.data?.review ?? res.data?.data?.review ?? nextReview;
        return normalizeReview(review);
    } catch (error) {
        if (!error?.response || isEndpointUnsupported(error)) {
            await delay();
            const store = getStore();
            const current = Array.isArray(store[id]) ? store[id] : [];
            const combined = [nextReview, ...current].slice(0, 30);
            saveStore({ ...store, [id]: combined });
            return nextReview;
        }
        throw error;
    }
}
