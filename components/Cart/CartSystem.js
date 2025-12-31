import { PRODUCTS as products, getProduct, getProducts } from "../../modules/products/products.data.js";
import { escapeHtml, formatPrice } from "../../js/lib/utils.js";
import CartList from "./cart-list.js";
import Toast from "../toast.js";
import { onPrintReceipt } from "../../js/lib/printReciept.js";



const cartBtn = document.getElementById("cartBtn");
const cartList = document.getElementById("cartList");
const checkoutBtn = document.getElementById("checkoutBtn");
const cartClearBtn = document.getElementById("cartClearBtn");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const checkoutModal = document.getElementById("checkoutModal");
const orderSummary = document.getElementById("orderSummary");
const closeModal = document.getElementById("closeModal");
const confirmPayment = document.getElementById("confirmPayment");

const printReceipt = document.getElementById("printReceipt");

const productsReady = getProducts();

// Cart functions
export async function addToCart(productId) {
    await productsReady;
    const product = getProduct(productId);
    if (!product) return;
    shoppingCart.add(product);
    await renderCart();
    // visual affordance
    Toast(
        `Added ${getProduct(productId)?.name || "Product"} to cart!`,
        "success"
    );
}

export async function renderCart() {
    await productsReady;
    if (!cartList) {
        updateCartCount();
        if (cartTotalEl) {
            cartTotalEl.textContent = `$${formatPrice(window.shoppingCart.getTotal())}`;
        }
        return;
    }
    cartList.innerHTML = "";

    if (!window.shoppingCart.items.size) {
        cartList.innerHTML = '<p class="muted">Your cart is empty.</p>';
        if (cartTotalEl) cartTotalEl.textContent = "$0.00";
        return;
    }
    const arrayOfItems = Array.from(window.shoppingCart.items.values());

    const cartListObj = CartList(
        arrayOfItems,
        changeCartQuantity,
        removeFromCart
    );
    cartList.appendChild(cartListObj.element);
    if (cartTotalEl) {
        cartTotalEl.textContent = `$${formatPrice(window.shoppingCart.getTotal())}`;
    }
    updateCartCount();
}

export function changeCartQuantity(productId, quantity) {
    shoppingCart.updateQuantity(productId, quantity);
    renderCart();
}

export function removeFromCart(productId) {
    const product = getProduct(productId);
    shoppingCart.remove(product);
    renderCart();
}

export function updateCartCount() {
    const count = window.shoppingCart.getTotalQuantity();
    if (cartCountEl) cartCountEl.textContent = String(count);

    // one-shot pop animation to indicate update (CSS .cart-count.pop)
    try {
        if (cartCountEl) {
            cartCountEl.classList.remove("pop");
            // force reflow
            // eslint-disable-next-line no-unused-expressions
            void cartCountEl.offsetWidth;
            cartCountEl.classList.add("pop");
        }
    } catch (e) {
        // element may not exist or animation not supported — ignore
    }
    if (cartBtn && cartBtn.animate) {
        cartBtn.animate(
            [
                { transform: "scale(1)" },
                { transform: "scale(1.06)" },
                { transform: "scale(1)" },
            ],
            { duration: 220 }
        );
    }
}

export function clearCart() {
    window.shoppingCart.clear();
    renderCart();
}

// Checkout
export function openCheckout() {
    if (!shoppingCart.items.size) {
        alert("Your cart is empty.");
        return;
    }
    renderOrderSummary();
    if (checkoutModal) {
        checkoutModal.setAttribute("aria-hidden", "false");
    }
}

export function closeCheckout() {
    if (!checkoutModal) return;
    checkoutModal.setAttribute("aria-hidden", "true");
    checkoutModal.classList.remove("active");
}

export function renderOrderSummary() {
        if (!orderSummary) return;
        const cartItems = Array.from(window.shoppingCart.items.values());

        const lines = cartItems.map((item) => {
                const product = getProduct(item.productId);
                if (!product) return "";
                const unit = product.details?.salePrice ?? product.getPrice?.() ?? product.price ?? 0;
                const lineTotal = unit * item.quantity;
                return `
            <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem">
                <div>${escapeHtml(product.name)} x ${item.quantity}</div>
                <div><strong>$${formatPrice(lineTotal)}</strong></div>
            </div>
        `;
        });

        const subtotal = cartItems.reduce((sum, item) => {
                const product = getProduct(item.productId);
                const unit = product ? product.details?.salePrice ?? product.getPrice?.() ?? product.price ?? 0 : 0;
                return sum + unit * item.quantity;
        }, 0);

        const shipping = subtotal > 0 ? 5.99 : 0;
        const total = subtotal + shipping;

        orderSummary.innerHTML = `
        ${lines.join("")}
        <hr>
        <div style="display:flex;justify-content:space-between"><div>Subtotal</div><div>$${formatPrice(
                subtotal
        )}</div></div>
        <div style="display:flex;justify-content:space-between"><div>Shipping</div><div>$${formatPrice(
                shipping
        )}</div></div>
        <div style="display:flex;justify-content:space-between;font-weight:700;margin-top:0.5rem"><div>Total</div><div>$${formatPrice(
                total
        )}</div></div>
    `;
}



export function onConfirmPayment() {
    // simple simulated payment flow
    alert("Payment simulated — thank you for your purchase!");
    // Save receipt content temporarily for print
    renderOrderSummary();
    // clear cart
    window.shoppingCart.clear();
    renderCart();
    closeCheckout();
}

export function events() {
    if (checkoutBtn) checkoutBtn.addEventListener("click", openCheckout);
    if (cartClearBtn) cartClearBtn.addEventListener("click", clearCart);
    if (closeModal) closeModal.addEventListener("click", closeCheckout);
    if (confirmPayment) confirmPayment.addEventListener("click", onConfirmPayment);
    if (printReceipt) printReceipt.addEventListener("click", () => {
        const cartItems = Array.from(window.shoppingCart.items.values());
        onPrintReceipt(cartItems, products);
    });
}

events();
