// Main app logic for the demo e-commerce frontend
import { extractProductsCategories, PRODUCTS as products } from "./js/data/products.js";
import ProductList from "./components/product-list.js";
import Toast from "./components/toast.js";
import { addToCart, renderCart } from "./components/Cart/CartSystem.js";

// DOM Elements - Updated for professional design
const productGrid = document.getElementById("productGrid");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("searchInput");

const favoritesBtn = document.getElementById("favoritesBtn");

function toggleFav(id) {
    window.favorites.toggle(id);
}

window.toggleFav = toggleFav;
window.addToCart = addToCart;

// Filtering / sorting
function onFilterChange() {
    const q = (searchInput.value || "").trim().toLowerCase();
    const cat = categoryFilter.value;
    const sort = sortSelect.value;

    let list = products.filter((p) => {
        const matchesQuery =
            p.name.toLowerCase().includes(q) ||
            (p.description || "").toLowerCase().includes(q);
        const matchesCategory = cat === "all" || p.details.category === cat;
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
        const favCount = window.favorites.items.length;
        categoryFilter.value = favCount > 0 ? "favorites" : "all";
        onFilterChange();
        Toast(
            favCount > 0 ? `Showing ${favCount} favorites` : "No favorites yet",
            favCount > 0 ? "success" : "error"
        );
    });

    // close modal on overlay click
    checkoutModal.addEventListener("click", (e) => {
        if (e.target === checkoutModal) closeCheckout();
    });

    // keyboard accessibility
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeCheckout();
            closeQuickViewModal();
        }
    });
}

function populateCategoryFilter() {
    const categories = extractProductsCategories();
    categories.forEach((cat) => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        categoryFilter.appendChild(opt);
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
populateCategoryFilter();
renderProducts(products);
renderCart();
wireEvents();
