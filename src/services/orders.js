import { apiClient, extractItem, extractItems } from "./api.js";

const ORDERS_BASE = "/api/orders";

export async function fetchOrders() {
    const res = await apiClient.get(ORDERS_BASE);
    return extractItems(res.data);
}

export async function createOrder({ shipping, payment, tax, items }) {
    const payload = {};

    if (typeof shipping === "number") {
        payload.shipping = shipping;
    }

    if (payment) {
        payload.payment = payment;
    }

    if (typeof tax === "number") {
        payload.tax = tax;
    }

    if (items?.length) {
        payload.items = items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
        }));
    }

    const res = await apiClient.post(ORDERS_BASE, payload);
    const order = extractItem(res.data);
    return order ?? res.data;
}
