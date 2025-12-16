import { PRODUCTS } from "../../modules/products/products.data.js";
import ProductList from "../../modules/products/product-list.js";

export function initProductsPage() {
    const grid = document.getElementById("productsGrid");
    if(!grid) return;
    grid.appendChild(ProductList(PRODUCTS));
}
