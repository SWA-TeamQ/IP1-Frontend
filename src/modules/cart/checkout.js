import { $ } from "/src/utils/dom.js";
import { fetchProduct } from "../products/product.api.js";
import { escapeHtml, formatPrice } from "/src/utils/formatters.js";
import { TAX } from "./cart.constants.js";
import { getPrice } from "../products/product.helpers.js";

export async function initCheckoutPage() {
    const orderSummaryEl = document.querySelector(".order-summary");
    if (!orderSummaryEl) return;

    const cart = window.shoppingCart;
    const cartItems = cart ? Array.from(cart.items.values()) : [];

    if (!cartItems.length) {
        orderSummaryEl.innerHTML = '<p class="muted">Your cart is empty.</p>';
        return;
    }

    const entries = (
        await Promise.all(
            cartItems.map(async (item) => {
                const p = await fetchProduct(item.productId);
                if (!p) return null;
                const unitPrice = getPrice(p);
                return {
                    item,
                    product: p,
                    unitPrice,
                    lineTotal: unitPrice * item.quantity,
                };
            })
        )
    ).filter(Boolean);

    const subtotal = entries.reduce((sum, e) => sum + e.lineTotal, 0);

    const tax = subtotal * (TAX / 100);
    const total = subtotal + tax;

    const itemsHtml = entries
        .map(
            ({ item, product, unitPrice, lineTotal }) => `
        <div class="summary-row">
            <span>${escapeHtml(product?.name || "Item")} × ${item.quantity}</span>
            <span>$${formatPrice(lineTotal)}</span>
        </div>
        <div class="summary-row" style="margin-top:-0.5rem;font-size:0.9rem">
            <span class="muted">Unit</span>
            <span class="muted">$${formatPrice(unitPrice)}</span>
        </div>
    `
        )
        .join("");

    orderSummaryEl.innerHTML = `
        <h2 class="section-title">Order Summary</h2>
        ${itemsHtml}
        <div class="summary-row">
            <span>Subtotal</span>
            <span>$${formatPrice(subtotal)}</span>
        </div>
        <div class="summary-row">
            <span>Shipping</span>
            <span>Free</span>
        </div>
        <div class="summary-row">
            <span>Tax (${TAX}%)</span>
            <span>$${formatPrice(tax)}</span>
        </div>
        <div class="summary-total">
            <span>Total</span>
            <span>$${formatPrice(total)}</span>
        </div>
        <button class="btn-checkout">Place Order</button>
    `;

    const placeOrderBtn = orderSummaryEl.querySelector(".btn-checkout");
    placeOrderBtn?.addEventListener("click", () => {
        alert("Payment simulated — thank you for your purchase!");
        cart?.clear?.();
        const navCartCount = document.getElementById("navCartCount");
        if (navCartCount && cart)
            navCartCount.textContent = String(cart.getTotalQuantity());
    });
}
