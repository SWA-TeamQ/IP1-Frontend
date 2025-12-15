import { PRODUCTS } from "../../modules/products/products.data.js";
import ProductList from "../../modules/products/product-list.js";

export function initProductsPage() {
    const root = document.getElementById("productRoot");
    if (!root) return;

    root.innerHTML = `
        <div class="section-header">
            <h1 class="section-title">Products</h1>
            <a href="../../index.html" class="filter-select">Back to home</a>
        </div>
        <div id="productsGrid" class="product-grid" role="list"></div>
    `;

    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    grid.appendChild(ProductList(PRODUCTS));
}
