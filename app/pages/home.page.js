import { PRODUCTS } from "../../modules/products/products.data.js";
import ProductList from "../../modules/products/product-list.js";

export function initHomePage() {
    const grid = document.getElementById("featuredGrid");
    if (!grid) return;

    const featured = PRODUCTS.slice(0, 4);
    grid.appendChild(ProductList(featured));
}
