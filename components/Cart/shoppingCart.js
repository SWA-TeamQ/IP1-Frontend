import { PRODUCTS, getProduct, getProducts } from "../../modules/products/products.data.js";
import { fetchProductById } from "../../modules/products/products.api.js";
import { mapApiProduct } from "../../modules/products/products.mapper.js";
import { escapeHtml, formatPrice } from "../../js/lib/utils.js";
import {
  changeCartQuantity,
  removeFromCart,
  clearCart,
  updateCartCount,
} from "./CartSystem.js";
import { initCart } from "../../modules/cart/cart.store.js";

const SHIPPING_COST = 5.99;
const productsReady = getProducts();

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

// ============================================
// DOM ELEMENTS
// ============================================
const cartItemsList = document.getElementById("cartItemsList");
const cartEmpty = document.getElementById("cartEmpty");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const totalEl = document.getElementById("total");
const itemCountEl = document.getElementById("itemCount");
const cartCountEl = document.getElementById("cartCount");

const checkoutBtn = document.querySelector(".btn-checkout");
const checkoutModal = document.getElementById("checkoutModal");
const closeModalBtn = document.getElementById("closeModal");
const confirmPaymentBtn = document.getElementById("confirmPayment");
const cancelCheckoutBtn = document.getElementById("cancelCheckout");
const printReceiptBtn = document.getElementById("printReceipt");
const closeCheckoutBtn = document.getElementById("closeCheckout");
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const removeAllBtn = document.getElementById("removeAllBtn");
const selectAllCheckbox = document.getElementById("selectAllCheckbox");
const removeSelectedBtn = document.getElementById("removeSelectedBtn");
const orderSummary = document.getElementById("orderSummary");

// Track selected items
let selectedItems = new Set();

// ============================================
// SELECTION FUNCTIONS
// ============================================
function toggleSelectAll() {
  if (!selectAllCheckbox) return;
  const cart = getcart();
  const checkboxes = document.querySelectorAll(".cart-item-checkbox");

  if (selectAllCheckbox.checked) {
    cart.items.forEach((item) => selectedItems.add(item.productId));
    checkboxes.forEach((cb) => (cb.checked = true));
  } else {
    selectedItems.clear();
    checkboxes.forEach((cb) => (cb.checked = false));
  }
  updateSelectionUI(cart);
}

function toggleItemSelection(productId, checked) {
  if (checked) {
    selectedItems.add(productId);
  } else {
    selectedItems.delete(productId);
  }

  // Update select all checkbox state
  const cart = getcart();
  selectAllCheckbox.checked = selectedItems.size === cart.size && cart.size > 0;
  selectAllCheckbox.indeterminate =
    selectedItems.size > 0 && selectedItems.size < cart.size;

  updateSelectionUI(cart);
}

function calculateTotals(productIds, cartMap) {
  let subtotal = 0;
  let totalItems = 0;

  productIds.forEach((productId) => {
    const item = cartMap.get(productId);
    const product = getProduct(productId);
    if (item && product) {
      const price = product.details?.salePrice ?? product.getPrice();
      subtotal += price * item.quantity;
      totalItems += item.quantity;
    }
  });

  return { subtotal, totalItems }; 
}

function updateSelectionUI(cart = getcart()) {
  const cartMap = new Map(cart.items.map((i) => [String(i.productId), i]));
  const productIds =
    selectedItems.size > 0
      ? Array.from(selectedItems)
      : Array.from(cartMap.keys());

  const { subtotal, totalItems } = calculateTotals(productIds, cartMap);

  updateSummary(subtotal, totalItems, cart);

  if (removeSelectedBtn) {
    removeSelectedBtn.style.display =
      selectedItems.size > 0 ? "inline-block" : "none";
    removeSelectedBtn.textContent = `Remove Selected (${selectedItems.size})`;
  }
}

function removeSelectedItems() {
  if (selectedItems.size === 0) return;

  if (
    confirm(
      `Are you sure you want to remove ${selectedItems.size} selected item(s)?`
    )
  ) {
    selectedItems.forEach((productId) => removeFromCart(productId));
    selectedItems.clear();
    refreshCartFromStorage();
  }
}

// ============================================
// REMOVE ALL ITEMS
// ============================================
function removeAllItems() {
  const cart = getcart();
  if (!cart.size) return;

  if (confirm("Are you sure you want to remove all items from your cart?")) {
    clearCart();
    selectedItems.clear();
    refreshCartFromStorage();
  }
}

if (removeAllBtn) removeAllBtn.addEventListener("click", removeAllItems);
if (selectAllCheckbox)
  selectAllCheckbox.addEventListener("change", toggleSelectAll);
if (removeSelectedBtn)
  removeSelectedBtn.addEventListener("click", removeSelectedItems);

async function ensureProductsForCart(cartItems) {
  const missingIds = cartItems
    .map((item) => String(item.productId))
    .filter((id) => !getProduct(id));

  if (!missingIds.length) return;

  const fetched = await Promise.allSettled(
    missingIds.map(async (id) => {
      const apiProduct = await fetchProductById(id);
      return mapApiProduct(apiProduct);
    })
  );

  fetched.forEach((res) => {
    if (res.status === "fulfilled" && res.value) {
      const existing = getProduct(res.value.id);
      if (!existing) {
        PRODUCTS.push(res.value);
      }
    }
  });
}

