import { apiClient, extractPayload } from "./api.js";

const CART_BASE = "/api/cart";

export function normalizeCart(cart) {
    const sourceItems = Array.isArray(cart?.items)
        ? cart.items
        : Object.values(cart?.items || {});
    const items = sourceItems.reduce((acc, item) => {
        const productId = String(item.productId ?? "");
        if (!productId) return acc;
        acc[productId] = {
            productId,
            quantity: Math.max(1, Number(item.quantity) || 1),
        };
        return acc;
    }, {});

    return {
        id: cart?.id ?? null,
        userId: cart?.userId ?? null,
        items,
    };
}

export async function fetchCart() {
    const res = await apiClient.get(CART_BASE);
    return normalizeCart(extractPayload(res.data));
}

export async function upsertCartItem({ productId, quantity }) {
    const res = await apiClient.post(`${CART_BASE}/items`, {
        productId,
        quantity,
    });
    return normalizeCart(extractPayload(res.data));
}

export async function updateCartItemQuantity({ productId, quantity }) {
    try {
        const res = await apiClient.patch(`${CART_BASE}/items/${productId}`, {
            quantity,
        });
        return normalizeCart(extractPayload(res.data));
    } catch {
        return upsertCartItem({ productId, quantity });
    }
}

export async function removeCartItem(productId) {
    const res = await apiClient.delete(`${CART_BASE}/items/${productId}`);
    return normalizeCart(extractPayload(res.data));
}

export async function clearCart() {
    try {
        await apiClient.delete(CART_BASE);
        return normalizeCart({ items: [] });
    } catch {
        return normalizeCart({ items: [] });
    }
}
