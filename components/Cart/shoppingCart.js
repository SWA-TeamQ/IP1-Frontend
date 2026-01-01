import { PRODUCTS, getProduct, getProducts } from "../../modules/products/products.data.js";
import { fetchProductById } from "../../modules/products/products.api.js";
import { mapApiProduct } from "../../modules/products/products.mapper.js";
import { escapeHtml, formatPrice } from "../../utils/formatters.js";
import {
  changeCartQuantity,
  removeFromCart,
  clearCart,
  updateCartCount,
} from "./CartSystem.js";
import { initCart } from "../../modules/cart/cart.store.js";

/* ===========================
   CONSTANTS
=========================== */
const SHIPPING_COST = 5.99;
const STORE_NAME = "ShopLight";

/* ===========================
   CART HELPERS
=========================== */
function getcart() {
  const items = Array.from(window.shoppingCart.items.values()).map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));

  return {
    items,
    size: items.length,
    totalQuantity: window.shoppingCart.getTotalQuantity(),
    total: window.shoppingCart.getTotal(),
  };
}

/* ===========================
   DOM ELEMENTS
=========================== */
const cartItemsList = document.getElementById("cartItemsList");
const cartEmpty = document.getElementById("cartEmpty");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const totalEl = document.getElementById("total");
const itemCountEl = document.getElementById("itemCount");
const cartCountEl = document.getElementById("cartCount");
const orderSummary = document.getElementById("orderSummary");

const checkoutBtn = document.querySelector(".btn-checkout");
const confirmPaymentBtn = document.getElementById("confirmPayment");
const printReceiptBtn = document.getElementById("printReceipt");
const closeCheckoutBtn = document.getElementById("closeCheckout");

/* ===========================
   STATE
=========================== */
let lastOrderItems = [];

/* ===========================
   ENSURE API PRODUCTS EXIST
=========================== */
async function ensureProductsForCart(cartItems) {
  const missingIds = cartItems
    .map((i) => String(i.productId))
    .filter((id) => !getProduct(id));

  if (!missingIds.length) return;

  const fetched = await Promise.allSettled(
    missingIds.map(async (id) => {
      const apiProduct = await fetchProductById(id);
      return mapApiProduct(apiProduct);
    })
  );

  fetched.forEach((res) => {
    if (res.status === "fulfilled" && res.value && !getProduct(res.value.id)) {
      PRODUCTS.push(res.value);
    }
  });
}

