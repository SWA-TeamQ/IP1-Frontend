import { getProduct } from '../data/products.js';
import { formatPrice, escapeHtml } from '../lib/utils.js';
import { TAX } from '../../constants/global-variables.js';
import { onConfirmPayment } from '../../components/Cart/CartSystem.js';

const orderSummaryEl = document.querySelector('.order-summary');

function renderCheckoutSummary() {
    const cartItems = Array.from(window.shoppingCart.items.values());

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

    const summaryHtml = `
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

    orderSummaryEl.innerHTML = summaryHtml;

    const placeOrderBtn = orderSummaryEl.querySelector('.btn-checkout');
    placeOrderBtn.addEventListener('click', onConfirmPayment);
}

renderCheckoutSummary();
