import { initApp } from "./scripts/initApp.js";
import { initHomePage } from "./scripts/pages/home.page.js";
import { initProductsPage } from "./scripts/pages/products.page.js";
import { initProductDetailPage } from "./scripts/pages/product-detail.page.js";
import { initCheckout } from "./scripts/pages/checkout.page.js";

console.log('Main JS loaded');
insertNavBar(document.body);
initApp();
initHomePage();
initProductsPage();
initProductDetailPage();
initCheckout();