// ============================================
// RENDER CART ITEMS
// ============================================
async function renderCartItems() {
  const cart = getcart();
  cartItemsList.innerHTML = "";

  if (cart.size === 0) {
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
    const product = getProduct(item.productId);
    if (!product) {
      console.warn("Product not found for ID:", item.productId);
      return;
    }

    const price = product.details?.salePrice ?? product.getPrice?.() ?? product.price ?? 0;
    const color = product.details?.color || "Standard";
    const size = product.details?.size || "One Size";
    const badge = product.details?.badge;
    
    const lineTotal = price * item.quantity;
    subtotal += lineTotal;
    totalItems += item.quantity;

    const isSelected = selectedItems.has(String(item.productId));
    const itemEl = document.createElement("div");
    itemEl.className = `cart-item ${isSelected ? "selected" : ""}`;
    const isMinQty = item.quantity <= 1;

    itemEl.innerHTML = `
      <div class="cart-item-select">
        <input type="checkbox" class="cart-item-checkbox" data-id="${item.productId}" ${
      isSelected ? "checked" : ""
    }>
      </div>
      <div class="cart-item-image">
        <img src="${product.image}" alt="${product.name}">
        ${badge ? `<span class="cart-item-badge">${badge}</span>` : ""}
      </div>
      <div class="cart-item-details">
        <div class="cart-item-info">
          <h3 class="cart-item-name">${product.name}</h3>
          <p class="cart-item-meta">${color} • ${size}</p>
        </div>
        <div class="cart-item-price">$${price.toFixed(2)}</div>
        <div class="cart-item-actions">
          <div class="qty-controls">
            <button class="qty-btn" data-action="decrease" data-id="${item.productId}" ${
      isMinQty ? "disabled" : ""
    }">−</button>
            <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn" data-action="increase" data-id="${item.productId}">+</button>
          </div>
            <button class="remove-btn" data-id="${item.productId}">Remove</button>
        </div>
      </div>
      <div class="cart-item-total">$${lineTotal.toFixed(2)}</div>
    `;

    cartItemsList.appendChild(itemEl);
  });

  updateSummary(subtotal, totalItems);
  attachItemEvents(cart);
  renderOrderSummary(cart);
}

function updateSummary(subtotal, totalItems, cart = getcart()) {
  const effectiveSubtotal = subtotal ?? cart.total ?? 0;
  const shipping = effectiveSubtotal > 0 ? SHIPPING_COST : 0;
  const total = effectiveSubtotal + shipping;

  subtotalEl.textContent = `$${effectiveSubtotal.toFixed(2)}`;
  shippingEl.textContent = effectiveSubtotal > 0 ? `$${shipping.toFixed(2)}` : "Free";
  totalEl.textContent = `$${total.toFixed(2)}`;
  itemCountEl.textContent = totalItems;
  if (cartCountEl) cartCountEl.textContent = cart.totalQuantity ?? totalItems;
}

function attachItemEvents(cart = getcart()) {
  // Checkbox selection
  document.querySelectorAll(".cart-item-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const id = checkbox.dataset.id;
      toggleItemSelection(id, checkbox.checked);

      // Update visual state
      const cartItem = checkbox.closest(".cart-item");
      if (checkbox.checked) {
        cartItem.classList.add("selected");
      } else {
        cartItem.classList.remove("selected");
      }
    });
  });

  // Quantity buttons
  document.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const item = cart.items.find((i) => String(i.productId) === String(id));
      if (!item) return;

      if (action === "increase") {
        changeCartQuantity(id, item.quantity + 1);
        refreshCartFromStorage();
      } else if (action === "decrease") {
        if (item.quantity === 1) return;
        changeCartQuantity(id, item.quantity - 1);
        refreshCartFromStorage();
      }
    });
  });

  // Remove buttons
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      selectedItems.delete(id);
      removeFromCart(id);
      refreshCartFromStorage();
    });
  });
}

function renderOrderSummary(cart = getcart()) {
  if (!orderSummary) return; // stop if element not found

  const lines = cart.items.map((item) => {
    const product = PRODUCTS.find((p) => p.id == item.productId);
    if (!product) return ""; // skip if product missing
    const unit = product.details?.salePrice ?? product.getPrice?.() ?? product.price ?? 0;
    const lineTotal = unit * item.quantity;
    return `
      <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem">
        <div>${escapeHtml(product.name)} x ${item.quantity}</div>
        <div><strong>$${formatPrice(lineTotal)}</strong></div>
      </div>
    `;
  });

  const subtotal = cart.total ?? cart.items.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id == item.productId);
    if (!product) return sum;
    const unit = product.details?.salePrice ?? product.getPrice?.() ?? product.price ?? 0;
    return sum + unit * item.quantity;
  }, 0);

  const shipping = subtotal > 0 ? SHIPPING_COST : 0; // hardcoded shipping cost
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

