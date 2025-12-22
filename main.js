import { initApp } from "./app/initApp.js";
import { initHomePage } from "./app/pages/home.page.js";
import { initProductsPage } from "./app/pages/products.page.js";
import { initProductDetailPage } from "./app/pages/product-detail.page.js";
import { initCheckout } from "./app/pages/checkout.page.js";

// Initialize app, then initialize pages (ensures products and stores are ready)
initApp().then(() => {
  // Home page
  if (document.getElementById("featuredGrid")) {
    initHomePage();
  }

  // Products page
  if (document.getElementById("productsGrid")) {
    initProductsPage();
  }

  // Product detail page (detect by root container id)
  if (document.getElementById("productDetailRoot")) {
    initProductDetailPage();
  }

  // Checkout page
  if (document.querySelector(".checkout-page")) {
    initCheckout();
  }
});
