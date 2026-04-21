import { apiClient, extractItems } from "./api.js";

function normalizeReview(review) {
    return {
        id: String(review?.id || Date.now()),
        user: review?.user || review?.author || "Customer",
        rating: Math.max(1, Math.min(5, Number(review?.rating) || 5)),
        comment: String(review?.comment || "").trim(),
    };
}

export async function fetchProductReviews(productId) {
    const id = String(productId || "");
    if (!id) return [];

    const res = await apiClient.get(`/api/products/${id}/reviews`);
    return extractItems(res.data).map(normalizeReview);
}

export async function createProductReview(productId, payload) {
    const id = String(productId || "");
    if (!id) throw new Error("Product ID is required");

    const res = await apiClient.post(`/api/products/${id}/reviews`, {
        rating: payload.rating,
        comment: payload.comment,
    });
    const review = res.data?.review ?? res.data?.data?.review ?? res.data;
    return normalizeReview(review);
}
