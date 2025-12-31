const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const closeCartBtn = document.getElementById("closeCart");

export function openCartDrawer(event) {
  if (event) event.preventDefault();
  if (cartDrawer) cartDrawer.setAttribute("aria-hidden", "false");
}

export function closeCartDrawer() {
  if (cartDrawer) cartDrawer.setAttribute("aria-hidden", "true");
}

function handleEscape(e) {
  if (e.key === "Escape") closeCartDrawer();
}

if (cartBtn && cartDrawer) {
  cartBtn.addEventListener("click", openCartDrawer);
}

if (closeCartBtn) {
  closeCartBtn.addEventListener("click", closeCartDrawer);
}

document.addEventListener("keydown", handleEscape);
