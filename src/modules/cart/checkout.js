import { $ } from "/src/utils/dom.js";
import { fetchProduct } from "../products/product.api.js";
import { formatPrice } from "/src/utils/formatters.js";
import { TAX } from "./cart.constants.js";
import { getPrice } from "../products/product.helpers.js";

export function initCheckoutPage() {
    const orderSummaryEl = document.querySelector(".order-summary");
    if (!orderSummaryEl) return;

    const cart = window.shoppingCart;
    const cartItems = cart ? Array.from(cart.items.values()) : [];

    if (!cartItems.length) {
        orderSummaryEl.innerHTML = '<p class="muted">Your cart is empty.</p>';
        return;
    }

    const subtotal = cartItems.reduce(async (sum, item) => {
        const p = await fetchProduct(item.productId);
        const unitPrice = p ? getPrice(p) : 0;
        return sum + unitPrice * item.quantity;
    }, 0);

    const tax = subtotal * (TAX / 100);
    const total = subtotal + tax;

    orderSummaryEl.innerHTML = `
        <h2 class="section-title">Order Summary</h2>
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
