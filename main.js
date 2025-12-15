import { setText } from "./core/utils/dom.js";
import { initCart } from "./modules/cart/cart.store.js";
import { initFavorites } from "./modules/products/favorites.store.js";
import { PRODUCTS, getProduct } from "./modules/products/products.data.js";
import ProductList from "./modules/products/product-list.js";
import ProductDetail from "./modules/products/product-detail.js";
import { initQuickView } from "./modules/products/quick-view.js";
import { initCheckoutPage } from "./modules/cart/checkout.js";

function initYear() {
    setText(document.getElementById("year"), new Date().getFullYear());
}

function initHomePage() {
    const grid = document.getElementById("featuredGrid");
    if (!grid) return;
    const featured = PRODUCTS.slice(0, 4);
    grid.appendChild(ProductList(featured));
}

function initProductPage() {
    const root = document.getElementById("productRoot");
    if (!root) return;

    const getProductDetailHref = (productId) => {
        const path = String(location.pathname || "");
        // When you're already on /pages/product.html, stay on the same page.
        if (path.endsWith("/pages/product.html")) {
            return `./product.html?id=${encodeURIComponent(productId)}`;
        }
        // From index.html (or other root-level pages), navigate into /pages.
        return `./pages/product.html?id=${encodeURIComponent(productId)}`;
    };

    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    // If no id is provided, treat this as the Products listing page.
    if (!id) {
        root.innerHTML = `
            <div class="section-header">
                <h1 class="section-title">Products</h1>
                <a href="../index.html" class="filter-select">Back to home</a>
            </div>
            <div id="productsGrid" class="product-grid" role="list"></div>
        `;

        const grid = document.getElementById("productsGrid");
        if (!grid) return;

        grid.appendChild(ProductList(PRODUCTS));

        // Make cards clickable for navigation, but ignore interactive controls.
        grid.addEventListener("click", (e) => {
            const target = e.target;
            if (!(target instanceof Element)) return;
            if (target.closest("button")) return;

            const card = target.closest(".card");
            const productId = card?.getAttribute("data-product-id") || "";
            if (!productId) return;

            location.href = getProductDetailHref(productId);
        });

        return;
    }

    const p = getProduct(id);
    if (!p) {
        root.innerHTML =
            '<p class="muted">Product not found. <a href="../index.html">Back to home</a></p>';
        return;
    }

    root.innerHTML = "";
    root.appendChild(ProductDetail(p));
}

initYear();
const favorites = initFavorites();
// Reflect favorites state on product objects (keeps UI consistent).
for (const p of PRODUCTS) {
    p.isFavorite = favorites?.has?.(p.id) ?? false;
}

// Keep favorites toggles in sync with product objects.
window.toggleFav = (productId) => {
    favorites?.toggle?.(productId);
    const p = getProduct(productId);
    if (p) p.isFavorite = favorites?.has?.(productId) ?? false;
};

initCart();
initQuickView();
initHomePage();
initProductPage();
initCheckoutPage();
