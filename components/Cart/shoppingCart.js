import { PRODUCTS } from "../../js/data/products.js";
import { escapeHtml, formatPrice } from "../../js/lib/utils.js";

const STORAGE_CART = "shop_cart_v1";
const SHIPPING_COST = 5.99;

function getProduct(id) {
  const product = PRODUCTS.find((p) => p.id === id || p.id === String(id));
  if (!product) {
    console.warn(`Product not found for id: ${id}`);
  }
  return product;
}

function getCart() {
  try {
    const cart = localStorage.getItem(STORAGE_CART);
    console.log("Raw cart from localStorage:", cart);
    const parsed = cart ? JSON.parse(cart) : null;
    console.log("Parsed cart:", parsed);
    if (parsed && parsed.items) {
      const cartMap = new Map(parsed.items);
      console.log("Cart Map:", [...cartMap.entries()]);
      return cartMap;
    }
    return new Map();
  } catch (e) {
    console.error("Error loading cart:", e);
    return new Map();
  }
}

function saveCart(cartMap) {
  const toStore = JSON.stringify({ items: [...cartMap], total: 0 });
  localStorage.setItem(STORAGE_CART, toStore);
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
  const cart = getCart();
  const checkboxes = document.querySelectorAll(".cart-item-checkbox");

  if (selectAllCheckbox.checked) {
    cart.forEach((item, productId) => selectedItems.add(productId));
    checkboxes.forEach((cb) => (cb.checked = true));
  } else {
    selectedItems.clear();
    checkboxes.forEach((cb) => (cb.checked = false));
  }
  updateSelectionUI();
}

function toggleItemSelection(productId, checked) {
  if (checked) {
    selectedItems.add(productId);
  } else {
    selectedItems.delete(productId);
  }

  // Update select all checkbox state
  const cart = getCart();
  selectAllCheckbox.checked = selectedItems.size === cart.size && cart.size > 0;
  selectAllCheckbox.indeterminate =
    selectedItems.size > 0 && selectedItems.size < cart.size;

  updateSelectionUI();
}

function calculateTotals(productIds, cart) {
  let subtotal = 0;
  let totalItems = 0;

  productIds.forEach((productId) => {
    const item = cart.get(productId);
    const product = getProduct(productId);
    if (item && product) {
      const price = product.salePrice || product.price;
      subtotal += price * item.quantity;
      totalItems += item.quantity;
    }
  });

  return { subtotal, totalItems }; 
}

function updateSelectionUI() {
  const cart = getCart();
  const productIds =
    selectedItems.size > 0
      ? Array.from(selectedItems)
      : Array.from(cart.keys());

  const { subtotal, totalItems } = calculateTotals(productIds, cart);

  updateSummary(subtotal, totalItems);

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
    const cart = getCart();
    selectedItems.forEach((productId) => cart.delete(productId));
    saveCart(cart);
    selectedItems.clear();
    renderCartItems();
    renderOrderSummary();
  }
}

// ============================================
// REMOVE ALL ITEMS
// ============================================
function removeAllItems() {
  const cart = getCart();
  if (cart.size === 0) return;

  if (confirm("Are you sure you want to remove all items from your cart?")) {
    saveCart(new Map());
    selectedItems.clear();
    renderCartItems();
    renderOrderSummary();
  }
}

removeAllBtn.addEventListener("click", removeAllItems);
if (selectAllCheckbox)
  selectAllCheckbox.addEventListener("change", toggleSelectAll);
if (removeSelectedBtn)
  removeSelectedBtn.addEventListener("click", removeSelectedItems);

