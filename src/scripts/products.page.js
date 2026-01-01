import { $ } from "/src/utils/dom.js";
import { fetchProducts, getCategories, filterProducts, getFavoriteProducts } from "../modules/products/product.api.js";
import ProductList from "../modules/products/product-list.js";
import { renderSkeletons } from "/src/components/skeleton.js";

export async function initProductsPage() {
    const grid = $("#productsGrid");
    const categoryList = $("#categoryList");

    if (!grid) return;

    // Initial state: Show skeletons and fetch data
    renderSkeletons(grid, 20);
    
    const products = await fetchProducts();
    let currentCategory = "all";

    const renderCurrent = () => {
        grid.innerHTML = "";
        
        const list = currentCategory === "all" ? products : 
                     currentCategory === "favorites" ? getFavoriteProducts() : 
                     filterProducts(currentCategory);

        if (!list || list.length === 0) {
            grid.innerHTML = `<div class="product-detail-shell"><p class="muted">No products found.</p></div>`;
            return;
        }

        grid.appendChild(ProductList(list, renderCurrent));
    };

    // Render Categories UI
    if (categoryList) {
        categoryList.innerHTML = "";
        ["all", "favorites", ...getCategories()].forEach(cat => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "filter-select";
            btn.textContent = cat;
            btn.onclick = () => {
                currentCategory = cat;
                renderCurrent();
            };
            categoryList.appendChild(btn);
        });
    }

    renderCurrent();
}