/* ===========================
   RENDER CART ITEMS
=========================== */
async function renderCartItems() {
  const cart = getcart();
  cartItemsList.innerHTML = "";

  if (!cart.size) {
    cartEmpty.style.display = "flex";
    cartItemsList.style.display = "none";
    updateSummary(0, 0);
    return;
  }

  cartEmpty.style.display = "none";
  cartItemsList.style.display = "block";

  await ensureProductsForCart(cart.items);

  let subtotal = 0;
  let totalItems = 0;

  cart.items.forEach((item) => {
    const product =
      getProduct(item.productId) || {
        id: item.productId,
        name: "Product",
        image: "https://via.placeholder.com/120",
        getPrice: () => 0,
        details: {},
      };

    const unit = product.details?.salePrice ?? product.getPrice?.() ?? product.price ?? 0;
    const line = unit * item.quantity;

    subtotal += line;
    totalItems += item.quantity;

    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <div class="cart-item-thumb">
        <img src="${product.image}" alt="${escapeHtml(product.name)}" />
      </div>
      <div class="cart-item-body">
        <div class="cart-item-top">
          <h4>${escapeHtml(product.name)}</h4>
          <button class="remove-btn" data-remove="${product.id}">Remove</button>
        </div>
        <div class="cart-item-meta">
          <span>$${formatPrice(unit)}</span>
          <div class="qty-controls">
            <button class="qty-btn" data-action="decrease" data-id="${product.id}">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" data-action="increase" data-id="${product.id}">+</button>
          </div>
        </div>
      </div>
      <strong class="cart-line-total">$${formatPrice(line)}</strong>
    `;

    const decBtn = el.querySelector('[data-action="decrease"]');
    const incBtn = el.querySelector('[data-action="increase"]');
    const removeBtn = el.querySelector('[data-remove]');

    decBtn?.addEventListener("click", () => {
      if (item.quantity <= 1) return;
      changeCartQuantity(item.productId, item.quantity - 1);
      refreshCartFromStorage();
    });

    incBtn?.addEventListener("click", () => {
      changeCartQuantity(item.productId, item.quantity + 1);
      refreshCartFromStorage();
    });

    removeBtn?.addEventListener("click", () => {
      removeFromCart(item.productId);
      refreshCartFromStorage();
    });

    cartItemsList.appendChild(el);
  });

  updateSummary(subtotal, totalItems);
  renderOrderSummary(cart);
}

/* ===========================
   SUMMARY UI
=========================== */
function updateSummary(subtotal, totalItems, cart = getcart()) {
  const effectiveSubtotal = subtotal ?? cart.total ?? 0;
  const shipping = effectiveSubtotal ? SHIPPING_COST : 0;
  const total = effectiveSubtotal + shipping;

  subtotalEl.textContent = `$${formatPrice(effectiveSubtotal)}`;
  shippingEl.textContent = shipping ? `$${formatPrice(shipping)}` : "Free";
  totalEl.textContent = `$${formatPrice(total)}`;
  itemCountEl.textContent = totalItems ?? cart.totalQuantity ?? 0;
  if (cartCountEl) cartCountEl.textContent = cart.totalQuantity ?? totalItems ?? 0;
}

/* ===========================
   ORDER SUMMARY MODAL
=========================== */
function renderOrderSummary(cart = getcart()) {
  if (!orderSummary) return;

  const lines = cart.items.map((item) => {
    const p = getProduct(item.productId);
    const unit = p?.details?.salePrice ?? p?.getPrice?.() ?? p?.price ?? 0;
    return `
      <div class="summary-row">
        <span>${escapeHtml(p?.name || "Product")} × ${item.quantity}</span>
        <strong>$${formatPrice(unit * item.quantity)}</strong>
      </div>
    `;
  });

  const subtotal = cart.total ?? 0;
  const shipping = subtotal ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  orderSummary.innerHTML = `
    ${lines.join("")}
    <hr />
    <div class="summary-row"><span>Subtotal</span><span>$${formatPrice(subtotal)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>$${formatPrice(shipping)}</span></div>
    <div class="summary-row total"><span>Total</span><span>$${formatPrice(total)}</span></div>
  `;
}

/* ===========================
   RECEIPT PRINTING
=========================== */
export function onPrintReceipt(cartItems) {
  const win = window.open("", "_blank");
  if (!win) return alert("Allow popups to print receipt.");

  const date = new Date().toLocaleString();

  const rows = cartItems
    .map((item) => {
      const p = getProduct(item.productId);
      const unit = p?.details?.salePrice ?? p?.getPrice?.() ?? p?.price ?? 0;
      return `
        <tr>
          <td>${escapeHtml(p?.name || "Product")}</td>
          <td>${item.quantity}</td>
          <td>$${formatPrice(unit)}</td>
          <td>$${formatPrice(unit * item.quantity)}</td>
        </tr>
      `;
    })
    .join("");

  const subtotal = cartItems.reduce((sum, i) => {
    const p = getProduct(i.productId);
    const unit = p?.details?.salePrice ?? p?.getPrice?.() ?? p?.price ?? 0;
    return sum + unit * i.quantity;
  }, 0);

  const shipping = subtotal ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  win.document.write(`
    <html>
    <head>
      <title>Receipt</title>
      <style>
        body{font-family:Arial;padding:20px}
        table{width:100%;border-collapse:collapse}
        td,th{border-bottom:1px solid #eee;padding:6px}
        th{text-align:left}
      </style>
    </head>
    <body>
      <h1>${STORE_NAME}</h1>
      <p>${date}</p>
      <table>
        <thead>
          <tr><th>Item</th><th>Qty</th><th>Unit</th><th>Total</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p><strong>Subtotal:</strong> $${formatPrice(subtotal)}</p>
      <p><strong>Shipping:</strong> $${formatPrice(shipping)}</p>
      <h3>Total: $${formatPrice(total)}</h3>
      <script>window.print()</script>
    </body>
    </html>
  `);

  win.document.close();
}

/* ===========================
   CHECKOUT FLOW
=========================== */
if (checkoutBtn)
  checkoutBtn.onclick = () => {
    if (!getcart().size) return alert("Cart is empty");
    window.location.href = "/pages/checkout/checkout.html";
  };

if (confirmPaymentBtn)
  confirmPaymentBtn.onclick = () => {
    lastOrderItems = getcart().items.map((i) => ({ ...i }));
  };

if (printReceiptBtn)
  printReceiptBtn.onclick = () => {
    if (!lastOrderItems.length) return alert("No order to print");
    onPrintReceipt(lastOrderItems);
    clearCart();
    refreshCartFromStorage();
  };

if (closeCheckoutBtn)
  closeCheckoutBtn.onclick = () => window.history.back();

/* ===========================
   REFRESH + INIT
=========================== */
async function refreshCartFromStorage() {
  window.shoppingCart?.load?.();
  await renderCartItems();
  updateCartCount();
}

async function init() {
  await initCart();
  await getProducts();
  await refreshCartFromStorage();
}

// Keep page in sync when cart changes elsewhere
window.addEventListener("storage", (event) => {
  const key = window.shoppingCart?.STORAGE_CART;
  if (!key) return;
  if (event.key === null || event.key === key) {
    refreshCartFromStorage();
  }
});

window.addEventListener("cart:updated", () => {
  refreshCartFromStorage();
});

init();
