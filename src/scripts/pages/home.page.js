import { fetchProducts } from "src/modules/products/product.api.js";
import ProductList from "../../components/product-list.js";

export function initHomePage() {
    const grid = document.getElementById("featuredGrid");
    if (!grid) return;

    const featured = PRODUCTS.slice(0, 4);
    grid.appendChild(ProductList(featured));
}
