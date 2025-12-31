// Main app logic for the demo e-commerce frontend
import {
    PRODUCTS,
    getProducts,
    extractProductsCategories,
} from "./modules/products/products.data.js";
import ProductList from "./components/product-list.js";
import Toast from "./components/toast.js";
import { addToCart, renderCart, closeCheckout } from "./components/Cart/CartSystem.js";
import { closeQuickViewModal } from "./components/quick-view-model.js";
import { initCart } from "./modules/cart/cart.store.js";
import "./components/Cart/cart-drawer.js";

// DOM Elements - Updated for professional design
const productGrid = document.getElementById("productGrid");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("searchInput");
const checkoutModal = document.getElementById("checkoutModal");

const favoritesBtn = document.getElementById("favoritesBtn");

// function debounce(func, wait) {
//     let timeout;
//     return function (...args) {
//         const later = () => {
//             clearTimeout(timeout);
//             func(...args);
//         };
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//     };
// }

function toggleFav(id) {
    if (window.favorites?.toggle) {
        window.favorites.toggle(id);
    }
}

window.toggleFav = toggleFav;
window.addToCart = addToCart;

// Filtering / sorting
function onFilterChange() {
    const q = (searchInput.value || "").trim().toLowerCase();
    const cat = categoryFilter.value;
    const sort = sortSelect.value;
    const favoritesSet = window.favorites?.items || new Set();

    let list = PRODUCTS.filter((p) => {
        const matchesQuery =
            p.name.toLowerCase().includes(q) ||
            (p.description || "").toLowerCase().includes(q);
        const matchesCategory =
            cat === "favorites"
                ? favoritesSet.has(p.id)
                : cat === "all" || p.details.category === cat;
        p.isFavorite = favoritesSet.has(p.id);
        return matchesQuery && matchesCategory;
    });

    if (sort === "price-asc") {
        list.sort((a, b) => a.getPrice() - b.getPrice());
    } else if (sort === "price-desc") {
        list.sort((a, b) => b.getPrice() - a.getPrice());
    } else if (sort === "rating") {
        list.sort((a, b) => (b.details.rating || 0) - (a.details.rating || 0));
    }

    renderProducts(list);
}

function wireEvents() {

    searchInput.addEventListener("input", onFilterChange);
    categoryFilter.addEventListener("change", onFilterChange);
    sortSelect.addEventListener("change", onFilterChange);

    favoritesBtn.addEventListener("click", () => {
        const favCount = window.favorites?.items?.size || 0;
        categoryFilter.value = favCount > 0 ? "favorites" : "all";
        onFilterChange();
        Toast(
            favCount > 0 ? `Showing ${favCount} favorites` : "No favorites yet",
            favCount > 0 ? "success" : "error"
        );
    });

    // close modal on overlay click
    if (checkoutModal) {
        checkoutModal.addEventListener("click", (e) => {
            if (e.target === checkoutModal) closeCheckout();
        });
    }

    // keyboard accessibility
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeCheckout();
            closeQuickViewModal();
        }
    });
}

function populateCategoryFilter() {
    return extractProductsCategories().then((categories) => {
        categories.forEach((cat) => {
            const opt = document.createElement("option");
            opt.value = cat;
            opt.textContent = cat;
            categoryFilter.appendChild(opt);
        });
    });
}

// Render product cards with premium UI
function renderProducts(products_list) {
    productGrid.innerHTML = "";
    if (!products_list.length) {
        productGrid.innerHTML = '<p class="muted">No products found.</p>';
        return;
    }
    productGrid.appendChild(ProductList(products_list));
}

// Initialize the app
async function init() {
    // Ensure cart store and products are ready before rendering
    initCart();
    await getProducts();
    await populateCategoryFilter();
    renderProducts(PRODUCTS);
    await renderCart();
    wireEvents();
}

init();