// ============================================
// RENDER CART ITEMS
// ============================================
function renderCartItems() {
  const cart = getCart();
  cartItemsList.innerHTML = "";

  if (cart.size === 0) {
    cartEmpty.style.display = "flex";
    cartItemsList.style.display = "none";
    updateSummary(0, 0);
    return;
  }

  cartEmpty.style.display = "none";
  cartItemsList.style.display = "block";

  let subtotal = 0;
  let totalItems = 0;

  cart.forEach((item, productId) => {
    console.log("Processing cart item:", { productId, item });
    const product = getProduct(productId);
    console.log("Found product:", product);
    if (!product) {
      console.warn("Product not found for ID:", productId);
      return;
    }

    const price = product.details.salePrice ?? product.price ?? 0;
    const color = product.details.color;
    const size = product.details.size;
    const badge = product.details.badge;
    
    const lineTotal = price * item.quantity;
    subtotal += lineTotal;
    totalItems += item.quantity;

    const isSelected = selectedItems.has(productId);
    const itemEl = document.createElement("div");
    itemEl.className = `cart-item ${isSelected ? "selected" : ""}`;
    const isMinQty = item.quantity <= 1;

    itemEl.innerHTML = `
      <div class="cart-item-select">
        <input type="checkbox" class="cart-item-checkbox" data-id="${productId}" ${
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
            <button class="qty-btn" data-action="decrease" data-id="${productId}" ${
      isMinQty ? "disabled" : ""
    }">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" data-action="increase" data-id="${productId}">+</button>
          </div>
          <button class="remove-btn" data-id="${productId}">Remove</button>
        </div>
      </div>
      <div class="cart-item-total">$${lineTotal.toFixed(2)}</div>
    `;

    cartItemsList.appendChild(itemEl);
  });

  updateSummary(subtotal, totalItems);
  attachItemEvents();
  renderOrderSummary();
}

function updateSummary(subtotal, totalItems) {
  const shipping = subtotal > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  shippingEl.textContent = subtotal > 0 ? `$${shipping.toFixed(2)}` : "Free";
  totalEl.textContent = `$${total.toFixed(2)}`;
  itemCountEl.textContent = totalItems;
  if (cartCountEl) cartCountEl.textContent = totalItems;
}

function attachItemEvents() {
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
      const cart = getCart();
      const item = cart.get(id);

      if (action === "increase") {
        item.quantity++;
      } else if (action === "decrease") {
        if (item.quantity === 1) return;
        item.quantity--;
      }

      cart.set(id, item);
      saveCart(cart);
      renderCartItems();
      renderOrderSummary();
    });
  });

  // Remove buttons
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const cart = getCart();
      cart.delete(id);
      selectedItems.delete(id);
      saveCart(cart);
      renderCartItems();
      renderOrderSummary();
    });
  });
}

function renderOrderSummary() {
  if (!orderSummary) return; // stop if element not found

  const cart = getCart(); // use your existing cart
  const cartItems = Array.from(cart.values());

  const lines = cartItems.map((item) => {
    const product = PRODUCTS.find((p) => p.id == item.productId);
    if (!product) return ""; // skip if product missing
    const unit = product.details?.salePrice ?? product.price ?? 0;
    const lineTotal = unit * item.quantity;
    return `
      <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem">
        <div>${escapeHtml(product.name)} x ${item.quantity}</div>
        <div><strong>$${formatPrice(lineTotal)}</strong></div>
      </div>
    `;
  });

  const subtotal = cartItems.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id == item.productId);
    if (!product) return sum;
    const unit = product.details?.salePrice ?? product.price ?? 0;
    return sum + unit * item.quantity;
  }, 0);

  const shipping = subtotal > 0 ? 5.99 : 0; // hardcoded shipping cost
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
      const unitPrice = p.details?.salePrice ?? p.price ?? 0;
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
    const unit = p ? p.details?.salePrice ?? p.price ?? 0 : 0;
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
  checkoutModal.classList.remove("active");
  checkoutModal.setAttribute("aria-hidden", "true");
  setTimeout(() => {
    step1.style.display = "block";
    step2.style.display = "none";
  }, 300);
}

checkoutBtn.addEventListener("click", () => {
  const cart = getCart();
  if (cart.size === 0) {
    alert("Your cart is empty!");
    return;
  }
  checkoutModal.classList.add("active");
  checkoutModal.setAttribute("aria-hidden", "false");
  renderOrderSummary();
});

closeModalBtn.addEventListener("click", closeModal);
cancelCheckoutBtn.addEventListener("click", closeModal);

let lastOrderItems = [];

confirmPaymentBtn.addEventListener("click", () => {
  const cart = getCart();

  lastOrderItems = Array.from(cart.values());

  step1.style.display = "none";
  step2.style.display = "block";
});


if (printReceiptBtn) {
  printReceiptBtn.addEventListener("click", () => {
    if (lastOrderItems.length === 0) {
      alert("No order to print.");
      return;
    }

    onPrintReceipt(lastOrderItems);

    saveCart(new Map());
    renderCartItems();
  });
}


closeCheckoutBtn.addEventListener("click", closeModal);

checkoutModal.addEventListener("click", (e) => {
  if (e.target === checkoutModal) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && checkoutModal.classList.contains("active")) {
    closeModal();
  }
});

// ============================================
// INIT
// ============================================
renderCartItems();
renderOrderSummary();
