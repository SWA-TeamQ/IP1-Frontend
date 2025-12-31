import ProductList from "../../modules/products/product-list.js";
import { fetchProducts, getCategories, filterProducts, getFavoriteProducts } from "../../modules/products/product.api.js";

export async function initProductsPage() {
    const grid = document.getElementById("productsGrid");
    const categoryContainer = document.getElementById("categoryList");
    if (!grid || !categoryContainer) return;

    const products = await fetchProducts();
    renderProducts(products);

    // Render category buttons
    const categories = ["All", "Favorites", ...getCategories()];
    categoryContainer.innerHTML = categories
        .map(cat => `<button class="btn category-btn" data-cat="${cat}">${cat}</button>`)
        .join("");

    // Add click handlers
    categoryContainer.querySelectorAll(".category-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const cat = btn.dataset.cat;
            let filtered = products;

            if (cat === "Favorites") filtered = getFavoriteProducts();
            else if (cat !== "All") filtered = filterProducts(cat);

            renderProducts(filtered);
        });
    });

    function renderProducts(list) {
        grid.innerHTML = "";
        grid.appendChild(ProductList(list));
    }
}
