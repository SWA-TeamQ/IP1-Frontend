import { PRODUCTS, getProduct } from "../../js/data/products.js";
import { formatPrice } from "../../js/lib/utils.js";
import { onPrintReceipt } from "../../js/lib/printReciept.js";

const SHIPPING = {
  standard: { label: "Standard", cost: 5.99, eta: "4-6 business days" },
  express: { label: "Express", cost: 14.99, eta: "1-2 business days" },
};

const PROMOS = {
  SAVE10: 0.1,
};

const state = {
  step: 0,
  shipping: "standard",
  promo: null,
};

let lastOrderItems = [];

function getCartItems() {
  window.shoppingCart?.load?.();
  return Array.from(window.shoppingCart?.items?.values() || []);
}

function computeTotals(items) {
  const subtotal = items.reduce((sum, item) => {
    const product = getProduct(item.productId);
    const price = product?.details?.salePrice ?? product?.getPrice?.() ?? item.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const shipping = SHIPPING[state.shipping]?.cost ?? 0;
  const discount = state.promo ? subtotal * state.promo : 0;
  const total = subtotal + shipping - discount;
  return { subtotal, shipping, discount, total };
}

function renderSummary() {
  const items = getCartItems();
  const container = document.getElementById("summaryItems");
  if (!container) return;
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = '<p class="muted">Your cart is empty.</p>';
  } else {
    items.forEach((item) => {
      const product = getProduct(item.productId);
      if (!product) return;
      const unit = product.details?.salePrice ?? product.getPrice?.() ?? item.price ?? 0;
      const line = unit * item.quantity;
      const row = document.createElement("div");
      row.className = "summary-item";
      row.innerHTML = `<span>${product.name} <span class="muted">x${item.quantity}</span></span><span>$${formatPrice(line)}</span>`;
      container.appendChild(row);
    });
  }

  const { subtotal, shipping, discount, total } = computeTotals(items);
  document.getElementById("summarySubtotal").textContent = `$${formatPrice(subtotal)}`;
  document.getElementById("summaryShipping").textContent = shipping > 0 ? `$${formatPrice(shipping)}` : "Free";
  document.getElementById("summaryDiscount").textContent = `-$${formatPrice(discount)}`;
  document.getElementById("summaryTotal").textContent = `$${formatPrice(total)}`;
}

function setStep(next) {
  const steps = Array.from(document.querySelectorAll("[data-step]"));
  const indicators = Array.from(document.querySelectorAll("[data-step-indicator]"));

  steps.forEach((section, idx) => {
    section.hidden = idx !== next;
  });
  indicators.forEach((el, idx) => {
    el.classList.toggle("active", idx === next);
  });

  state.step = next;
  document.getElementById("backBtn").disabled = next === 0;
  document.getElementById("nextBtn").hidden = next === steps.length - 1;
  document.getElementById("placeOrderBtn").hidden = next !== steps.length - 1;
}

function showError(msg) {
  const el = document.getElementById("formError");
  if (!el) return;
  if (!msg) {
    el.hidden = true;
    el.textContent = "";
  } else {
    el.hidden = false;
    el.textContent = msg;
  }
}

function validateStep(stepIdx) {
  const form = document.getElementById("checkoutForm");
  if (!form) return false;
  showError("");

  if (stepIdx === 0) {
    const required = ["fullName", "email", "phone", "country", "city", "postal", "address"];
    for (const name of required) {
      const input = form.elements[name];
      if (!input || !input.value.trim()) {
        showError("Please fill out all required shipping fields.");
        input?.focus();
        return false;
      }
    }
    const emailInput = form.elements["email"];
    if (emailInput && !emailInput.checkValidity()) {
      showError("Enter a valid email address.");
      emailInput.focus();
      return false;
    }
  }

  if (stepIdx === 1) {
    const shipping = form.elements["shipping"]?.value;
    if (!shipping) {
      showError("Select a delivery method.");
      return false;
    }
    state.shipping = shipping;
  }

  if (stepIdx === 2) {
    const required = ["cardName", "cardNumber", "expiry", "cvv"];
    for (const name of required) {
      const input = form.elements[name];
      if (!input || !input.value.trim()) {
        showError("Please complete your payment details.");
        input?.focus();
        return false;
      }
      if (!input.checkValidity()) {
        showError("Please check your payment details format.");
        input.focus();
        return false;
      }
    }
  }

  return true;
}

function applyPromo() {
  const input = document.querySelector("input[name='promo']");
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  if (!code) {
    state.promo = null;
    showError("");
    renderSummary();
    return;
  }
  if (PROMOS[code]) {
    state.promo = PROMOS[code];
    showError("Promo applied: " + code);
    renderSummary();
  } else {
    state.promo = null;
    showError("Promo code not recognized.");
    renderSummary();
  }
}

function wireNav() {
  const backBtn = document.getElementById("backBtn");
  const nextBtn = document.getElementById("nextBtn");
  const placeOrderBtn = document.getElementById("placeOrderBtn");
  const form = document.getElementById("checkoutForm");

  backBtn?.addEventListener("click", () => {
    showError("");
    setStep(Math.max(0, state.step - 1));
  });

  nextBtn?.addEventListener("click", () => {
    if (!validateStep(state.step)) return;
    setStep(state.step + 1);
  });

  const submitOrder = (e) => {
    e?.preventDefault();
    // Only place the order on the final step; otherwise advance
    if (state.step < 2) {
      if (!validateStep(state.step)) return;
      setStep(state.step + 1);
      return;
    }

    if (!validateStep(state.step)) return;
    const items = getCartItems();
    if (!items.length) {
      showError("Your cart is empty.");
      return;
    }
    lastOrderItems = items.map((i) => ({ ...i }));
    window.shoppingCart?.clear?.();
    renderSummary();
    showSuccessModal();
  };

  placeOrderBtn?.addEventListener("click", submitOrder);
  form?.addEventListener("submit", submitOrder);
}

function showSuccessModal() {
  const modal = document.getElementById("receiptModal");
  const downloadBtn = document.getElementById("downloadReceipt");
  const closeBtn = document.getElementById("closeReceipt");
  if (!modal || !downloadBtn || !closeBtn) return;

  modal.hidden = false;
  modal.style.display = "flex";

  const handleEscape = (e) => {
    if (e.key === "Escape") {
      close();
    }
  };

  downloadBtn.onclick = () => {
    if (!lastOrderItems.length) return;
    const popup = onPrintReceipt(lastOrderItems, PRODUCTS);
    if (!popup) {
      alert("Please allow popups to view/print your receipt.");
    }
  };

  const close = () => {
    modal.hidden = true;
    modal.style.display = "none";
    document.removeEventListener("keydown", handleEscape);
    resetForm();
  };

  closeBtn.onclick = close;
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener("keydown", handleEscape);
}

function resetForm() {
  const form = document.getElementById("checkoutForm");
  if (form) {
    form.reset();
  }
  state.step = 0;
  state.shipping = "standard";
  state.promo = null;
  lastOrderItems = [];
  setStep(0);
  renderSummary();
}

function init() {
  if (typeof window.shoppingCart === "undefined") {
    console.warn("shoppingCart not found");
  }
  setStep(0);
  renderSummary();
  wireNav();
  document.getElementById("applyPromo")?.addEventListener("click", applyPromo);
  document.querySelectorAll("input[name='shipping']").forEach((input) => {
    input.addEventListener("change", () => {
      state.shipping = input.value;
      renderSummary();
    });
  });
}

init();