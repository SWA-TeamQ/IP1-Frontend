import { getProduct } from "../products/products.data.js";
import { formatPrice } from "../../core/utils/formatters.js";
import { TAX } from "../../constants/global-variables.js";

export function initCheckoutPage() {
    const orderSummaryEl = document.querySelector(".order-summary");
    if (!orderSummaryEl) return;

    const cart = window.shoppingCart;
    const cartItems = cart ? Array.from(cart.items.values()) : [];

    if (!cartItems.length) {
        orderSummaryEl.innerHTML = '<p class="muted">Your cart is empty.</p>';
        return;
    }

    const subtotal = cartItems.reduce((s, i) => {
        const p = getProduct(i.productId);
        const unit = p ? p.details.salePrice || p.getPrice() : 0;
        return s + unit * i.quantity;
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
        const countEl = document.getElementById("navCartCount");
        if (countEl && cart) countEl.textContent = String(cart.getTotalQuantity());
    });
}