export function onPrintReceipt(cartItems) {
  const printWindow = window.open("", "_blank", "width=800,height=600");
  if (!printWindow) {
    alert("Unable to open print window. Please allow popups for this site.");
    return;
  }

  const date = new Date().toLocaleString();
  const storeName = "ShopLight";

  const itemsHtml = cartItems
    .map((item) => {
      const p = PRODUCTS.find((x) => x.id === item.productId);
      if (!p) return "";
      const unitPrice = p.details?.salePrice ?? p.getPrice() ?? 0;
      return `<tr>
        <td style="padding:6px 8px">${escapeHtml(p.name)}</td>
        <td style="padding:6px 8px;text-align:center">${item.quantity}</td>
        <td style="padding:6px 8px;text-align:right">$${formatPrice(unitPrice)}</td>
        <td style="padding:6px 8px;text-align:right">$${formatPrice(unitPrice * item.quantity)}</td>
      </tr>`;
    })
    .join("");

  const subtotal = cartItems.reduce((s, i) => {
    const p = PRODUCTS.find((x) => x.id === i.productId);
    const unit = p ? p.details?.salePrice ?? p.getPrice?.() ?? p.price ?? 0 : 0;
    return s + unit * i.quantity;
  }, 0);

  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  const html = `
    <html>
      <head>
        <title>Receipt - ${storeName}</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; padding:20px; color:#111 }
          h1 { margin:0 0 8px 0 }
          table { width:100%; border-collapse:collapse; margin-top:12px }
          td, th { border-bottom:1px solid #eee }
          .totals { margin-top:12px; width:100% }
          .right { text-align:right }
        </style>
      </head>
      <body>
        <h1>${storeName}</h1>
        <div>Receipt — ${date}</div>
        <table>
          <thead>
            <tr>
              <th style="text-align:left">Item</th>
              <th style="text-align:center">Qty</th>
              <th style="text-align:right">Unit</th>
              <th style="text-align:right">Line</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <div class="totals">
          <div style="display:flex;justify-content:space-between"><div>Subtotal</div><div class="right">$${formatPrice(subtotal)}</div></div>
          <div style="display:flex;justify-content:space-between"><div>Shipping</div><div class="right">$${formatPrice(shipping)}</div></div>
          <div style="display:flex;justify-content:space-between;font-weight:700;margin-top:8px"><div>Total</div><div class="right">$${formatPrice(total)}</div></div>
        </div>
        <div style="margin-top:18px">Thank you for shopping with us.</div>
        <script>window.onload = function(){ window.print(); }</script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}


// ============================================
// CHECKOUT MODAL
// ============================================
function closeModal() {
  if (!checkoutModal) return;
  checkoutModal.classList.remove("active");
  checkoutModal.setAttribute("aria-hidden", "true");
  setTimeout(() => {
    if (step1 && step2) {
      step1.style.display = "block";
      step2.style.display = "none";
    }
  }, 300);
}

if (checkoutBtn)
  checkoutBtn.addEventListener("click", () => {
    const cart = getcart();
    if (!cart.size) {
      alert("Your cart is empty!");
      return;
    }
    window.location.href = "/pages/checkout/checkout.html";
  });

if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
if (cancelCheckoutBtn) cancelCheckoutBtn.addEventListener("click", closeModal);

let lastOrderItems = [];

if (confirmPaymentBtn)
  confirmPaymentBtn.addEventListener("click", () => {
    const cart = getcart();
    lastOrderItems = cart.items.map((i) => ({ ...i }));

    if (step1 && step2) {
      step1.style.display = "none";
      step2.style.display = "block";
    }

    refreshCartFromStorage();
  });


if (printReceiptBtn) {
  printReceiptBtn.addEventListener("click", () => {
    if (lastOrderItems.length === 0) {
      alert("No order to print.");
      return;
    }

    onPrintReceipt(lastOrderItems);

    clearCart();
    refreshCartFromStorage();
  });
}


if (closeCheckoutBtn) closeCheckoutBtn.addEventListener("click", closeModal);

if (checkoutModal) {
  checkoutModal.addEventListener("click", (e) => {
    if (e.target === checkoutModal) {
      closeModal();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && checkoutModal?.classList.contains("active")) {
    closeModal();
  }
});

async function refreshCartFromStorage() {
  if (window.shoppingCart?.load) {
    window.shoppingCart.load();
  }

  const cart = getcart();
  selectedItems = new Set(
    Array.from(selectedItems).filter((id) =>
      cart.items.some((item) => String(item.productId) === String(id))
    )
  );

  await renderCartItems();
  updateSelectionUI();
  updateCartCount();
}

// Keep cart page in sync when localStorage changes in another tab
window.addEventListener("storage", (event) => {
  const storageKey = window.shoppingCart?.STORAGE_CART;
  if (!storageKey) return;

  if (event.key === null || event.key === storageKey) {
    refreshCartFromStorage();
  }
});

// Keep cart UI in sync when cart changes in the same tab
window.addEventListener("cart:updated", () => {
  refreshCartFromStorage();
});

// ============================================
// INIT
// ============================================
async function init() {
  await initCart();
  await productsReady;
  await refreshCartFromStorage();
}

init();